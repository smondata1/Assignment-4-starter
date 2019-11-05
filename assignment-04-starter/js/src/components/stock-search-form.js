const StockSearchForm = () =>{
    const [symbol , setSymbol] = React.useState('');

    const handleSubmit = evt =>{
        evt.preventDefault();
        console.log(symbol);
    }

    return (
        <div>
            <form className="frm stock-search" onSubmit = {handleSubmit}>
                <label htmlFor="symbol">Stock Symbol:
                    <input 
                            type="text" 
                            id="symbol" 
                            name="symbol" 
                            value = {symbol}
                            onChange={(evt) => {
                                setSymbol(evt.target.value)
                            }}
                            />
                </label>
                <button type="submit">Get Quote</button>
            </form>
        </div>
    );

};

export {StockSearchForm};