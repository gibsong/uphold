const { Router } = require('express')
const axios = require("axios");
const { MAX_LENGTH, MIN_LENGTH, API_TICKER_URL } = require('./config')

const API_HISTORY_URL = `http://${process.env.HISTORY_HOST}:4040/api/v1/service/history/`

function isValidPair(currencyPair) {
    if(currencyPair.length > MAX_LENGTH || currencyPair.length < MIN_LENGTH) {
        return false
    }
    return true
}

module.exports = (router = new Router()) => {

    router.get('/api/v1/history/:ticker', async(req, res) => {

        try {

            if(!isValidPair(req.params.ticker)) {
                res.status(400).json({})
            } else {
                const url = `${API_HISTORY_URL}${req.params.ticker}`
                const response = await axios.get(url);
                if(response?.data) {
                    res.status(200).json(response.data)
                } else {
                    res.status(200).json({})
                }
            }

        } catch (error) {
            console.log(req, "getHistoricalPrices", null, error);
            res.status(500).json({})
        }
    })

    router.get('/api/v1/currency/:ticker', async(req, res) => {

        try {

            if(!isValidPair(req.params.ticker)) {
                res.status(400).json({})
            } else {
                const url = `${API_TICKER_URL}${req.params.ticker}`
                const response = await axios.get(url);
                if(response?.data) {
                    res.status(200).json({price: response.data.ask})
                } else {
                    res.status(200).json({})
                }
            }

        } catch (error) {
            console.log(req, "getCurrencyPair", null, error);
            res.status(500).json({})
        }
    })

    router.get('/api/v1/pairs', async(req, res) => {
        try {

            const response = await axios.get(API_TICKER_URL);
            if(response?.data) {

                const currencyPairs = new Set()
                //extract currency pair
                for(let i=0; i<response.data.length; i++) {
                    currencyPairs.add(response.data[i].pair.toUpperCase())
                }

                let currencyPairsSorted = [...currencyPairs]
                //sort ASC
                currencyPairsSorted.sort(function(a, b) {
                    return a.localeCompare(b)
                })

                res.status(200).json({currencyPairs: currencyPairsSorted})
            } else {
                res.status(200).json({})
            }
        } catch (error) {
            console.log(req, "getCurrencyPairs", null, error);
            res.status(500).json({})
        }

    })

    return router;
};
