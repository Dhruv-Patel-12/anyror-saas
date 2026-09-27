import cv2
import numpy as np
from pathlib import Path

def slice_image_into_rows(image_path: str, output_dir: str) -> list[str]:
    """
    Reads a mutation entry image, detects text blocks, filters out blank/noise images,
    and returns a list of paths to the valid crops.
    """
    print(f"🔪 Slicing image: {Path(image_path).name}")
    
    img = cv2.imread(image_path)
    if img is None:
        return []

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Adaptive thresholding: Text becomes white, background becomes black
    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 15, 5
    )
    
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (80, 10))
    dilated = cv2.dilate(thresh, kernel, iterations=2)
    
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    valid_boxes = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        if w > 150 and h > 30:
            valid_boxes.append((x, y, w, h))
            
    valid_boxes = sorted(valid_boxes, key=lambda b: b[1])
    
    crop_paths = []
    base_name = Path(image_path).stem
    out_dir_path = Path(output_dir)
    
    for i, (x, y, w, h) in enumerate(valid_boxes):
        padding = 10
        y1 = max(0, y - padding)
        y2 = min(img.shape[0], y + h + padding)
        x1 = max(0, x - padding)
        x2 = min(img.shape[1], x + w + padding)
        
        # 🚨 SMART FILTER: Check if the crop is just noise/blank paper
        crop_thresh = thresh[y1:y2, x1:x2]
        text_pixels = cv2.countNonZero(crop_thresh)
        total_pixels = crop_thresh.shape[0] * crop_thresh.shape[1]
        text_ratio = text_pixels / total_pixels
        
        # If the image is less than 1.5% ink, it is a blank noise image. Skip it!
        if text_ratio < 0.015:
            continue
            
        crop_img = img[y1:y2, x1:x2]
        crop_filename = out_dir_path / f"{base_name}_crop_{i}.jpg"
        cv2.imwrite(str(crop_filename), crop_img)
        crop_paths.append(str(crop_filename))
        
    print(f"✅ Filtered and saved {len(crop_paths)} valid crops.")
    return crop_paths