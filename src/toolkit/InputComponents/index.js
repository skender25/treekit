import React from 'react';

import {
  Wrapper,
  Label,
  Description,
  InputWrapper,
} from './inputComponents.styles';

import { ColorSelector1, ColorSelector2 } from './ColorSelectors';
import {
  RadioButtons1,
  RadioButtonsList1,
  RadioButtonsList2,
} from './RadioButtons';
import NumberInput from './NumberInput';
import TextInput from './TextInput';
import RadioButtonsExpandable from './RadioButtonsExpandable';
import RadioButtonsImages from './RadioButtonsImages';
import Dropdown from './Dropdown';
import Slider from './Slider';
import PriceQuantityInput from './PriceQuantityInput';
//import Switch from '@material-ui/core/Switch';
export {
  ColorSelector1,
  ColorSelector2,
  RadioButtons1,
  RadioButtonsImages,
  RadioButtonsList1,
  RadioButtonsList2,
  NumberInput,
  RadioButtonsExpandable,
  Dropdown,
  Slider,
  PriceQuantityInput,
  
};

const DefaultInputContainer = ({ label, description, children, index, languageData }) => {
  
  return (
    <Wrapper className={`input-component ${label.split(' ').join('-').toLowerCase()}`}>
      {label && index === 0 && <Label className="input-label">{languageData && Object.entries(languageData).length !== 0 && languageData[label] ? languageData[label] : label}</Label>}
      {description && (
        <Description className="input-description">{description}</Description>
      )}
      <InputWrapper id={'test2'} className="input-wrapper">{children}</InputWrapper>
    </Wrapper>
  );
};

export default ({
  label,
  description,
  type,
  data,
  value,
  index,
  onChange,
  cssClass,
  languageData,
  handleVisibleChange,
  open,
  dropdownStatus
}) => {
  switch (type) {
    case 'toggle':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
         
        </DefaultInputContainer>
      );
    case 'color':
    case 'color-1':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <ColorSelector1
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'color-2':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <ColorSelector2
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'dropdown':
    case 'dropdown-1':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <Dropdown
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
            open={open}
            handleVisibleChange={handleVisibleChange}
            dropdownStatus={dropdownStatus}
          />
        </DefaultInputContainer>
      );
    case 'radioButtonsList':
    case 'radioButtonsList-1':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <RadioButtonsList1
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'radioButtonsList-2':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <RadioButtonsList2
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'radioButtons':
    case 'radioButtons-1':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <RadioButtons1
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'RadioButtonsExpandable':
    case 'RadioButtonsExpandable-1':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <RadioButtonsExpandable
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'RadioButtonsImages':
    case 'RadioButtonsImages-1':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <RadioButtonsImages
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'slider':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <Slider
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'numberInput':
    case 'numberInput-1':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <NumberInput
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'textInput':
    case 'textInput-1':
      return (
        <DefaultInputContainer languageData={languageData} index={index} label={label} description={description}>
          <TextInput
            languageData={languageData}
            cssClass={cssClass}
            {...data}
            value={value}
            onChange={onChange}
          />
        </DefaultInputContainer>
      );
    case 'priceQuantity-1':
    case 'priceQuantity':
      return <PriceQuantityInput index={index}  {...data} value={value} onChange={onChange} />;
    default:
      return null;
  }
};
