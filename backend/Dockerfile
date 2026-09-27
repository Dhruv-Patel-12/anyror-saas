FROM mcr.microsoft.com/playwright/python:v1.47.0-noble

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    fonts-noto-extra \
    && rm -rf /var/lib/apt/lists/*

# 🚨 NEW: Install uv package manager via pip to avoid GitHub registry timeouts
RUN pip install uv

# Copy dependency configs and README for build validation
COPY pyproject.toml README.md ./

# Install CPU-only PyTorch first to avoid 2.5GB+ of NVIDIA CUDA downloads
RUN uv pip install --system torch torchvision --extra-index-url https://download.pytorch.org/whl/cpu

# Install the rest of the dependencies using uv
RUN uv pip install --system --extra-index-url https://download.pytorch.org/whl/cpu .

# Install Playwright browser binaries
RUN playwright install chromium

# Copy application source
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]