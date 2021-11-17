/* eslint-disable no-unused-expressions */
import { validate as isUuid } from 'uuid';
import * as config from '../Templates/AccordionTemplate2/index';

const compileAttributesData = async (metadataMap = {}, subAttributes) => {
  if (!window.threekitApi || !window.threekitApi.configurator)
    throw new Error('threekitApi not setup');
  const output = {};
  const attrLevel = !subAttributes ? 0 : 1;
  const attributes = subAttributes ? subAttributes : await window.threekitApi.player.configurator.getVisibleAttributes();

  await Promise.all(
    attributes.map(async (attr) => {

      const existSpecialcode = attr.values.find(value => value.name === "Special Code") ? attr.values.find(value => value.name === "Special Code") : null;
      if (existSpecialcode) {
        var idx = attr.values.indexOf(existSpecialcode);
        attr.values.splice(idx, 1);
      }

      const existSpecial = attr.values.find(value => value.name === "Special") ? attr.values.find(value => value.name === "Special") : null;
      if (existSpecial) {
        var idx = attr.values.indexOf(existSpecial);
        attr.values.splice(idx, 1);
      }

      const existCustomersOwnMaterial = attr.values.find(value => value.name === "Customer's Own Material") ? attr.values.find(value => value.name === "Customer's Own Material") : null;
      if (existCustomersOwnMaterial) {
        var idx = attr.values.indexOf(existCustomersOwnMaterial);
        attr.values.splice(idx, 1);
      }

      const existCustomersOwnLeather = attr.values.find(value => value.name === "Customer's Own Leather") ? attr.values.find(value => value.name === "Customer's Own Leather") : null;
      if (existCustomersOwnLeather) {
        var idx = attr.values.indexOf(existCustomersOwnLeather);
        attr.values.splice(idx, 1);
      }



      if (!['Asset', 'String'].includes(attr.type)) return output;
      output[attr.name] = {
        type: attr.type,
        label: attr.name,
        level: attrLevel
      };
      if (attr.type === 'String') {
        output[attr.name].values = attr.values.map((val) => ({
          id: val.toLowerCase().replace(' ', '-'),
          value: val,
          label: val,
          level: attrLevel
        }));
      };
      if (attr.type === 'Asset') {
        output[attr.name].values = await Promise.all(
          attr.values.map(async (val, index) => {
            const { name, configurator } = await window.threekitApi.api.scene.fetch(val.assetId).then(() => window.threekitApi.api.scene.get({ id: val.assetId }));
            const metadata = configurator.metadata;
            const imageUrl = metadata.find(metadataItem => metadataItem.name === "_UI_thumbnailUrl") ? metadata.find(metadataItem => metadataItem.name === "_UI_thumbnailUrl").defaultValue : '';
            const code = metadata.find(metadataItem => metadataItem.name === "optionCode") ? metadata.find(metadataItem => metadataItem.name === "optionCode").defaultValue : '';
            if (name) {
              return {
                id: name.toLowerCase().replace(' ', '-'),
                assetId: val.assetId,
                value: name,
                label: name,
                image: imageUrl !== '' ? imageUrl : '',
                level: attrLevel,
                code: code ? code : ''

              }
            }
          }))
      } else {
        output[attr.name].values = await Promise.all(
          attr.values.map(async (val) => {
            if (!val || !val.assetId) return;
            const opt = {
              id: val.name.toLowerCase().replace(' ', '-'),
              value: val.assetId,
              label: val.name,
              level: attrLevel
            };

            const dependency = new RegExp(/^_dependency/);
            const re = new RegExp(/^_/);
            const sceneApi = window.threekitApi.api.scene;
            let node = sceneApi.get({ id: val.assetId });
            if (!node) {
              await sceneApi.fetch(val.assetId);
              node = sceneApi.get({ id: val.assetId });
            }
            node.configurator.metadata.forEach((metadata) => {
              if (
                dependency.test(metadata.name) &&
                JSON.parse(metadata.defaultValue)
              )
                opt.dependencies = opt.dependencies
                  ? opt.dependencies.push(JSON.parse(metadata.defaultValue))
                  : [JSON.parse(metadata.defaultValue)];
              else if (metadata.name in metadataMap)
                opt[metadataMap[metadata.name]] = metadata.defaultValue;
              else if (re.test(metadata.name))
                opt[metadata.name.substring(1, metadata.name.length)] =
                  metadata.defaultValue;
            });
            return opt;
          })
        );
      }
    })
  );

  var outputs = Object.keys(output);
  if (outputs.length === 1) {
    var existSpecialcode = output[outputs[0]].values.find(value => value.value === "Special Code") ? output[outputs[0]].values.find(value => value.value === "Special Code") : null;
    if (existSpecialcode) {
      var idx = output[outputs[0]].values.indexOf(existSpecialcode);
      output[outputs[0]].values.splice(idx, 1);
    }
  }

  return output;
};

const getMetadata = async (catalogId) => {
  if (!window.threekitApi || !window.threekitApi.configurator)
    throw new Error('threekitApi not setup');
  const apiId = catalogId ? catalogId : window.threekitApi.api.assetId;
  const metadata = window.threekitApi.api.scene.get({ id: apiId }).configurator.metadata;
  return metadata;
};

const getCatalogName = async () => {
  if (!window.threekitApi || !window.threekitApi.configurator)
    throw new Error('threekitApi not setup');
  const apiId = window.threekitApi.api.assetId;
  return window.threekitApi.api.scene.get({ id: apiId }).name;
};

const fetchCatalogAttributes = async (catalogId) => {
  if (!window.threekitApi || !window.threekitApi.configurator)
    throw new Error('threekitApi not setup');

  const subCataloAttributes = await window.threekitApi.api.scene.fetch(catalogId).then(() => window.threekitApi.api.scene.get({ id: catalogId }).configurator.attributes);
  console.log(subCataloAttributes);
  return subCataloAttributes;
};

const getNewUpdateConfiguration = async (updatedConfiguration) => {
  for (var keyUpdatedConfiguration in updatedConfiguration) {
    updatedConfiguration[keyUpdatedConfiguration]?.assetId !== undefined && updatedConfiguration[keyUpdatedConfiguration]?.assetId !== "" ?
      updatedConfiguration[keyUpdatedConfiguration] = await window.threekitApi.api.scene.fetch(updatedConfiguration[keyUpdatedConfiguration].assetId).then(() => window.threekitApi.api.scene.get({ id: updatedConfiguration[keyUpdatedConfiguration].assetId }).name)
      : null
  }

  return updatedConfiguration;

};

const getVisibleAttributes = async () => {
  if (!window.threekitApi || !window.threekitApi.configurator || !window.threekitApi.player)
    throw new Error('threekitApi not setup');

  const visbleAttributes = window.threekitApi.player.configurator.getVisibleAttributes();
  return visbleAttributes;
};

export const getConfigurationOutput = async () => {
  if (!window.threekitApi) return;
  const configuration = window.threekitApi.configurator.getConfiguration();
  const attributes = await compileAttributesData();

  return Object.entries(configuration).reduce((output, [key, val]) => {
    if (!(key in attributes)) return output;

    const selected = attributes[key].values.find(
      (el) => (typeof val === 'object' ? val.assetId : val) === el.value
    );

    output[key] = {
      type: attributes[key].type,
      value: val,
      label: selected?.label,
      sku: selected?.sku,
    };
    return output;
  }, {});
};

/**
 * @desc To initialize the player we have to pass in an object
 *    with the the domain speicfic auth token, the assetId
 *    for the asset we're hoping to embed as well as the html
 *    div where the player is to be embedded.
 * @param object $initialSettings - object passed directly to threekitPlayer()
 * @return Promise - success or failure
 */
const initializePlayer = (initialSettings) => {
  return new Promise(async (resolve, reject) => {
    if (!window.threekitPlayer)
      reject('window.threekitPlayer object is missing threekitPlayer api');
    if (!initialSettings.authToken)
      reject('intialSettings object is missing the authToken');
    if (!initialSettings.assetId)
      reject('intialSettings object is missing the assetId');
    if (!initialSettings.orgId)
      reject('intialSettings object is missing the orgId');
    if (!initialSettings.el) reject('intialSettings object is missing the el');

    const threekitConfg = {
      el: initialSettings.el,
      authToken: initialSettings.authToken,
      assetId: initialSettings.assetId,
      orgId: initialSettings.orgId,
      initialConfiguration: initialSettings.initialConfiguration
    };
    //console.log(config.Test())
    const threekitApi = await window.threekitPlayer({
      //   authToken: '01234567-89ab-cdef-0123-456789abcdef',
      //   el: document.getElementById('player-root'),
      //   stageId: '27b9cd7e-2bb2-4a18-b788-160743eb4b33',
      //   assetId: 'e12a45f7-8b39-cd06-e12a-45f78b39cd06',
      //   showConfigurator: true,
      //   showAR: true,
      //   initialConfiguration: {},
      showShare: true,
      //initialConfiguration: config.Test2(),

      showLoadingThumbnail: true,

      ...threekitConfg,
    });

    if (!window.threekitPlayer) reject('Error initializing player');

    /***** API SETUP START ***************************************************************/
    //  Enables access to the threekit store api
    threekitApi.enableApi('store');

    //  Enables access to the threekit player api
    const player = threekitApi.enableApi('player');
    window.threekitApi = {
      api: threekitApi,
      player,
    };
    /***** API SETUP END *****************************************************************/

    /***** PLAYER TOOLS START ************************************************************/
    //  The functional interactions with the player can be removed
    //  either individually or as an array

    //  threekitApi.tools.removeTool('zoom');

    //  threekitApi.tools.removeTool(['pan', 'zoom']);
    /***** PLAYER TOOLS END **************************************************************/

    /***** PLAYER LIFECYCLE LISTENSERS START *********************************************/
    //  We add listeners to be triggered during the player's
    //  lifecycle events: PRELOADED, LOADED and RENDERED

    threekitApi.on(threekitApi.scene.PHASES.LOADED, async () => {
      //    Assigns default configurator to window object
      window.threekitApi.configurator = await threekitApi.getConfigurator();
      initialSettings.onPreload
        ? initialSettings.onPreload()
        : console.log('Player has preloaded data');
    });

    // threekitApi.on(threekitApi.scene.PHASES.LOADED, () => {
    //  initialSettings.onLoad ? initialSettings.onLoad() : console.log('Player has loaded all data');
    // });

    //  threekitApi.on(threekitApi.scene.PHASES.RENDERED, () => {
    //      initialSettings.onRender ? initialSettings.onRender() : console.log('Player has rendered the default asset')
    //  });
    /***** PLAYER LIFECYCLE LISTENSERS END ***********************************************/

    localStorage.setItem('menuSelected', 'materials-0');
    localStorage.setItem('gearSelected', 'Athletix');
    //document.getElementById('footerContainer').style.display = 'block';

    resolve(true);
  });
};

const setConfiguration = async (config, parent) => {
  if (!config || !window.threekitApi) return;

  if (typeof config !== 'object') return;

  const updateConfig = Object.entries(config).reduce(
    (output, [attribute, value]) =>
      Object.assign(output, {
        [attribute]: isUuid(value) ? { assetId: value } : value,
      }),
    {}
  );

  let keys = Object.keys(config);
  if (!keys[0].includes('Lettering')) {
    document.getElementById('loader-container').style.display = 'block';
  }
  await window.threekitApi.configurator.setConfiguration(updateConfig);

  if (parent) {
    window.attributeSelected = { parent: config[keys[0]] }
  } else {
    window.attributeSelected = config;
  }
  // config.parent
};

const getConfiguration = () => {
  if (!window.threekitApi) return;
  return window.threekitApi.configurator.getConfiguration();
};

const getSnapshot = async () => {
  if (!window.threekitApi) return;
  const { api } = window.threekitApi;
  return await api.snapshotAsync();
};

const getPrice = async (pricebookId, currencie) => {
  if (!window.threekitApi) return;
  const configurator = await window.threekitApi.api.getConfigurator();
  const price = await configurator.getPrice(pricebookId, currencie)
  return price;
};

const getDataTableId = async (catalogId) => {
  if (!window.threekitApi) return;
  const apiId = catalogId ? catalogId : window.threekitApi.api.assetId;
  const metadata = window.threekitApi.api.scene.get({ id: apiId }).configurator.metadata;
  const datatableId = metadata.find(metadataItem => metadataItem.name === "_data_table_id") ? metadata.find(metadataItem => metadataItem.name === "_data_table_id").defaultValue : '';
  return datatableId;
};

const getfirstPreset = async (catalogId) => {
  if (!window.threekitApi) return;
  const apiId = catalogId ? catalogId : window.threekitApi.api.assetId;
  const metadata = window.threekitApi.api.scene.get({ id: apiId }).configurator.metadata;
  const firstPreset = metadata.find(metadataItem => metadataItem.name === "_initial_config") ? metadata.find(metadataItem => metadataItem.name === "_initial_config").defaultValue : '';
  return firstPreset;
};

export default {
  initializePlayer,
  compileAttributesData,
  setConfiguration,
  getConfiguration,
  getConfigurationOutput,
  getSnapshot,
  getMetadata,
  getCatalogName,
  fetchCatalogAttributes,
  getNewUpdateConfiguration,
  getVisibleAttributes,
  getPrice,
  getDataTableId,
  getfirstPreset
};
