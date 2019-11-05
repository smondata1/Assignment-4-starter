const API_KEY = 'YOUR_API_KEY_HERE';
const ENDPOINT = 'https://www.alphavantage.co/query?function=';

const Stock = function (attrs) {
    this.symbol = '';
    this.stockData = {};

    if (attrs) {
        Object.assign(this, attrs);
    }
};

/**
 * Returns the current stock price, symbol, and date
 * @returns {Promise} - resolves to {price, symbol, date}
 */
Stock.prototype.getStockPrice = function () {
    return fetch(`${ENDPOINT}GLOBAL_QUOTE&symbol=${this.symbol}&apikey=${API_KEY}`).then(response => {
        return response.json();
    }).then(data => {
        // log and export all data
        if (data['Error Message']) {
            throw new Error(`There was an error fulfilling your request. Be sure you've entered a valid symbol`);
        }
        let {'01. symbol': symbol, '05. price': price, '07. latest trading day': date} = data['Global Quote'];
        return Object.assign(this.stockData, {symbol, price, date});
    }).catch(err => {
        return `There was an error: ${err}`;
    });
};

Stock.prototype.getStockFiveDayHistory = function () {
    return fetch(`${ENDPOINT}TIME_SERIES_DAILY&symbol=${this.symbol}&apikey=${API_KEY}`).then(response => {
        return response.json();
    }).then(data => {
        // log and export all data
        if (data['Error Message']) {
            throw new Error(`There was an error fulfilling your request. Be sure you've entered a valid symbol`);
        }
        // send only the most recent 5 days of data
        this.stockData.history = Object
            .entries(data['Time Series (Daily)'])
            .slice(0, 5)
            .map(day => {
                let {'1. open': open, '2. high': high, '3. low': low, '4. close': close} = day[1];
                return {open, high, low, close, date: day[0]};
            });
        return this.stockData;
    }).catch(err => {
        alert(`There was an error: ${err}`);
    });
};

Stock.prototype.getCurrentAndFiveDayHistory = function () {
    let obj = {};
    return this
        .getStockPrice()
        .then(data => {
            Object.assign(obj, data);
            return this.getStockFiveDayHistory();
        })
        .then(data => {
            return Object.assign(obj, data);
        });
};

export {Stock};