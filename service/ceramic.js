const Ceramic = require('@ceramicnetwork/http-client').default
const KeyDidResolver = require('key-did-resolver').default;
const ThreeIdResolver = require('@ceramicnetwork/3id-did-resolver').default;
const { Ed25519Provider } = require('key-did-provider-ed25519');
const { TileDocument } = require('@ceramicnetwork/stream-tile');
const DID = require('dids').DID
const { IDX } = require("@ceramicstudio/idx");
const { definitions, schemas } = require('../config.json');

class ceramicSingleton {
  constructor() {
    this.ceramic;
    this.idx;
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

      const idx = new IDX({ ceramic, aliases: definitions });

      this.ceramic = ceramic;
      this.idx = idx;

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
      const doc = await TileDocument.create(
        this.ceramic,
        { stackID, ethAddr, protocols },
        {
          controllers: [ this.idx.id ],
          schema: schemas.ProfilSchema,
        }
      );

      return doc.id.toString();
    } catch (error) {
      console.log(error);
    }
  }

  getInstance () {
    return this.idx;
  }
};

module.exports = new ceramicSingleton();
