import React from 'react';
import { validate as isUuid } from 'uuid';
import { Wrapper, ButtonWrapper } from './radioButtons1.styles';

const RadioButtons1 = ({ options, value, onChange, disabled, cssClass }) => {
  if (!options || options.length === 0) return null;

  return (
    <Wrapper className="inputs-container">
      {options.map(({ selected, label, value: val }, i) => (
        <ButtonWrapper
          key={i}
          onClick={() => onChange(val)}
          selected={(!value || value === '') && i === 0? true : isUuid(val) ? val === value?.assetId : val === value}
          disabled={!!disabled}
          id={`${label.split(' ').join('-').toLowerCase()}`}
        >
          {label}
        </ButtonWrapper>
      ))}
    </Wrapper>
  );
};

export default RadioButtons1;
