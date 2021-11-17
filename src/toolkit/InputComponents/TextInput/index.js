import React from 'react';
import { Wrapper } from './textInput.styles';
import { Input } from 'antd';

const TextInput = ({ placeholder, value, onChange }) => {
  return (
    <Wrapper>
      <div>
        <Input
          placeholder={placeholder}
          defaultValue={value}
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
        />
      </div>
    </Wrapper>
  );
};

export default TextInput;
