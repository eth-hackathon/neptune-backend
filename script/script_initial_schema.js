const { writeFile } = require('fs').promises
const Ceramic = require('@ceramicnetwork/http-client').default
const { createDefinition, publishSchema } = require('@ceramicstudio/idx-tools')
const KeyDidResolver = require('key-did-resolver').default;
const ThreeIdResolver = require('@ceramicnetwork/3id-did-resolver').default;
const { Ed25519Provider } = require('key-did-provider-ed25519')
const DID = require('dids').DID
require('dotenv').config()

const API_URL = "https://ceramic-clay.3boxlabs.com";

const ProfilSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'NeptuneProfil',
  type: 'object',
  properties: {
    stackID: {
      type: 'string',
      title: 'stack exchange ID',
      pattern: "[0-9]",
      maxLength: 10,
    },
    protocols: {
      type: 'array',
      title: 'Name of the protocols the user registered to',
      items: {
        type: 'string',
      },
      maxLength: 4000,
    },
    caip10Link: {
      type: 'string',
      title: 'link a crypto account to a DID',
      $ref: '#/definitions/caip10Link',
    },
    ethAddr: {
      type: 'string',
      title: 'crypto address link with the caip10link',
      $ref: '#/definitions/ethAddr',
    }
  },
  definitions: {
    caip10Link: {
      type: 'string',
      pattern: "^ceramic://.+",
      maxLength: 1024,
    },
    ethAddr: {
      type: 'string',
      pattern: "[a-zA-Z0-9]",
      maxLength: 1024,
    }
  }
}

const ProfilsListSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'NeptuneProfilsList',
  type: 'object',
  properties: {
    notes: {
      type: 'array',
      title: 'profils',
      items: {
        type: 'object',
        title: 'profilItem',
        properties: {
          id: {
            $ref: '#/definitions/CeramicDocId',
          },
          title: {
            type: 'string',
            title: 'title',
            maxLength: 100,
          },
        },
      },
    },
  },
  definitions: {
    CeramicDocId: {
      type: 'string',
      pattern: '^ceramic://.+(\\?version=.+)?',
      maxLength: 150,
    },
  },
}

async function createSchema() {
  try {

    const ceramic = new Ceramic(API_URL);
    const keyDidResolver = KeyDidResolver.getResolver()

    const threeIdResolver = ThreeIdResolver.getResolver(ceramic)
    const resolverRegistry = {
      ...threeIdResolver,
      ...keyDidResolver,
    }
    const did = new DID({
      provider: new Ed25519Provider(JSON.parse(process.env.SEED)),
      resolver: resolverRegistry,
    })
    await did.authenticate()
    await ceramic.setDID(did)

    const [profilSchema, profilsListSchema] = await Promise.all([
      publishSchema(ceramic, { content: ProfilSchema }),
      publishSchema(ceramic, { content: ProfilsListSchema }),
    ])

    const profilsListDefinition = await createDefinition(ceramic, {
      name: 'List of profils',
      description: 'Saturn project, format for list of profils',
      schema: profilsListSchema.commitId.toUrl(),
    })

    const config = {
      definitions: {
        profilListDef: profilsListDefinition.commitId.toUrl(),
      },
      schemas: {
        ProfilSchema : profilSchema.commitId.toString(),
        ProfilsListSchema: profilsListSchema.commitId.toString(),
      },
    }

    await writeFile('./config.json', JSON.stringify(config))
  } catch (error) {
    console.error('Ceramic schema error: \n', error)
  }
}

createSchema()
