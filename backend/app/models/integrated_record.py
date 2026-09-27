from datetime import datetime, timezone
from typing import Any
from sqlalchemy import String, Text, DateTime, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class IntegratedLandRecord(Base):
    __tablename__ = "integrated_land_records"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    district_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    taluka_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    village_code: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    survey_no: Mapped[str] = mapped_column(String(100), nullable=False, index=True)

    extracted_data: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=dict)
    pdf_storage_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    raw_html_path: Mapped[str | None] = mapped_column(String(500), nullable=True)

    status: Mapped[str] = mapped_column(String(50), nullable=False, default="SUCCESS")
    fetched_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    __table_args__ = (
        Index("idx_village_survey_unique", "village_code", "survey_no", unique=True),
    )