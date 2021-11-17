import React from 'react';
import { Wrapper } from './numberInput.styles';
import { InputNumber } from 'antd';

const NumberInput = ({
  label,
  value,
  price,
  showTotal,
  min,
  max,
  onChange,
}) => {
  return (
    <Wrapper>
      <div>{label}</div>
      <div>{price && `$${price}${showTotal ? ` x ` : ''}`}</div>
      <div>
        <InputNumber
          defaultValue={value}
          value={value}
          onChange={onChange}
        />
      </div>
      <div>${value}</div>
    </Wrapper>
  );
};

export default NumberInput;
