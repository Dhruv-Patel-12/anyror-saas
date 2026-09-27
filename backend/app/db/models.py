from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class LandRecord(Base):
    __tablename__ = "land_records"

    id = Column(Integer, primary_key=True, index=True)
    
    # Search parameters
    district_code = Column(String, index=True, nullable=False)
    taluka_code = Column(String, index=True, nullable=False)
    village_code = Column(String, index=True, nullable=False)
    survey_no = Column(String, index=True, nullable=False)
    
    # The JSON dump from the parser (Basic Details, Risk Flags, etc. - EXCEPT OCR data)
    extracted_data = Column(JSONB, nullable=False)
    
    # File paths for the downloaded documents
    pdf_file_path = Column(String, nullable=True)
    mutation_images_dir = Column(String, nullable=True)
    
    # Metadata
    is_successful = Column(Boolean, default=True)
    scraped_at = Column(DateTime, default=datetime.utcnow)

    # 🚨 NEW: Link to the individual mutation entries
    mutations = relationship("MutationEntry", back_populates="land_record", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<LandRecord(survey_no='{self.survey_no}', village='{self.village_code}')>"


# 🚨 NEW: The Dedicated Table for the Lawyer Review UI
class MutationEntry(Base):
    __tablename__ = "mutation_entries"

    id = Column(Integer, primary_key=True, index=True)
    land_record_id = Column(Integer, ForeignKey("land_records.id"), nullable=False)
    
    # The massive header for the UI
    entry_number = Column(String, index=True)
    
    # The Left Screen of UI: The source data
    image_file_path = Column(String, nullable=True) # Path to the raw .jpg
    scraped_html_text = Column(JSONB, nullable=True) # The official text from the AnyRoR table
    
    # The Right Screen of UI: The AI Draft vs. Final Verified Data
    ai_draft_data = Column(JSONB, nullable=False) # Gemini's original extraction
    final_verified_data = Column(JSONB, nullable=True) # Saves here after lawyer clicks "Approve/Update"
    
    # The HitL (Human-in-the-Loop) Tracking
    is_verified = Column(Boolean, default=False)
    verified_at = Column(DateTime, nullable=True)

    # Relationship back to the parent record
    land_record = relationship("LandRecord", back_populates="mutations")

    def __repr__(self):
        return f"<MutationEntry(entry='{self.entry_number}', verified={self.is_verified})>"