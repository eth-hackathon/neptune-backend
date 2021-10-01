const express = require('express')
const cors = require("cors");
const app = express()
const port = 8080

const myLogger = function (req, res, next) {
  console.log('URL: ', req.url)
  next()
}

// middlewares
app.use(cors())
app.use(express.json());
app.use(myLogger)

// routes
app.get('/api/example', (req, res) => {
  console.log(req.query)
  res.send('Hello World!')
})

app.post('/api/example', (req, res) => {
  console.log(req.body)
  res.send('This is a post request my friend')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
