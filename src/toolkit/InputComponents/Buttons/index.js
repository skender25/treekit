import React from 'react';
import { Wrapper } from './buttons.style';

const Button = ({ link, labelText, activeButton }) => {
  return (
    <Wrapper>
        <div className={activeButton} onClick={link}>
            <span>{labelText}</span>
        </div>
    </Wrapper>
  );
};

export default Button;