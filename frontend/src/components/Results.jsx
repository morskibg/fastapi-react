import React, { useEffect, useState } from "react";
import Button from './Button'
import Table from "./Table";

const Results = () => {

    const [occurrences, setOccurrences] = useState([]);  
    const [aggrOccurrences, setaggrOccurrences] = useState([]);  
    const [urls, setUrls] = useState([]);  
    const [tblData, setTblData] = useState([]);  
    
    useEffect(() => {         
        const createOccurencesTblData = () =>{
            let tblData
            const finalData = []        
            if(occurrences.length > 0){                       
                const uniqueWords = [...new Set(occurrences.map(item => item.word))]           
                tblData = occurrences.reduce((acc, currVal) => {                                
                    if(!acc?.[currVal.word]){
                        acc[currVal.word] = []                    
                    }                      
                    acc[currVal.word].push({[currVal.url]:currVal.count })                              
                    return acc
                },[])             
                uniqueWords.forEach(w => {                
                    let currObj = {'':w}
                    let total = 0
                    for(let i = 0; i < tblData[w].length; i++ ) {
                        currObj = {...currObj, ...tblData[w][i]} 
                        const keys = Object.keys(tblData[w][i])                   
                        total += tblData[w][i][keys[0]]                  
                    }
                    currObj['total occurencies'] = total             
                    finalData.push(currObj)
                })            
            }            
            return finalData
        }
        const tData = occurrences.length > 0 ? createOccurencesTblData() : [] 
        setTblData(tData)
        const urls_ = occurrences.length > 0 ? getUrls(tData) : []
        setUrls(urls_)        
    }, [occurrences])      
    
    const fetchOccurrences = async () =>{
        const response = await fetch("http://localhost:8000/occurrences")
        const occurrences = await response.json()        
        setOccurrences(occurrences)        
        const aggrResponse = await fetch("http://localhost:8000/aggr-occurrences")
        const aggrOccurrences = await aggrResponse.json()               
        setaggrOccurrences(aggrOccurrences)        
    }

    const onClick = () =>{        
        fetchOccurrences()
    }

    const getUrls = (tData) =>{        
        if(tData.length >0 ){
            return Object.keys(tData[0])
        }else{
            return []
        }
    }

    return (        
        <div style={{marginTop:'2rem'}}>
            <Button                             
                color = { '#D7DBDD' }
                text = {'Proceed web counting'}
                onClick = {onClick}
            />            
            {
                urls.length > 0 &&
                <>
                    <h3 style={{marginLeft:'4rem',marginTop:'2rem'}}>Results</h3>
                    <Table 
                        data = {tblData}                
                        cols = {urls}
                        colWidths = {new Array(urls.length).fill(300)}   
                        showDellButton = {null}                               
                        selectedVal = {null} 
                    />
                </>
            }
            {
                urls.length > 0 &&
                <>
                    <h3 style={{marginLeft:'4rem',marginTop:'2rem'}}>Aggregated Results</h3>
                    <Table 
                        data = {aggrOccurrences}                
                        cols = {['url','all words','unique words']}
                        colWidths = {new Array(3).fill(300)}   
                        showDellButton = {null}                               
                        selectedVal = {null} 
                    />
                </>
            }
            
        </div>        
    )
}

export default Results