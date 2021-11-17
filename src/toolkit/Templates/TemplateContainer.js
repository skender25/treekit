import React, { useState, useEffect } from 'react';
import { threekitService } from './../toolkit/threekit.service';
import {
  handleAddToCart,
  handleInputSelect,
} from '../../config/eventListeners';
import toolkit from '../toolkit';

const TemplateContainer = ({
  template: Template,
  title,
  subtitle,
  threekitConfig,
}) => {
  const [controller, setController] = useState([]);
  const [languageData, setLanguageData] = useState({});
  const [configuration, setConfiguration] = useState(null);

  const getUrlParameter = () => {
    const urlParameter = window.location.search;
    const urlParams = new URLSearchParams(urlParameter);

    const initialSettings = {
      authToken: urlParams.has('authToken') === true ? urlParams.get('authToken') : threekitConfig.authToken,
      assetId: urlParams.has('assetId') === true ? urlParams.get('assetId') : threekitConfig.assetId,
      orgId: urlParams.has('orgId') === true ? urlParams.get('orgId') : threekitConfig.orgId,
      showAR: urlParams.has('showAR') === true ? urlParams.get('showAR') === 'true' ? true : false : false,
      showConfigurator: urlParams.has('showConfigurator') === true ? urlParams.get('showConfigurator') === 'true' ? true : false : false,
      stageId: urlParams.has('stageId') === true ? urlParams.get('stageId') : null,
      locale: urlParams.has('locale') === true ? urlParams.get('locale') : threekitConfig.defaultLocale,
      currency: urlParams.has('currency') === true ? urlParams.get('currency') : threekitConfig.currency,
      pricebookName: urlParams.has('pricebookName') === true ? urlParams.get('pricebookName') : threekitConfig.pricebookName,
      showSIF: threekitConfig.showSIF,
      initialConfiguration: threekitConfig.initialConfiguration
    };
    return initialSettings
  };

  const threekitConfigByUrl = getUrlParameter();
  // eslint-disable-next-line no-unused-expressions
  threekitConfigByUrl.authToken !== null && threekitConfigByUrl.assetId !== null && threekitConfigByUrl.orgId !== null ? threekitConfig = threekitConfigByUrl : null;

  useEffect(() => {
    (async () => {
      const serviceUrl = `${threekitConfig.env}/api/assets/translations?locale=${threekitConfigByUrl.locale}&orgId=${threekitConfigByUrl.orgId}&bearer_token=${threekitConfigByUrl.authToken}`;
      await threekitService('get', serviceUrl).then((res) => {
        setLanguageData(res);
      });
      console.log("la wea fome "+serviceUrl);
      toolkit.player.initializePlayer({
        el: document.getElementById('player-root'),
        ...threekitConfig,
        onPreload: async () => {
          localStorage.setItem('catalog-sections', null);
          localStorage.setItem('catalog-inputs', null);
          localStorage.setItem('catalog-attributes', null);
          localStorage.setItem('catalog-first-levels', null);
          localStorage.setItem('catalog-main-attribute', null);
          const templateData = await toolkit.template.prepTemplate();
          setController(templateData);
        },
      });
    })();
  }, []);

  //Adding First Level to main attribute
  const addingLevelToMainAttribute = (attribute, subCatalogAttributes) => {
    let mainAttributes = JSON.parse(localStorage.getItem('catalog-main-attribute'));
    mainAttributes[attribute] = subCatalogAttributes;
    localStorage.setItem('catalog-main-attribute', JSON.stringify(mainAttributes));
  };

  // Get New Configuration
  const getNewConfiguration = (updatedConfiguration) => {
    let mainAttributes = JSON.parse(localStorage.getItem('catalog-main-attribute'));
    for (var attribute in updatedConfiguration) {
      if (typeof updatedConfiguration[attribute] === 'string') {
        updatedConfiguration[attribute] = mainAttributes[attribute];
      }
    }
    return updatedConfiguration;
  }

  const handleSetAttribute = async (config) => {
    if (config.parent && config.firstLevel) {
      await toolkit.player.setConfiguration({ [config.firstLevel]: config.assetId }, config.parent);
    } else if (config.parent && !config.firstLevel) {
      addingLevelToMainAttribute(config.parent, config.value)
      await toolkit.player.setConfiguration({ [config.parent]: config.assetId }, null);
    } else {
      await toolkit.player.setConfiguration(config, null);
    }
    const updatedConfiguration = toolkit.player.getConfiguration();
    await toolkit.template.prepTemplate(config).then(async (result) => {
      const templateData = result;
      setController(templateData);
      await toolkit.player.getNewUpdateConfiguration(updatedConfiguration);
      setConfiguration(getNewConfiguration(updatedConfiguration));
      handleInputSelect();
    });
  };

  const addToCart = async () => {
    const configOutput = await toolkit.player.getConfigurationOutput();
    console.log(configOutput);
    handleAddToCart("config output: " + configOutput);
  };



  //addToCart();

  return (
    <Template
      title={title}
      subtitle={subtitle}
      controller={controller}
      configuration={configuration}
      languageData={languageData}
      handleSetAttribute={handleSetAttribute}
      threekitConfigByUrl={threekitConfigByUrl}
    />
  );
};

export const getPlayerConfig = async () => {
  try {
    const configOutput = await toolkit.player.getConfigurationOutput();
    //console.log('Config output in class: ' + JSON.stringify(configOutput));
    return configOutput;
  } catch (err) {
    console.log(err)
  }

}

export default TemplateContainer;
