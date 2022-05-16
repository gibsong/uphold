const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: process.env.POSTGRES_HOST,
    database: 'uphold',
    password: 'password',
    port: 5432,
    connectionTimeoutMillis: 5000,  //time to wait for pool to give connection
    idleTimeoutMillis: 30000        //if conn not used to time to wait until destroying it
})

function cleanUp(signal) {
    console.log(`Received signal (${signal}), shutting down gracefully`);
    pool?.end().then(() => console.log('pool has ended'))
}

pool.on('error', (err, client) => {
    console.log(`pool error: ${err}`)
    cleanUp('poolError')
})


function getHistory(ticker) {
    return pool.query(`select price, dateTime from historical_prices where currencypair = \'${ticker}\' order by dateTime desc limit 12`)
        .then((res) => {
            let history = []
            for(let i=0; i<res?.rows.length; i++) {
                history.push({price: res.rows[i].price, datetime: res.rows[i].datetime})
            }
            let json = { history: history }
            //console.log(`getHistory ticker:${ticker} json: ${JSON.stringify(json)}`);
            return json;
        })
        .catch(err => {console.error('query error', err.stack)})
}

process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err);
    pool?.end().then(() => console.log('pool has ended'))
    process.exit(1);
})

process.once("SIGINT", cleanUp);    //ctrl + c
process.once("SIGTERM", cleanUp);   //kill
process.on("exit", cleanUp);

module.exports = {getHistory};
