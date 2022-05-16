import React, { useState, useEffect } from "react";
import LineChartLive from './components/lineChartLive/LineChartLive'
import 'bootstrap/dist/css/bootstrap.min.css';
import DurationPicker from 'react-duration-picker';
import { API_CURRENCY_PAIRS_URL, HEADERS } from "./config";

function App() {

    const [thresholdPrice, setThresholdPrice] = useState(30000)
    const [currencyPair, setCurrencyPair] = useState("BTCUSD")
    const [fetchInterval, setFetchInterval] = useState(5000)//milliseconds
    const [seconds, setSeconds] = useState(5)
    const [minutes, setMinutes] = useState(1)
    const [hours, setHours] = useState(1)
    const [currencyPairs, setCurrencyPairs] = useState([])

    useEffect( () => {
      fetch(API_CURRENCY_PAIRS_URL, HEADERS)
          .then(res => res.json())
          .then(json => {

              const currencyPairs = []
              for (let j = 0; j < json.currencyPairs.length; j++) {
                  currencyPairs.push(json.currencyPairs[j])
              }

              setCurrencyPairs(currencyPairs)
          }).catch((error) => {
          console.error(`fetch currencies Error:`, error);
      });
    }, [])

    const createCurrencyPairOptions = () => {
        const currencyPairOptions = []

        for (let j = 0; j < currencyPairs.length; j++) {
            //TODO tickers that contain periods (even when escaped in url using ASCII %2E) fail on Uphold API call, return not found.
            //TODO Thus exclude them for now and figure out what the issue is.
            if(currencyPairs[j] !== 'BRK.B-USD' && currencyPairs[j] !== 'USD-BRK.B') {
                currencyPairOptions.push(<option key={currencyPairs[j]} id={currencyPairs[j]}>{currencyPairs[j]}</option>)
            }
        }
        return currencyPairOptions;
    }

    const handleChange = duration => {
        const { hours, minutes, seconds } = duration;
        setSeconds(seconds)
        setMinutes(minutes)
        setHours(hours)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let interval = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000)
        setFetchInterval(interval)
    }

    return (
        <div className="container">

          <form onSubmit={handleSubmit}>
              <div className="row">

                  <div className="col-4 offset-1">
                      <div className="input-group mt-3 mb-4">
                          <label htmlFor="inputPriceThreshold" className="input-group-text">Price Threshold:</label>
                          <input
                              id="inputPriceThreshold"
                              type="text"
                              value={thresholdPrice}
                              onChange={(event) => {setThresholdPrice(event.target.value)}}
                              className="form-control"
                          />
                      </div>

                      <div className="input-group mt-3">
                          <label htmlFor="inputInterval" className="input-group-text">Currency Pair:</label>
                          <select id="inputInterval"
                                  value={currencyPair}
                                  className="form-select"
                                  onChange={(event) => {setCurrencyPair(event.target.value)}}
                          >
                              {createCurrencyPairOptions()}
                          </select>
                      </div>
                  </div>

                  <div className="col-7">
                      <div className="input-group mt-3">
                          <label htmlFor="inputInterval" className="input-group-text">Interval:</label>
                          <DurationPicker
                              id="inputInterval"
                              className="form-control"
                              onChange={handleChange}
                              initialDuration={{hours: 0, minutes: 0, seconds: 5}}
                              maxHours={24}
                          />
                          <button type="submit" className="btn  btn-primary" >Update</button>
                      </div>
                  </div>

              </div>
          </form>

          <div className="row">
              <div className="col-12">
                  <LineChartLive thresholdPrice={thresholdPrice} currencyPair={currencyPair} fetchInterval={fetchInterval}/>
              </div>
          </div>

        </div>
    );
}

export default App;
