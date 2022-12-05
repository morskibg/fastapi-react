const Button = ({ color, text, onClick }) => {
    return (
        <button
            style={{
                marginLeft:'4rem',                
                marginTop:'1rem',               
                backgroundColor: color,
                fontSize: '20px',
                borderRadius: '8px',
                width: '22rem',
                padding: '10px' ,
                border: '2px'
            }}
            onClick={onClick}            
            className='btn'
            >
            {text}
        </button>
    )
}
export default Button