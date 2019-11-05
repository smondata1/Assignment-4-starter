// Test suite for the Stock module
import mocha from 'mocha';
import chai from 'chai';
import chaiAsPromissed from 'chai-as-promised';
import fetchMock from 'fetch-mock';

import {Stock} from '../js/src/stock.js';

chai.use(chaiAsPromissed); // easier testing of async/promises
chai.should();

describe('Stock constructor', function () {

    let w = null;

    it('should exist', function () {
        // assert that the Stock function exists
        Stock.should.exist;
    });

    describe('Constructor', function () {
        context('without attributes - new Stock()', function () {
            it('should create a new Stock object with default #symbol property', function () {
                w = new Stock();
                // assert #symbol should be an empty string assert #stockData should be an empty
                // object
                w
                    .symbol
                    .should
                    .be
                    .a('string');
                w.symbol.should.be.empty;
                w
                    .stockData
                    .should
                    .deep
                    .equal({});
            });
        });

        context('with attributes - new Stock({ attributes })', function () {
            it('should assign attribute values as properties on the instance', function () {
                w = new Stock({symbol: 'sym', other: 'abcd'});
                // assert that when the constructor is called with an object of attributes that
                // the attributes are all assigned as properties on the instance
                w
                    .symbol
                    .should
                    .equal('sym');
                w
                    .other
                    .should
                    .equal('abcd');

            });
        });
    });

    describe('Methods', function () {
        const API_KEY = 'YOUR_API_KEY_HERE';
        const ENDPOINT = 'https://www.alphavantage.co/query?function=';
        const SYMBOL = 'MSFT';
        const CURRENT_DATA = {
            symbol: 'MSFT',
            price: '137.4100',
            date: '2019-10-18'
        };
        const FIVE_DAY_DATA = [
            {
                open: '139.7600',
                high: '140.0000',
                low: '136.5638',
                close: '137.4100',
                date: '2019-10-18'
            }, {
                open: '140.9500',
                high: '141.4200',
                low: '139.0200',
                close: '139.6900',
                date: '2019-10-17'
            }, {
                open: '140.7900',
                high: '140.9900',
                low: '139.5300',
                close: '140.4100',
                date: '2019-10-16'
            }, {
                open: '140.0600',
                high: '141.7900',
                low: '139.8100',
                close: '141.5700',
                date: '2019-10-15'
            }, {
                open: '139.6900',
                high: '140.2900',
                low: '139.5200',
                close: '139.5500',
                date: '2019-10-14'
            }
        ]

        before('setup fetchMock', function () {
            fetchMock.get(`${ENDPOINT}GLOBAL_QUOTE&symbol=${SYMBOL}&apikey=${API_KEY}`, {
                "Global Quote": {
                    "01. symbol": "MSFT",
                    "02. open": "139.7600",
                    "03. high": "140.0000",
                    "04. low": "136.5638",
                    "05. price": "137.4100",
                    "06. volume": "27654449",
                    "07. latest trading day": "2019-10-18",
                    "08. previous close": "139.6900",
                    "09. change": "-2.2800",
                    "10. change percent": "-1.6322%"
                }
            });

            // shortened response, but enough for testing the requirements
            fetchMock.get(`${ENDPOINT}TIME_SERIES_DAILY&symbol=MSFT&apikey=${API_KEY}`, {
                "Meta Data": {
                    "1. Information": "Daily Prices (open, high, low, close) and Volumes",
                    "2. Symbol": "MSFT",
                    "3. Last Refreshed": "2019-10-18",
                    "4. Output Size": "Compact",
                    "5. Time Zone": "US/Eastern"
                },
                "Time Series (Daily)": {
                    "2019-10-18": {
                        "1. open": "139.7600",
                        "2. high": "140.0000",
                        "3. low": "136.5638",
                        "4. close": "137.4100",
                        "5. volume": "27654449"
                    },
                    "2019-10-17": {
                        "1. open": "140.9500",
                        "2. high": "141.4200",
                        "3. low": "139.0200",
                        "4. close": "139.6900",
                        "5. volume": "21460600"
                    },
                    "2019-10-16": {
                        "1. open": "140.7900",
                        "2. high": "140.9900",
                        "3. low": "139.5300",
                        "4. close": "140.4100",
                        "5. volume": "20751600"
                    },
                    "2019-10-15": {
                        "1. open": "140.0600",
                        "2. high": "141.7900",
                        "3. low": "139.8100",
                        "4. close": "141.5700",
                        "5. volume": "19695700"
                    },
                    "2019-10-14": {
                        "1. open": "139.6900",
                        "2. high": "140.2900",
                        "3. low": "139.5200",
                        "4. close": "139.5500",
                        "5. volume": "13304300"
                    },
                    "2019-10-11": {
                        "1. open": "140.1200",
                        "2. high": "141.0300",
                        "3. low": "139.5000",
                        "4. close": "139.6800",
                        "5. volume": "25446000"
                    }
                }
            });
        });

        beforeEach('create an instance of Stock', function () {
            w = new Stock({symbol: SYMBOL});
        });

        describe('#getStockPrice()', function () {
            it('returns the symbol, price, and date', function () {
                // assert that the method resolves an object that has at a minimum the required
                // properties
                return w
                    .getStockPrice()
                    .should
                    .eventually
                    .deep
                    .equal(CURRENT_DATA);
            });
        });

        describe('#getStockFiveDayHistory()', function () {
            it('returns an array of the previous five days open, high, low, close, and date', function () {
                // assert that the method resolves an array with five objects that each contain
                // at a minimum the required properties
                return w
                    .getStockFiveDayHistory()
                    .should
                    .eventually
                    .deep
                    .equal({history: FIVE_DAY_DATA});
            });
        });

        // define a suite to test the #getCurrentAndFiveDayHistory method. This method
        // should resolve an object that contains both the current stock price details
        // (see test above) and the array of five history objects
        describe('#getCurrentAndFiveDayHistory()', function () {
            it('returns an object with both current data and previous five days', function () {
                // unit tests should not depend on other functionality, therefore, mock
                // getStockPrice and getStockFiveDayHistory functions
                w.getStockPrice = function () {
                    return Promise.resolve(CURRENT_DATA);
                };

                w.getStockFiveDayHistory = function () {
                    return Promise.resolve({history: FIVE_DAY_DATA});
                };

                return w
                    .getCurrentAndFiveDayHistory()
                    .should
                    .eventually
                    .deep
                    .equal({
                        ...CURRENT_DATA,
                        history: FIVE_DAY_DATA
                    });
            });
        });
    });

    after('reset fetch', fetchMock.resetBehavior);

});
