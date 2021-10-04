const express = require("express")
const cors = require("cors");
const myLogger = require("./logger")
const routes = require("./routes/index")
const ceramic = require("./service/ceramic.js")
require('dotenv').config()

const app = express()

// middlewares
app.use(cors())
app.use(express.json());
app.use(myLogger)

ceramic.authenticate(process.env.SEED);

// routes
app.use('/', routes);

app.listen(process.env.PORT, () => {
  console.log(`Neptune app listening at http://localhost:${process.env.PORT}`)
})
