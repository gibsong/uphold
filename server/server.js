const express = require("express");
const cors = require("cors");
const app = require("./app")


//Setup Express
const server = express();

server.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ["GET", "OPTIONS"],
    })
);

server.use(app())

//Redirect to default route
server.get("*", function (req, res) {
    res.redirect("/");
});


const PORT = 9000
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});

