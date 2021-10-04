const ceramic = require("./ceramic.js")

const addUser = async function (req, res, next) {
  const { stackID, ethAddr, protocols } = req.body;

  try {
    const streamID = await ceramic.addNewUser({
      stackID,
      ethAddr,
      protocols,
    });

    res.send(streamID);
  } catch (error) {
    console.log(error);
    next()
  }
}

const getUser = async function (req, res, next) {
  const { streamId } = req.query;

  try {
    const stream = await ceramic.getUser({ streamId });

    res.send(stream);
  } catch (error) {
    console.log(error);
    next()
  }
}

module.exports = { addUser, getUser };
