const { Router } = require('express')
const router = Router()
const { addUser, getUser, getServerDID, getJsonModel } = require("../service/index.js")

router.get('/api/server-did', getServerDID);
router.get('/api/json-model', getJsonModel);
router.get('/api/user', getUser);
router.post('/api/user', addUser);

module.exports = router;
