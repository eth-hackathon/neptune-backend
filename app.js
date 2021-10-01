require('dotenv').config()
const express = require("express")
const cors = require("cors");
const myLogger = require("./logger")
const routes = require("./routes")

const app = express()

// middlewares
app.use(cors())
app.use(express.json());
app.use(myLogger)

// routes
app.use('/', routes);

app.listen(process.env.PORT, () => {
  console.log(`Neptune app listening at http://localhost:${process.env.PORT}`)
})
