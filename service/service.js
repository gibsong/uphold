const express = require('express');
const app = express();

const routes = require('./routes');
routes(app);
const PORT = 4040;

app.listen(PORT, () => {
    console.log(`Listening to port http://localhost:${PORT}`);
});