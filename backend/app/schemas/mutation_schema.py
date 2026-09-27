from pydantic import BaseModel, Field
from typing import List, Optional

class MutationEntryExtraction(BaseModel):
    mutation_entry_number: Optional[str] = Field(description="The unique mutation entry number.")
    entry_date: Optional[str] = Field(description="The date of the entry (DD-MM-YYYY).")
    survey_numbers: str = Field(description="Comma-separated list of survey numbers.")
    transaction_type: Optional[str] = Field(description="The core action (e.g., Sale, Inheritance).")
    previous_owners: List[str] = Field(description="The parties giving up rights (Sellers, Deceased). Crucial for graph nodes.")
    new_owners: List[str] = Field(description="The parties gaining rights (Buyers, Heirs). Crucial for graph nodes.")
    remarks_summary: str = Field(description="One-line English summary for the Timeline UI.")
    low_confidence_flags: List[str] = Field(description="List of unreadable fields requiring advocate review.")

class PageExtraction(BaseModel):
    entries: List[MutationEntryExtraction] = Field(description="List of all mutation entries found on the page.")