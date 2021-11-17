import React, { useState, useEffect, useCallback } from 'react';
import { Accordion1 as Accordion } from '../../Controllers';
import Player from '../SharedComponents/Player';
//import Carousel from 'react-elastic-carousel'
import {
  Wrapper,
  PlayerWrapper,
  Title,

} from './accordionTemplate2.styles';
import { pricebookService, getCatalogInfo, saveConfiguration, getConfiguration, getDataTableRows, saveConfigurationSIF, createOrder } from '../../toolkit/threekit.service';
import toolkit from '../../toolkit';
import states from '../../InputComponents/Dropdown/states';
import { getPlayerConfig } from '../../Templates/TemplateContainer'

const AccordionTemplate2 = ({

  controller,
  configuration,
  handleSetAttribute,
  languageData,
  threekitConfigByUrl
}) => {
  const [activeAddress, setActiveAddress] = useState([0, 0]);
  const [price, setPrice] = useState(0);
  const [catalogInfo, setCatalogInfo] = useState({});
  const [dataTable, setDataTable] = useState([]);
  const [ordeCodeArray, setOrdeCodeArray] = useState([]);
  const [dropdownStatus, setDropDownStatus] = useState(null);
  const [newConfig, setNewConfig] = useState(null);
  const [renderedItems, setRenderedItems] = useState([]);
  const [jsonArray, setJsonArray] = useState([]);
  const [initialPlayerConfig, setInitialPlayerConfig] = useState(null);
  const [hasInitialConfig, setHasInitialConfig] = useState(false);
  //const [currentPlayerConfig, setCurrentPlayerConfig] = useState(null);

  const breakPoints = [
    { width: 1, itemsToShow: 5 },
    { width: 550, itemsToShow: 3, itemsToScroll: 2 },
    { width: 768, itemsToShow: 3 },
    { width: 1200, itemsToShow: 4 }
  ];

  const [showing, setShowing] = useState(false);


  const [windowWidth, setWindowWidth] = useState(0);
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    (async () => {
      getCatalogInfo(threekitConfigByUrl.orgId, threekitConfigByUrl.assetId, threekitConfigByUrl.authToken).then(async (res) => {
        if (res) {
          setCatalogInfo(res);
        }
      });
    })();
  }, []);

  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  const getDataTableRowsById = async () => {
    let data = [];
    await toolkit.player.getDataTableId(threekitConfigByUrl.assetId).then(async (dataTableIdResult) => {
      if (dataTableIdResult) {
        getDataTableRows(dataTableIdResult, threekitConfigByUrl.authToken).then(async (dataTableRowsResult) => {
          if (dataTableRowsResult) {
            dataTableRowsResult.forEach((item, index) => {
              getConfiguration(item.value.configurationId, threekitConfigByUrl.authToken).then(async (getConfigurationResult) => {
                if (getConfigurationResult) {
                  jsonArray.length = 0;
                  convert(getConfigurationResult.variant);
                  let config = toObject(jsonArray)
                  data.push({ config: config, thumbnailUrl: item.value.thumbnailUrl });
                  setShowing(true);
                };
                if (index === (dataTableRowsResult.length - 1) && dataTable.length !== dataTableRowsResult.length) {
                  setDataTable(data);
                };
              });
            });
          };
        });
      }
    });
  };

  const saveConfigSIF = async () => {
    var configId = '';
    var variant = await getPlayerConfig();
    saveConfigurationSIF(threekitConfigByUrl.authToken, threekitConfigByUrl.orgId, threekitConfigByUrl.assetId, variant).then(async (res) => {
      if (res) {
        configId = res.id;
        callCreateOrder(configId);
      }
    })
  }

  const callCreateOrder = async (configId) => {
    var orderId, sifUrl = '';
    createOrder(threekitConfigByUrl.authToken, configId, threekitConfigByUrl.orgId).then(async (res) => {
      if (res) {
        orderId = res.id;
        sifUrl = "https://efhdq8fkb2.execute-api.ca-central-1.amazonaws.com/order/" + orderId + "/sif";
        window.location.assign(sifUrl);
      }
    })
  }
  const getPrice = async () => {
    let pricebook = {};
    let pricebookId = '';

    pricebookService(threekitConfigByUrl.orgId, threekitConfigByUrl.authToken).then(async (res) => {
      if (res) {
        res.pricebooks.forEach((item) => {
          if (item.name === threekitConfigByUrl.pricebookName) {
            pricebook = item;
          };
        });
      };
      pricebookId = pricebook?.id ? pricebook.id : '';
      await toolkit.player.getPrice(pricebookId, threekitConfigByUrl.currency).then(async (result) => {
        result !== undefined ? setPrice(new Intl.NumberFormat(threekitConfigByUrl.locale, { style: 'currency', currency: threekitConfigByUrl.currency, minimumFractionDigits: 2 }).format(result)) : setPrice(0);
      });
    });
  };

  useEffect(() => {
    if ((newConfig !== null && dropdownStatus === true)) {
      let keyConfig = newConfig ? Object.keys(newConfig)[0] : null;
      if (keyConfig) {
        let id = newConfig[keyConfig].assetId;

        getElementById(id)
      };
      setDropDownStatus(null);
      if (keyConfig) {
        setDropDownStatus(true);
      };
    };
  });

  const convert = (object) => {

    for (const [key, value] of Object.entries(object)) {
      let element = {};
      element.key = key;
      if (value.assetId === undefined) {
        element.assetId = value.value.assetId;
      } else {
        element.assetId = value.assetId;
      }
      jsonArray.push(element);
      if (value.configuration === undefined) {
        if (value.value.configuration !== undefined) {
          if (value.value.configuration !== "") {
            let valueNextLevel = value.value.configuration;
            convert(valueNextLevel);
          }
        }
      } else if (value.configuration !== "") {
        let valueNextLevel = value.configuration;
        convert(valueNextLevel);
      }
    }
  };

  const toObject = (arr) => {
    var rv = {};
    for (var i = 0; i < arr.length; ++i)
      rv[arr[i].key] = arr[i];
    return rv;
  }

  const carouselImageClick = (config) => {
    console.log('carousel click' + JSON.stringify(config))
    setNewConfig(config);
    setDropDownStatus(true);
  };


  const currentPlayerConfig = async () => {
    if (initialPlayerConfig === null || initialPlayerConfig === undefined) {
      console.log('Is undefined');
      let playerConfig = await getPlayerConfig();
      setInitialPlayerConfig(playerConfig);
    } else {
      if (hasInitialConfig === false) {
        if (initialPlayerConfig !== null) {
          //console.log('before conversion: ' + JSON.stringify(initialPlayerConfig))
          convert(initialPlayerConfig);
          let config = toObject(jsonArray);
          //console.log('before set: ' + JSON.stringify(config))
          setNewConfig(config);
          setHasInitialConfig(true);
          setDropDownStatus(true);
        }
      }
    }
  }

  currentPlayerConfig();

  const getElementById = (config) => {
    let element = document.getElementById(config);
    if (element) {
      element.click();
      let counter = 0;
      setRenderedItems({ [counter]: { assetId: config } });
      let keyConfig = Object.keys(newConfig)[0];
      let id = newConfig[keyConfig].assetId;
      if (renderedItems.length !== 0 && renderedItems[0].assetId) {
        let rendered = JSON.parse(JSON.stringify(renderedItems[counter]));
        if (rendered.assetId === id) {
          //console.log('before config: ' + JSON.stringify(newConfig));
          let index = newConfig[keyConfig].assetId;
          if (index !== -1) {
            let temp = delete newConfig[keyConfig]
            setNewConfig(newConfig);
          }
          //console.log('after config: ' + JSON.stringify(newConfig));
        }
        counter++;
      }
    } else {
      console.log('no element with this Id exists=>', config);
    };
  };



  var verticalOrientation = windowWidth <= 1366 ? false : true;

  getPrice();
  getDataTableRowsById();

  const newFormatOfAttributes = () => {
    let attributeWithValues = [];
    let sections = controller[0]?.sections[0]?.sections ? controller[0].sections[0].sections : [];
    let attributeSelected = window.attributeSelected;
    let attributeSelectedKey = attributeSelected ? Object.keys(attributeSelected)[0] : "";

    if (sections.length > 0) {
      sections.forEach((sectionItem) => {
        if (sectionItem && sectionItem.inputs.length > 0) {
          sectionItem.inputs.forEach((inputsItem) => {
            let values = [];
            if (inputsItem?.data?.options && inputsItem.data.options.length > 0) {
              inputsItem.data.options.forEach((valuesItem) => {
                values.push({
                  'assetId': valuesItem.assetId,
                  'code': valuesItem.code,
                  'label': valuesItem.label
                })
              });
            };
            attributeWithValues.push({
              'attribute': inputsItem.attribute,
              'values': values,
              'parent': inputsItem.parent
            })
          });
        };
      });
    };

    attributeWithValues.forEach((attributeWithValuesItem, attributeWithValuesIndex) => {
      if (attributeWithValuesItem.parent !== "" && attributeWithValuesItem.parent === attributeSelectedKey) {
        attributeWithValues.splice(attributeWithValuesIndex, 1);
      }
    });

    return attributeWithValues
  };

  const getOrderCodeString = () => {
    let arrayOrderCode = [];
    let newOrdeCodeArray = [];
    let allCodes = '';
    let attributeSelected = window.attributeSelected;
    let attributeSelectedKey = attributeSelected ? Object.keys(attributeSelected)[0] : "";
    let orderCode = catalogInfo?.metadata?.itemId ? catalogInfo.metadata.itemId : '';
    let arrayOfCompare = newFormatOfAttributes();
    arrayOfCompare.forEach((arrayOfCompareItem) => {
      arrayOrderCode.push({
        'attribute': arrayOfCompareItem.attribute,
        'code': attributeSelectedKey !== "" && arrayOfCompareItem.attribute === attributeSelectedKey ? arrayOfCompareItem.values.find(arrayOfCompare => arrayOfCompare.assetId === attributeSelected[attributeSelectedKey]).code : ""
      })
    });

    if (arrayOrderCode.length !== 0 && ordeCodeArray.length === 0) {
      setOrdeCodeArray(arrayOrderCode);
    };

    arrayOrderCode.forEach((arrayOrderCodeItem) => {
      ordeCodeArray.forEach((ordeCodeArrayItem) => {
        if (arrayOrderCodeItem.attribute === ordeCodeArrayItem.attribute) {
          if (arrayOrderCodeItem.code !== "") {
            newOrdeCodeArray.push(arrayOrderCodeItem);
          } else {
            newOrdeCodeArray.push(ordeCodeArrayItem);
          };
        } else {
          if (arrayOrderCode.length > ordeCodeArray.length) {
            if (ordeCodeArray.find(ordeCodeArray => ordeCodeArray.attribute === arrayOrderCodeItem.attribute) === undefined && newOrdeCodeArray.find(newOrdeCodeArray => newOrdeCodeArray.attribute === arrayOrderCodeItem.attribute) === undefined) {
              newOrdeCodeArray.push(arrayOrderCodeItem);
            };
          };
        };
      })
    });

    if (ordeCodeArray.length !== 0 && newOrdeCodeArray.length !== 0 && attributeSelected !== undefined && JSON.stringify(newOrdeCodeArray) !== JSON.stringify(ordeCodeArray)) {

      setOrdeCodeArray(newOrdeCodeArray);
    };
    ordeCodeArray.forEach((arrayOrderCodeItem) => {
      allCodes = allCodes + arrayOrderCodeItem.code;

    });

    return orderCode + allCodes.replace('~', '');
  };

  return (
    <div>
      
      <div id="loader-container">
        <div className="lds-ellipsis"></div>
      </div>
      <div id="mainContainer" className="container">
        <div>
      
         
        </div>
         <div >
        <Wrapper className={`player-container `}>
          <PlayerWrapper className='three-d-player-space'>
            <div id='foto'>
            <Player  />
            </div>
           
          


          </PlayerWrapper>

          
        </Wrapper>
        </div>
        
      </div>
      <footer>
     
      </footer>
    </div>
  );
};


export default AccordionTemplate2;
