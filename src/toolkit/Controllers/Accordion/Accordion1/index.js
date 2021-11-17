import React, { useState } from 'react';
import { Wrapper } from './accordion1.styles';
//import { DownOutlined } from '@ant-design/icons';
import InputComponents from '../../../InputComponents';

const Accordion1 = ({ sections, configuration, handleSetAttribute, languageData, dropdownStatus, handleVisibleChange, open }) => {
  const [selectedSection, setSelectedSection] = useState(null);

  const handleClickSelect = idx => {
    setSelectedSection(selectedSection === idx ? null : idx);
  };

  const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item,
      };
    }, initialValue);
  };

  if (!sections || sections.length === 0) return null;
  
  return (
    <>
      {sections.map(
        (
          {
            label,
            selected,
            heading,
            description,
            component: Component,
            inputs,
          },
          i
        ) => (
          <div className='template-wrapper regular-wapper accordion1-container'>
            <div className='accordion1-component-box'>
              <div className='accordion1-component-container'>
                <div className='accordion1-heading'>{heading}</div>
                <div className='accordion1-description'>{description}</div>
                <div className='accordion1-section-container'>
                  {Component ? (
                    <Component />
                  ) : inputs && inputs.length > 0 ? (
                    inputs.map((input, index) => (
                      <InputComponents
                        index={index}
                        languageData={languageData}
                        {...input}
                        value={languageData && Object.entries(languageData).length !== 0 && languageData[configuration?.[input.attribute]] ? languageData[configuration?.[input.attribute]] : configuration?.[input.attribute]}
                        handleVisibleChange={handleVisibleChange}
                        open={open}
                        dropdownStatus={dropdownStatus}
                        onChange={val => {
                          const attrObject = convertArrayToObject(input.data.options, 'label');
                          handleSetAttribute(
                            Array.isArray(input.attribute)
                              ? input.attribute.reduce(
                                (output, attribute) =>
                                  Object.assign(output, { [attribute]: val, 'assetId': attrObject[val].assetId, 'parent': input.attribute, 'value': val, firstLevel: input.firsrLevel }),
                                {}
                              )
                              : { [input.attribute]: val, 'assetId': attrObject[val].assetId, 'parent': input.attribute, 'value': val, firstLevel: input.firsrLevel  }
                          )
                        }
                        }
                      />
                    ))
                  ) : null}
                </div>
              </div>
            </div>
          </div>

        )
      )}
    </>
  );
};

export default Accordion1;
