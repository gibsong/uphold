const { Client } = require('pg')
const axios = require("axios");
const copyFrom = require('pg-copy-streams').from;

const API_TICKER_URL = 'https://api.uphold.com/v0/ticker/'
const fiveSec = 5 * 1000
const fiveMin = 5 * 60 * 1000

const client = new Client({
    user: 'postgres',
    host: process.env.POSTGRES_HOST,
    database: 'uphold',
    password: 'password',
    port: 5432,
    connectionTimeoutMillis: 5000
})

function cleanUp(signal) {
    console.log(`Received signal (${signal}), shutting down gracefully`);
    clearInterval(timerPopulateDB)
    clearInterval(timerScavenger)
    client.end();
}

client.on('error', err => {
    console.error('ERROR: ', err.stack)
    cleanUp('connectionError')
})


const populateDB = () => {
    axios.get(API_TICKER_URL)
        .then(function (response) {

            if(response?.data) {

                let stream = client.query(copyFrom("COPY historical_prices FROM STDIN DELIMITER ','"));
                stream.on('error', () => cleanUp('streamError'))

                //build insert rows
                let now = new Date()
                for(let i=0; i<response.data.length; i++) {
                    stream.write(`${response.data[i].pair}, ${response.data[i].ask}, ${now.toISOString()}\n`);
                }
                stream.end();

                client.query(`select count(*) from historical_prices where datetime >= \'${now.toISOString()}\'`)
                    .then((res) => {console.log(`inserted ${res?.rows[0]?.count} rows`);})
                    .catch(err => {console.error('insert error', err.stack)})

            } else {
                console.log('no ticker data returned!!!')
            }
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

const scavenger = () => {

    let oldestTime = new Date(Date.now() - fiveMin)
    client.query(`DELETE from historical_prices where datetime < \'${oldestTime.toISOString()}\'`)
        .then((res) => {console.log(`deleted ${res?.rowCount} rows`);})
        .catch(err => {console.error('delete error', err.stack)})
}

let timerPopulateDB = 0
let timerScavenger = 0
client.connect()
        .then(() => {
            console.log('connected to DB')
            timerPopulateDB = setInterval(populateDB, fiveSec)
            timerScavenger = setInterval(scavenger, fiveMin)
        })
        .catch(err => {
            console.error('connection error', err.stack)
        })

process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err);
    process.exit(1);
});

process.once("SIGINT", cleanUp);    //ctrl + c
process.once("SIGTERM", cleanUp);   //kill
process.on("exit", cleanUp);

