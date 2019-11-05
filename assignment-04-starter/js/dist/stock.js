var API_KEY = 'YOUR_API_KEY_HERE';
var ENDPOINT = 'https://www.alphavantage.co/query?function=';

var Stock = function Stock(attrs) {
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
  var _this = this;

  return fetch("".concat(ENDPOINT, "GLOBAL_QUOTE&symbol=").concat(this.symbol, "&apikey=").concat(API_KEY)).then(function (response) {
    return response.json();
  }).then(function (data) {
    // log and export all data
    if (data['Error Message']) {
      throw new Error("There was an error fulfilling your request. Be sure you've entered a valid symbol");
    }

    var _data$GlobalQuote = data['Global Quote'],
        symbol = _data$GlobalQuote['01. symbol'],
        price = _data$GlobalQuote['05. price'],
        date = _data$GlobalQuote['07. latest trading day'];
    return Object.assign(_this.stockData, {
      symbol: symbol,
      price: price,
      date: date
    });
  })["catch"](function (err) {
    return "There was an error: ".concat(err);
  });
};

Stock.prototype.getStockFiveDayHistory = function () {
  var _this2 = this;

  return fetch("".concat(ENDPOINT, "TIME_SERIES_DAILY&symbol=").concat(this.symbol, "&apikey=").concat(API_KEY)).then(function (response) {
    return response.json();
  }).then(function (data) {
    // log and export all data
    if (data['Error Message']) {
      throw new Error("There was an error fulfilling your request. Be sure you've entered a valid symbol");
    } // send only the most recent 5 days of data


    _this2.stockData.history = Object.entries(data['Time Series (Daily)']).slice(0, 5).map(function (day) {
      var _day$ = day[1],
          open = _day$['1. open'],
          high = _day$['2. high'],
          low = _day$['3. low'],
          close = _day$['4. close'];
      return {
        open: open,
        high: high,
        low: low,
        close: close,
        date: day[0]
      };
    });
    return _this2.stockData;
  })["catch"](function (err) {
    alert("There was an error: ".concat(err));
  });
};

Stock.prototype.getCurrentAndFiveDayHistory = function () {
  var _this3 = this;

  var obj = {};
  return this.getStockPrice().then(function (data) {
    Object.assign(obj, data);
    return _this3.getStockFiveDayHistory();
  }).then(function (data) {
    return Object.assign(obj, data);
  });
};

export { Stock };