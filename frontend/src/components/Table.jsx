import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

const Table = ({data, cols, colWidths, showDellButton, selectedVal}) => {
    const tblClick = (value) => {
        if(showDellButton) {
            if(!value.includes("...enter") ){            
                showDellButton(true)
                selectedVal(value)
            }else {
                showDellButton(false)            
            }
        }             
    }    
    return (
        <>
        <HotTable            
            style={{marginLeft:'4rem',marginTop:'1rem'}}
            data={data}
            rowHeaders={true}
            colHeaders={cols}
            className="htCenter"
            height="auto"
            width="auto"
            colWidths= {colWidths}
            outsideClickDeselects={false}
            afterOnCellMouseDown = {(event, coords, td) => {
                const value = td.innerHTML
                tblClick(value)
            }}
            afterChange={(changes, source) => {
                changes?.forEach(([row, prop, oldValue, newValue]) => {  
                    console.log('oldVal', oldValue)                  
                    if(oldValue !== newValue){
                        selectedVal(newValue)
                    }
                });
            }}            
            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
        />        
    </>
    );     
}

export default Table