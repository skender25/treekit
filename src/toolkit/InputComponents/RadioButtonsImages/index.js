import React, { useState } from 'react';
import {
  Wrapper,
  ButtonsRow,
  ButtonWrapper,
} from './radioButtonsImages.styles';
import icnImgMissing from '../assets/no-image.webp';
import ReactTooltip from 'react-tooltip';

const RadioButtonsImages = ({ options, onChange }) => {
  const [select, setSelect] = useState(null);

  if (!options || options.length === 0) return null;

  const handleSelectChange = (assetId, assetName) => {
    const isExclusion = ['Pants', 'Jacket', 'Athletix'].includes(assetName);

    const storageItem = isExclusion ? { key: 'gearSelected', item: assetName } : { key: 'isClickEvent', item: true };

    localStorage.setItem(storageItem.key, storageItem.item);

    onChange(assetName);

    setSelect(assetId);
  };

  return (
    <Wrapper>
      <ButtonsRow className="button-row">
        {
          options.map(({label, image, value: assetName, assetId}, index) => {
            return (
              <ButtonWrapper
                id={assetId}
                key={index}
                selected={select === assetId}
                onClick={_ => handleSelectChange(assetId, assetName)}
                data-tip={label}
                className='button-wrapper'>
                <div>
                  <img className={image ? '' : 'hide-img'} src={image || icnImgMissing} alt={label}></img>
                </div>
              </ButtonWrapper>
            );
          })
        }
      </ButtonsRow>
      <ReactTooltip
        place="top"
        type="dark"
        effect="solid"
        className='custome-theme'
      />
    </Wrapper>
  );
};

export default RadioButtonsImages;
