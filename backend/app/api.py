import os
from typing import List, Dict
import json
from pathlib import Path
from urllib.parse import urlparse
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from . word_scraper import WordScraper
from . schema import Occurrence, AggregatedOccurrence, Url
# from . fake_db import urls, words
# import fake_db as db

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

with open(Path(os.getcwd()).joinpath('fake_db.json'), 'r+') as f:
    fake_db = json.load(f)

@app.get("/", tags=["index"])
async def index() -> dict:
    return {"message": "Welcome to uniberg demo task."}

@app.get("/occurrences/", tags=["count words occurrences"], response_model=Occurrence)
async def count_occurrences() -> dict:

    result = {}
    try:        
        word_scraper =  WordScraper(fake_db['urls'], fake_db['words'])        
        result_df = await word_scraper.run()           
        result_df = result_df[['url','word','count']]  
        # print(result_df)      
        result = result_df.to_dict(orient = 'records')
    except ValueError as ex:
        print(ex)
    except Exception as ex:
        print(ex)
        
    return JSONResponse(content = result) 

@app.get("/aggr-occurrences/", tags=["aggregated words occurrences count"], response_model=AggregatedOccurrence)
async def aggr_count_occurrences() -> dict:
    result = {}
    try:        
        word_scraper =  WordScraper(fake_db['urls'], fake_db['words'])        
        result_df = await word_scraper.run()       
        result_df = result_df[['url','total_words','unique_words']].drop_duplicates(keep = 'first')        
        result = result_df.to_dict(orient = 'records')
    except ValueError as ex:
        print(ex)
    except Exception as ex:
        print(ex)
        
    return JSONResponse(content = result) 

@app.get("/urls", tags=["Urls to scrape"], response_model = Dict[str, List[Url]])
async def get_urls():
    result = {'data': fake_db['urls']}
    return JSONResponse(content = result) 

@app.post("/urls", tags=["Add url"])
async def add_url(url: str): 
    parsed_url = urlparse(url) 
    if not bool(parsed_url.scheme):
        return {'data':{"Invalid Url !"}}
    if url not in fake_db['urls']:
        fake_db['urls'].append(url)
        with open(Path(os.getcwd()).joinpath('fake_db.json'), "w") as file_object:        
            json.dump(fake_db, file_object)    
            return {'data':{"Url added."}}
    return {'data':{"Url exists already."}}

@app.delete("/urls", tags=["Delete url"])
async def delete_url(url: str):
    if url in fake_db['urls']:
        fake_db['urls'].remove(url)
        with open(Path(os.getcwd()).joinpath('fake_db.json'), "w") as file_object:        
            json.dump(fake_db, file_object)    
            return {'data':{"Url removed."}}
    return {'data':{"No such url."}}
    


@app.get("/words", tags=["Words to count"], response_model = Dict[str, List[Url]])
async def get_words():
    result = {'data': fake_db['words']}
    return JSONResponse(content = result) 

@app.post("/words", tags=["Add word"])
async def add_word(word: str):
    if word not in fake_db['words']:
        fake_db['words'].append(word)
        with open(Path(os.getcwd()).joinpath('fake_db.json'), "w") as file_object:        
            json.dump(fake_db, file_object)    
            return {'data':{"Word added."}}
    return {'data':{"Word exists already."}}

@app.delete("/words", tags=["Delete word"])
async def delete_word(word: str):
    if word in fake_db['words']:
        fake_db['words'].remove(word)
        with open(Path(os.getcwd()).joinpath('fake_db.json'), "w") as file_object:        
            json.dump(fake_db, file_object)    
            return {'data':{"Word removed."}}
    return {'data':{"No such word."}}