const { Router } = require('express')
const router = Router()

router.get('/api/example', (req, res) => {
  console.log(req.query)
  res.send('Hello World!')
})

router.post('/api/example', (req, res) => {
  console.log(req.body)
  res.send('This is a post request my friend')
})

module.exports = router;
