import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Table from "./Table";
import Button from "./Button";


const WordsContext = React.createContext({
    words: [], fetchWords: () => {}
})

const Words = () => {
    const [words, setWords] = useState([])  
    const [showDellButton, setShowDellButton] = useState(false) 
    const [selectedVal, setSelectedVal] = useState('');
    
    const saveWord = async (word) => {
        fetch(`http://localhost:8000/words?word=${word}`, {method: "POST"})
        .then((response) => response.json())
        .then((json) => {            
            if(json.data[0] !== "Word added."){                
                toast.error(json.data[0])
            }else{
                toast.success(json.data[0])
            }            
        })
        .then(fetchWords)
    }

    const deleteWord = async (word) => {
        fetch(`http://localhost:8000/words?word=${word}`, {
            method: "DELETE"                   
        })
        .then((response) => response.json())
        .then((json) => {            
            if(json.data[0] !== "Word removed."){                
                toast.error(json.data[0])
            }else{
                toast.success(json.data[0])
            }            
        })
        .then(fetchWords)
    }

    const fetchWords = async () => {               
        const response = await fetch("http://localhost:8000/words")
        const words = await response.json()
        setWords(words.data)
    }  

    useEffect(() => {               
        fetchWords()
    }, [])

    const createTblData = () => {
        let tblData
        if(words.length > 0){
            tblData = words.map(w => (
                {                    
                    word: w
                }
            ))            
            tblData.push({word:'<...enter new word here >'})            
        }
        return tblData
    }

    const buttonOnClick = () =>{  
        showDellButton ? deleteWord(selectedVal) : saveWord(selectedVal)       
    }

    return (
        <WordsContext.Provider value={{words, fetchWords}}>
            <h3 style={{marginLeft:'4rem',marginTop:'2rem',marginBottom:'1rem'}}>WORDS</h3>
            
            <Table 
                data = {createTblData()}
                
                // columns = {[
                //     {
                //         data: 'word'                    
                //     }                  
                // ]}
                cols = {['word']}
                colWidths = {[300]} 
                showDellButton = {setShowDellButton}                               
                selectedVal = {setSelectedVal}                                              
            />
            <Button 
                color = {showDellButton ? '#F5B7B1' : '#ABEBC6'}
                text = {showDellButton ? 'Delete word' : 'Add word'}
                onClick = {buttonOnClick}
            /> 
                       
        </WordsContext.Provider>
    )
}

export default Words