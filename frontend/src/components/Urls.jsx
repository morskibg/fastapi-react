import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Table from "./Table";
import Button from "./Button";

const UrlsContext = React.createContext({
    urls: [], fetchUrls: () => {}
})

const Urls = () => {
    const [urls, setUrls] = useState([])  
    const [showDellButton, setShowDellButton] = useState(false) 
    const [selectedVal, setSelectedVal] = useState('');
    
    const saveUrl = async (url) => {
        fetch(`http://localhost:8000/urls?url=${url}`, {method: "POST"})
        .then((response) => response.json())
        .then((json) => {            
            if(json.data[0] !== "Url added."){                
                toast.error(json.data[0])
            }else{
                toast.success(json.data[0])
            }            
        })
        .then(fetchUrls)
    }

    const deleteUrl = async (url) => {
        fetch(`http://localhost:8000/urls?url=${url}`, {
            method: "DELETE"                   
        })
        .then((response) => response.json())
        .then((json) => {            
            if(json.data[0] !== "Url removed."){                
                toast.error(json.data[0])
            }else{
                toast.success(json.data[0])
            }            
        })
        .then(fetchUrls)
    }

    const fetchUrls = async () => {               
        const response = await fetch("http://localhost:8000/urls")
        const urls = await response.json()
        setUrls(urls.data)
    }  

    useEffect(() => {               
        fetchUrls()
    }, [])

    const createTblData = () => {
        let tblData
        if(urls.length > 0){
            tblData = urls.map(url => (
                {                    
                    url: url
                }
            ))            
            tblData.push({url:'<...enter new url here >'})            
        }
        return tblData
    }

    const buttonOnClick = () =>{  
        showDellButton ? deleteUrl(selectedVal) : saveUrl(selectedVal)       
    }

    return (
        <UrlsContext.Provider value={{urls, fetchUrls}}>
            <h3 style={{marginLeft:'4rem'}}>URLS</h3>
            <Table 
                data = {createTblData()}               
                cols = {['url']}
                colWidths = {[300]}
                showDellButton = {setShowDellButton}                               
                selectedVal = {setSelectedVal}                                           
            /> 
            <Button 
                color = {showDellButton ? '#F5B7B1' : '#ABEBC6'}
                text = {showDellButton ? 'Delete URL' : 'Add URL'}
                onClick = {buttonOnClick}
            />                       
        </UrlsContext.Provider>
    )
}

export default Urls