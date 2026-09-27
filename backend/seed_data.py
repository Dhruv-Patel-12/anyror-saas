import asyncio
from datetime import datetime, timedelta
from sqlalchemy import select
from app.db.session import engine, init_db, AsyncSessionLocal
from app.db.models import LandRecord, MutationEntry

async def seed():
    print("[*] Initializing database tables...")
    await init_db()
    
    async with AsyncSessionLocal() as session:
        # Check if survey 2 already exists
        res = await session.execute(select(LandRecord).filter(LandRecord.survey_no == "2"))
        existing = res.scalars().first()
        if existing:
            print("[INFO] Sample data for Survey 2 already present in database.")
            return

        print("[*] Seeding realistic LandRecord and MutationEntries for Survey 2 (Hasannagar, Bavla)...")
        
        # 1. Master Extracted Data for Survey 2
        survey_2_data = {
            "Basic_Details": {
                "District": "અમદાવાદ (Ahmedabad)",
                "Taluka": "બાવળા (Bavla)",
                "Village": "હસનનગર (Hasan Nagar)",
                "Survey Number": "2",
                "UPIN": "GJ070800100002",
                "Total Area": "4-20-00 H-Are-SqMtr",
                "Total Assessment": "42.50",
                "Tenure": "જૂની શરત (Old Tenure / Freehold)",
                "Land Use": "ખેતી (Agricultural)",
                "Farm Name": "મોટું ખેતર",
                "Processing Date": datetime.utcnow().strftime("%d/%m/%Y"),
                "Remarks": "Regular title, clear boundaries"
            },
            "Ownership_Details": [
                {"Account No": "45", "Owner Name": "ટાઈટલનોડ કમર્શિયલ લિમિટેડ (TitleNode Commercial Ltd.)"}
            ],
            "Boja_and_Rights": [
                {"Lien Holder": "Bank of Baroda, Bavla Branch", "Amount": "Rs. 4,50,000", "Entry No": "337"}
            ],
            "Other_Statuses": {
                "Jantri Detail": "Rs. 1,450 per SqMtr",
                "Sub Registrar Deed": "Reg No 4250/2015",
                "iRCMS Revenue Case": "None / Record Not Found",
                "High/Civil Court Case": "None",
                "Panchayat Tax": "Paid (Receipt #4412)",
                "Electricity Bill": "Paid",
                "Water Bill": "Paid"
            },
            "Risk_Flags": {
                "A_Ownership": {"status": "🟢 Private", "color": "green", "reason": "No government or gauchar keywords detected."},
                "B_Tenure": {"status": "🟢 Freehold / Unrestricted", "color": "green", "reason": "Old Tenure (Juni Sharat) detected."},
                "C_Encumbrance": {"status": "🟡 Active Lien/Boja", "color": "yellow", "reason": "Found 1 Boja/Rights entry (Bank of Baroda). Must be cleared before closing."},
                "D_Litigation": {"status": "🟢 Clear", "color": "green", "reason": "No active litigation found in court or iRCMS records."}
            },
            "Outstanding_Dues": {
                "Panchayat Tax": {"status": "Paid / Clear", "color": "text-green-700 bg-green-100", "icon": "✅"},
                "Electricity Bill": {"status": "Paid / Clear", "color": "text-green-700 bg-green-100", "icon": "✅"},
                "Water Bill": {"status": "Paid / Clear", "color": "text-green-700 bg-green-100", "icon": "✅"}
            }
        }

        record_2 = LandRecord(
            district_code="07",
            taluka_code="08",
            village_code="001",
            survey_no="2",
            extracted_data=survey_2_data,
            pdf_file_path="/static/images/survey_2/record_2.pdf",
            mutation_images_dir="output/survey_2",
            is_successful=True,
            scraped_at=datetime.utcnow()
        )
        session.add(record_2)
        await session.flush()

        # 2. Seed Mutation Entries linking real scanned images from output/survey_2/
        mutations = [
            {
                "entry": "1",
                "image": "/static/images/survey_2/mutation_entry_1.jpg",
                "is_verified": True,
                "draft": {
                    "mutation_entry_number": "1",
                    "entry_date": "14-06-1952",
                    "transaction_type": "પ્રમોલગેશન હુકમ (Promulgation Scheme)",
                    "survey_numbers": "2",
                    "previous_owners": ["મુંબઈ સરકાર (Government)"],
                    "new_owners": ["રત્ના કુંભા"],
                    "remarks_summary": "Original allocation of survey number 2 under land reform scheme."
                }
            },
            {
                "entry": "12",
                "image": "/static/images/survey_2/mutation_entry_12.jpg",
                "is_verified": True,
                "draft": {
                    "mutation_entry_number": "12",
                    "entry_date": "20-11-1958",
                    "transaction_type": "ખેતી ધિરાણ બોજો (Crop Loan)",
                    "survey_numbers": "2",
                    "previous_owners": ["રત્ના કુંભા"],
                    "new_owners": ["પીપળીયા સહકારી મંડળી"],
                    "remarks_summary": "Crop loan of Rs. 600 obtained from cooperative society."
                }
            },
            {
                "entry": "132",
                "image": "/static/images/survey_2/mutation_entry_132.jpg",
                "is_verified": True,
                "draft": {
                    "mutation_entry_number": "132",
                    "entry_date": "15-04-1964",
                    "transaction_type": "સરકારી હુકમ / ગણોતિયા (Tenancy Rights)",
                    "survey_numbers": "2",
                    "previous_owners": ["રત્ના કુંભા"],
                    "new_owners": ["અમથા રત્ના", "ભુરા કુંભા"],
                    "remarks_summary": "Tenancy rights confirmed in favor of legal heirs Amtha Ratna & Bhura Kumbha."
                }
            },
            {
                "entry": "185",
                "image": "/static/images/survey_2/mutation_entry_185.jpg",
                "is_verified": True,
                "draft": {
                    "mutation_entry_number": "185",
                    "entry_date": "08-03-1972",
                    "transaction_type": "બોજા કમી (Mortgage Release)",
                    "survey_numbers": "2",
                    "previous_owners": ["પીપળીયા સહકારી મંડળી"],
                    "new_owners": ["અમથા રત્ના", "ભુરા કુંભા"],
                    "remarks_summary": "Full repayment of cooperative loan certificate recorded."
                }
            },
            {
                "entry": "256",
                "image": "/static/images/survey_2/mutation_entry_256.jpg",
                "is_verified": True,
                "draft": {
                    "mutation_entry_number": "256",
                    "entry_date": "12-08-1982",
                    "transaction_type": "વારસાઈ નોંધ (Inheritance)",
                    "survey_numbers": "2",
                    "previous_owners": ["અમથા રત્ના (મરણ જનાર)"],
                    "new_owners": ["રમેશ અમથા", "સુરેશ અમથા"],
                    "remarks_summary": "Amtha Ratna passed away. Names of direct heirs added via succession."
                }
            },
            {
                "entry": "337",
                "image": "/static/images/survey_2/mutation_entry_337.jpg",
                "is_verified": True,
                "draft": {
                    "mutation_entry_number": "337",
                    "entry_date": "17-02-1998",
                    "transaction_type": "બેંક બોજો (Bank Lien / Mortgage)",
                    "survey_numbers": "2",
                    "previous_owners": ["રમેશ અમથા", "સુરેશ અમથા"],
                    "new_owners": ["Bank of Baroda, Bavla Branch"],
                    "remarks_summary": "Mortgage charge of Rs. 4,50,000 registered against land for tractor purchase."
                }
            },
            {
                "entry": "410",
                "image": "/static/images/survey_2/mutation_entry_410.jpg",
                "is_verified": False, # Kept unverified for the Review Queue demo!
                "draft": {
                    "mutation_entry_number": "410",
                    "entry_date": "05-11-2015",
                    "transaction_type": "રજિસ્ટર્ડ વેચાણ દસ્તાવેજ (Registered Sale Deed)",
                    "survey_numbers": "2",
                    "previous_owners": ["રમેશ અમથા", "સુરેશ અમથા", "ભુરા કુંભા"],
                    "new_owners": ["TitleNode Commercial Ltd."],
                    "remarks_summary": "Registered sale deed executed. Land conveyed to TitleNode Commercial Ltd.",
                    "low_confidence_flags": ["Verify consideration amount from sale deed copy"]
                }
            },
            {
                "entry": "416",
                "image": "/static/images/survey_2/mutation_entry_416.jpg",
                "is_verified": False,
                "draft": {
                    "mutation_entry_number": "416",
                    "entry_date": "19-09-2018",
                    "transaction_type": "હક્ક કમી / સુધારો (Mutation Update)",
                    "survey_numbers": "2",
                    "previous_owners": ["સુરેશ અમથા"],
                    "new_owners": ["TitleNode Commercial Ltd."],
                    "remarks_summary": "Confirmation of revenue boundaries and payment of registration cess."
                }
            }
        ]

        for m in mutations:
            entry_obj = MutationEntry(
                land_record_id=record_2.id,
                entry_number=m["entry"],
                image_file_path=m["image"],
                scraped_html_text=None,
                ai_draft_data=m["draft"],
                final_verified_data=m["draft"] if m["is_verified"] else None,
                is_verified=m["is_verified"],
                verified_at=datetime.utcnow() if m["is_verified"] else None
            )
            session.add(entry_obj)

        # 3. Seed additional parcels for Developer Rollup Grid
        additional_parcels = [
            ("14", "Ramesh Amtha", "1.1 Hectares", "green", "green", "green", "green", "Clear"),
            ("45", "Government of Gujarat", "12.5 Hectares", "red", "red", "green", "red", "High Risk"),
            ("101", "Suresh Amtha", "2.0 Hectares", "green", "green", "green", "green", "Clear"),
            ("22", "Bhura Kumbha", "3.8 Hectares", "green", "yellow", "red", "yellow", "Review Needed")
        ]

        for s_no, owner, size, o_col, t_col, e_col, l_col, stat in additional_parcels:
            p_data = {
                "Basic_Details": {
                    "District": "અમદાવાદ", "Taluka": "બાવળા", "Village": "હસનનગર",
                    "Survey Number": s_no, "Total Area": size, "Tenure": "જૂની શરત" if t_col == "green" else "નવી શરત"
                },
                "Ownership_Details": [{"Owner Name": owner}],
                "Boja_and_Rights": [{"Lien": "Active"}] if e_col != "green" else [],
                "Other_Statuses": {},
                "Risk_Flags": {
                    "A_Ownership": {"status": "🟢 Private" if o_col == "green" else "🔴 Government Restricted", "color": o_col},
                    "B_Tenure": {"status": "🟢 Freehold" if t_col == "green" else "🔴 Restricted", "color": t_col},
                    "C_Encumbrance": {"status": "🟢 Clear" if e_col == "green" else "🟡 Active Lien", "color": e_col},
                    "D_Litigation": {"status": "🟢 Clear" if l_col == "green" else "🔴 Active Case", "color": l_col}
                },
                "Outstanding_Dues": {
                    "Panchayat Tax": {"status": "Paid", "color": "text-green-700 bg-green-100", "icon": "✅"},
                    "Electricity Bill": {"status": "Paid", "color": "text-green-700 bg-green-100", "icon": "✅"},
                    "Water Bill": {"status": "Paid", "color": "text-green-700 bg-green-100", "icon": "✅"}
                }
            }
            p_record = LandRecord(
                district_code="07",
                taluka_code="08",
                village_code="001",
                survey_no=s_no,
                extracted_data=p_data,
                pdf_file_path=None,
                mutation_images_dir=None,
                is_successful=True,
                scraped_at=datetime.utcnow() - timedelta(days=2)
            )
            session.add(p_record)

        await session.commit()
        print("[SUCCESS] Database successfully seeded with rich TitleNode live fixtures!")

if __name__ == "__main__":
    asyncio.run(seed())
