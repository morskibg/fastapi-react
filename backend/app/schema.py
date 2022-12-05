from typing import Union, List

from pydantic import BaseModel

class Occurrence(BaseModel):
    url: str
    word: str
    count: int

class Url(BaseModel):
    url: str
    
class AggregatedOccurrence(BaseModel):
    url: str
    total_words_count: str
    unique_words_count: int