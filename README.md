# neptune-backend
Back end for Neptune

## Env file
Please create a `.env` file and add this :
You'll have to ask @Kipitup for the seed.
```
PORT=8080
CERAMIC_API_URL="https://ceramic-clay.3boxlabs.com"
SEED=
```

## Server initialization
Before running the server, please launch the following command:

`npm install && node schema/script_initial_schema.js`

The script will initialize a Ceramic node in local and add basic data to be displayed in the frontend.

## Run server

At the root of the directory run : `npm run server`


## Debugging
For debugging with Ceramic, I recommend installing the [ceramic daemon](https://developers.ceramic.network/build/cli/installation/)

`npm install -g @ceramicnetwork/cli`

Once it's done, you can launch the deamon anywhere in your computer with:
`ceramic daemon`

Once the daemon is running you can query stream in your terminal:
`ceramic show _streamID_`
For more info run
`ceramic state _streamID_`

A streamID looks like this : `kjzl6cwe1jw1498usm57b741fqjg729fpkqtj0wkkiakdcq5dpxiq70t6di3y5l`
