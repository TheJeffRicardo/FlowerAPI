const express = require('express');

const router = require('./controller');

const cors = require('cors');

const port = process.env.PORT || 4000;

const app = express();

const {errorHandling} = require('./middleware/errorHandling');

const cookieParser = require('cookie-parser');

app.use(errorHandling)

app.use((req, res, next)=> {
        res.header('Access-Control-Allow-Origin', '*')
        res.header("Access-Control-Allow-Credentials", "true")
        res.header("Access-Control-Allow-Methods", "*")
        res.header("Access-Control-Allow-Headers", "*")
        next();
});
app.use(router);
app.use(
    cors(),
    cookieParser(),
    express.json,
    express.urlencoded({extended: false})
)

// Server is running
app.listen(port, ()=> {
    console.log(`The server you're using is ${port}`)
})