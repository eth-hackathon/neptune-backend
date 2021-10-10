const Ceramic = require('@ceramicnetwork/http-client').default
const KeyDidResolver = require('key-did-resolver').default;
const ThreeIdResolver = require('@ceramicnetwork/3id-did-resolver').default;
const { Ed25519Provider } = require('key-did-provider-ed25519');
const { TileDocument } = require('@ceramicnetwork/stream-tile');
const DID = require('dids').DID
const { DataModel } = require('@glazed/datamodel');
const { DIDDataStore } = require('@glazed/did-datastore');
const modelAliases = require('../schema/model.json');

class ceramicSingleton {
  constructor() {
    this.ceramic;
    this.model;
    this.store;
  }

  async authenticate (seed) {
    try {
      const ceramic = new Ceramic(process.env.CERAMIC_API_URL);
      const keyDidResolver = KeyDidResolver.getResolver();
      const threeIdResolver = ThreeIdResolver.getResolver(ceramic);
      const resolverRegistry = {
        ...threeIdResolver,
        ...keyDidResolver,
      }
      const did = new DID({
        provider: new Ed25519Provider(JSON.parse(seed)),
        resolver: resolverRegistry,
      })

      await did.authenticate();
      await ceramic.setDID(did);

      const model = new DataModel({ ceramic, model: modelAliases })
      const store = new DIDDataStore({ ceramic, model })

      const tiles = modelAliases.tiles;
      const array = [
        { id: tiles.uniswap, name: "uniswap" },
        { id: tiles.ceramic, name: "ceramic" },
        { id: tiles.aave, name: "aave" },
      ]

      await store.set('protocolsList', array);

      // const exampleNote = await model.loadTile('random')
      // console.log(exampleNote.id.toString());

      // await exampleNote.update({
      //   nbQuestions: 100,
      //   scoreQuestions: 50,
      //   nbAnswers: 120,
      //   scoreAnswers: 40,
      //   reward: 100000,
      // })

      // const test = await model.loadTile('random')

      // console.log('test return ', test.id.toString());
      // console.log(test.content)


      this.ceramic = ceramic;
      this.model = model;
      this.store = store;

      console.log('ceramic.did : ', ceramic.did._id);
    } catch(error) {
      console.log("Ceramic error: ", error);
    }
  }

  async getUser({ streamId }) {
    try {
      const stream = await TileDocument.load(this.ceramic, streamId);

      return stream.content;
    } catch (error) {
      console.log(error);
    }
  }

  async addNewUser ({ethAddr, stackID, protocols}) {
    try {
      // const doc = await TileDocument.create(
      //   this.ceramic,
      //   { stackID, ethAddr, protocols },
      //   {
      //     controllers: [ this.idx.id ],
      //     schema: schemas.ProfilSchema,
      //   }
      // );

      // const streamId = doc.id.toString();

      // console.log('StreamId is : ', streamId)

      const listOfProfils = await this.idx.get('profilListDef');

      const list = listOfProfils ? listOfProfils.profils : []

      const recordId = await this.idx.set('profilListDef', {
        profils: [{ stackID, ethAddr, protocols }, ...list],
      });

      return recordId
    } catch (error) {
      console.log(error);
    }
  }

  getServerDID () {
    return this.ceramic.did._id;
  }

  getJsonModel () {
    return modelAliases;
  }
};

module.exports = new ceramicSingleton();
