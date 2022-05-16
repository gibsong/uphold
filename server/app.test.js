const app = require('./app')
const express = require('express');
const moxios = require('moxios');
const request = require('supertest');
const { API_TICKER_URL } = require('./config')

const initExpress = () => {
    const server = express();
    server.use(app());
    return server;
}

describe('GET currency pair prices for each ticker', () => {

    beforeEach(() => {
        moxios.install();
    });
    afterEach(() => {
        moxios.uninstall();
    });

    test('It should fetch all tickers', async () => {
        moxios.stubRequest(`${API_TICKER_URL}`, {
            status: 200,
            response:[
                    {
                        "ask": "1.3008055272",
                        "bid": "1.2908608046",
                        "currency": "USD",
                        "pair": "1INCH-USD"
                    },
                    {
                        "ask": "160.91683125",
                        "bid": "154.37798125",
                        "currency": "USD",
                        "pair": "AAPL-USD"
                    },
                    {
                        "ask": "142.0420239403",
                        "bid": "141.3707199202",
                        "currency": "USD",
                        "pair": "AAVE-USD"
                    },
                    {
                        "ask": "0.7997966789",
                        "bid": "0.7951409893",
                        "currency": "USD",
                        "pair": "ADAUSD"
                    },
                    {
                        "ask": "408.55023825",
                        "bid": "392.52983825",
                        "currency": "USD",
                        "pair": "ADBE-USD"
                    }
                ]

        });
        const app = initExpress();
        const res = await request(app).get('/api/v1/pairs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"currencyPairs": ["1INCH-USD", "AAPL-USD", "AAVE-USD", "ADAUSD", "ADBE-USD"]});

    });

    test('It should return empty object when no data returned from Uphold API', async () => {
        moxios.stubRequest(`${API_TICKER_URL}`, {
            status: 200,
            response: null
        });
        const app = initExpress();
        const res = await request(app).get('/api/v1/pairs');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});

    });

    test('It should fail with error when fetching all tickers', async () => {
        moxios.stubRequest(`${API_TICKER_URL}`, {
            status: 404,
            response: {}
        });
        const app = initExpress();
        const res = await request(app).get('/api/v1/pairs');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({});

    });

    test('It should fetch pricing for a currency pair', async () => {
        moxios.stubRequest(`${API_TICKER_URL}BTC-USD`, {
            status: 200,
            response:{
                "ask": "34520.849971282",
                "bid": "34336.00157514",
                "currency": "USD"
            }

        });
        const app = initExpress();
        const res = await request(app).get('/api/v1/currency/BTC-USD');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({"price": "34520.849971282"});
    });

    test('It should fetch null for a currency pair', async () => {
        moxios.stubRequest(`${API_TICKER_URL}123456`, {
            status: 200,
            response:null

        });
        const app = initExpress();
        const res = await request(app).get('/api/v1/currency/123456');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
    });

    test('It should fail fetching invalid currency pair that is correct length', async () => {
        moxios.stubRequest(`${API_TICKER_URL}BTC-XXX`, {
            status: 404,
            response:{
                "code": "not_found",
                "message": "Not Found"
            }

        });
        const app = initExpress();
        const res = await request(app).get('/api/v1/currency/BTC-XXX');
        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({});
    });

    test('It should fail with 400 error because param too short', async () => {
        const app = initExpress();
        const res = await request(app).get('/api/v1/currency/BTC');
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({});
    });

    test('It should fail with 400 error because param too long', async () => {
        const app = initExpress();
        const res = await request(app).get('/api/v1/currency/BTC-USD1234');
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({});
    });


})
