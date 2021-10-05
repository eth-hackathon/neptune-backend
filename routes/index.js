const { Router } = require('express')
const router = Router()
const { addUser, getUser, getServerDID } = require("../service/user.js")

router.get('/api/server-did', getServerDID);
router.get('/api/user', getUser);
router.post('/api/user', addUser);

module.exports = router;
