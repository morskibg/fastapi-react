from typing import Union, List, Dict
import re
import pandas as pd
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from aiohttp.client_exceptions import ClientConnectorError, InvalidURL
import platform

from .logger import get_logger

if platform.system()=='Windows':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


class WordScraper():

    def __init__(self, urls: List[str], words: List[str], ) -> None:
        self.urls = urls
        self.words = words
        self.logger = get_logger('WordScraper')
        self.session = None
             

    async def run(self):
        try:
            return await self.main()
        except InvalidURL as ex:
            self.logger.error(f'There is an invalid url -> "{ex}".')
            raise ValueError(f'There is an invalid url -> "{ex}".')
        except ClientConnectorError as ex:
            self.logger.error(f'Connection error\n{ex}')
            raise ValueError(f'Connection error\n{ex}')
        except Exception as ex:
            self.logger.error(f'General exception\n{ex}')
            raise ValueError(f'General exception\n{ex}')


    async def _count_words(self, soup, word: str, url: str) -> Dict[str, Union[str,int]]:    
        html_text = soup.get_text()       
        match_results = re.findall(word, html_text, re.IGNORECASE)
        count_dict = {'url':url,'word': word, 'count': len(match_results)}        
        return count_dict

    async def _get_aggr_data(self, soup, url: str):
        all_words = [x for x in soup.get_text(" ", strip=True).lower().split() if x.isalpha()]
        aggr_dict = {
            'url':url,
            'total_words':len(all_words), 
            'unique_words':len(set(all_words))
        }
        return aggr_dict


    async def _fetch_data(self, url: str):
        async with self.session.get(url) as resp:
            body = await resp.text()
            soup = BeautifulSoup(body, 'html.parser')            
            aggr_dict = await self._get_aggr_data(soup, url)
            count_dict = await asyncio.gather(*[self._count_words(soup, word, url) for word in self.words])
            aggr_df = pd.DataFrame([aggr_dict]) 
            count_df = pd.DataFrame(count_dict)
            url_stat_df = pd.merge(aggr_df, count_df, on = 'url')
            return url_stat_df

    async def _fetch_all(self):
        cooroutines = [self._fetch_data(url) for url in self.urls]    
        return pd.concat(await asyncio.gather(*cooroutines), ignore_index=True) 

    async def main(self):
        async with aiohttp.ClientSession() as session:
            self.session = session
            final_df = await self._fetch_all()             
            return final_df   
        
    async def get_result(self):
        return self.result