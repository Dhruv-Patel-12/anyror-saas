def _get_case_insensitive(data: dict, *target_keys: str, default: str = "") -> str:
    """Helper to safely extract string values from a dictionary regardless of key casing or underscores."""
    if not isinstance(data, dict):
        return default
    normalized_map = {k.strip().lower().replace("_", " "): str(v) for k, v in data.items() if v is not None}
    for tk in target_keys:
        norm_tk = tk.strip().lower().replace("_", " ")
        if norm_tk in normalized_map:
            return normalized_map[norm_tk]
    return default

def calculate_risk_flags(extracted_data: dict) -> dict:
    """
    Evaluates the scraped AnyROR JSON data and generates the 4 Core Risk Flags.
    """
    basic_details = extracted_data.get("Basic Details", extracted_data.get("Basic_Details", {}))
    other_statuses = extracted_data.get("Other Statuses", extracted_data.get("Other_Statuses", {}))
    ownership_data = extracted_data.get("Ownership Details", extracted_data.get("Ownership_Details", []))
    boja_data = extracted_data.get("Boja and Rights", extracted_data.get("Boja_and_Rights", []))
    
    flags = {
        "A_Ownership": {"status": "🟢 Private", "color": "green", "reason": "No government keywords detected."},
        "B_Tenure": {"status": "🟢 Freehold", "color": "green", "reason": "Old tenure or standard restrictions."},
        "C_Encumbrance": {"status": "🟢 Clear", "color": "green", "reason": "No active Boja/Lien entries found."},
        "D_Litigation": {"status": "🟢 Clear", "color": "green", "reason": "No active court cases found."}
    }

    # ==========================================
    # FLAG A: OWNERSHIP TYPE
    # ==========================================
    restricted_keywords = ["સરકાર", "ગૌચર", "પંચાયત"]
    
    ownership_text = " ".join([str(val) for row in ownership_data for val in (row.values() if isinstance(row, dict) else [str(row)])])
    
    for word in restricted_keywords:
        if word in ownership_text:
            flags["A_Ownership"] = {
                "status": "🔴 Government Restricted", 
                "color": "red",
                "reason": f"Detected restricted keyword: {word}"
            }
            break

    # ==========================================
    # FLAG B: TENURE RISK
    # ==========================================
    tenure_str = _get_case_insensitive(basic_details, "Tenure", "Tenure Type", "TENURE").strip()
    
    if "નવી શરત" in tenure_str:
        flags["B_Tenure"] = {
            "status": "🔴 Restricted Transfer", 
            "color": "red",
            "reason": "New Tenure (Navi Sharat) requires Collector permission."
        }
    elif "જૂની શરત" in tenure_str:
        flags["B_Tenure"] = {
            "status": "🟢 Freehold / Unrestricted", 
            "color": "green",
            "reason": "Old Tenure (Juni Sharat) detected."
        }
    elif tenure_str:
        flags["B_Tenure"] = {
            "status": f"⚪ Other: {tenure_str}", 
            "color": "gray",
            "reason": f"Tenure status: {tenure_str}"
        }

    # ==========================================
    # FLAG C: ENCUMBRANCE / BOJA
    # ==========================================
    if len(boja_data) > 0:
        flags["C_Encumbrance"] = {
            "status": "🟡 Active Lien/Boja", 
            "color": "yellow",
            "reason": f"Found {len(boja_data)} Boja/Rights entries. Must be cleared before purchase."
        }

    # ==========================================
    # FLAG D: LITIGATION STATUS
    # ==========================================
    litigation_fields = [
        _get_case_insensitive(other_statuses, "High/Civil Court Case", "HIGH/CIVIL COURT CASE", "High Court and Civil Court Case Details"),
        _get_case_insensitive(other_statuses, "iRCMS Revenue Case", "IRCMS REVENUE CASE", "iRCMS Revenue Case Details")
    ]
    
    has_case = False
    is_service_down = False
    
    for field in litigation_fields:
        field_lower = field.lower().strip()
        if not field_lower or field_lower in ["---", "none", "-", "n/a"] or "record not found" in field_lower:
            continue
            
        if "service down" in field_lower or "offline" in field_lower:
            is_service_down = True
        else:
            has_case = True
            break
            
    if has_case:
        flags["D_Litigation"] = {
            "status": "🔴 Active Case Found", 
            "color": "red",
            "reason": "Litigation data is populated in Court or iRCMS records."
        }
    elif is_service_down:
        flags["D_Litigation"] = {
            "status": "⚪ Not Verified", 
            "color": "gray",
            "reason": "Government litigation service was down during scrape."
        }

    return flags

def calculate_outstanding_dues(extracted_data: dict) -> dict:
    """
    Evaluates Other Statuses to build a clean 3-line Dues Checklist.
    """
    other_statuses = extracted_data.get("Other Statuses", extracted_data.get("Other_Statuses", {}))
    
    def parse_status(val: str) -> dict:
        clean_val = val.strip().lower()
        if not clean_val or clean_val in ["---", "-", "none", "n/a", "paid"]:
            return {"status": "Paid / Clear", "color": "text-green-700 bg-green-100", "icon": "✅"}
        elif "record not found" in clean_val:
            return {"status": "Not Found", "color": "text-slate-600 bg-slate-100", "icon": "⚪"}
        else:
            return {"status": f"Pending ({val})", "color": "text-red-700 bg-red-100", "icon": "⚠️"}

    return {
        "Panchayat Tax": parse_status(_get_case_insensitive(other_statuses, "Panchayat Tax", "PANCHAYAT TAX")),
        "Electricity Bill": parse_status(_get_case_insensitive(other_statuses, "Electricity Bill", "ELECTRICITY BILL")),
        "Water Bill": parse_status(_get_case_insensitive(other_statuses, "Water Bill", "WATER BILL"))
    }