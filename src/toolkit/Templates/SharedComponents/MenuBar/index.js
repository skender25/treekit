import React from 'react';
import player from './../../../toolkit/player';
import {
  Wrapper,
  PrimaryBar,
  PrimaryBarItem,
  SecondaryBar,
  SecondaryBarItem,
} from './menuBar.styles';

const MenuBar = ({
  primaryOptions,
  primarySelected,
  secondaryOptions,
  secondarySelected,
  handleClickPrimary,
  handleClickSecondary,
  handleSetAttribute
}) => {
  if (!primaryOptions || !primaryOptions.length) return null;
  if (localStorage.getItem('clickOnPrimary') === 'true') {
    localStorage.setItem('menuSelected', secondaryOptions[0].toLowerCase().split(' ').join('-') + "-" + primarySelected);
  }

  return (
    <Wrapper>
      <PrimaryBar className='primary-bar-wrapper'>
        {primaryOptions.map((label, i) => (
          <PrimaryBarItem
            id={label.toLowerCase().split(" ")[0] + '-menu-option'}
            className={`primary-bar-item item-` + label}
            key={i}
            onClick={e => {
              localStorage.setItem('isClickEvent', 'false');
              localStorage.setItem('clickOnPrimary', 'true');
              handleClickPrimary(i);
              handleSetAttribute({ 'GEAR_VISIBILITY' :  label })
              e.stopPropagation();
            }}
            selected={primarySelected === i}
          >
            <div className="primary-bar-label">{label}</div>
            <div />
          </PrimaryBarItem>
        ))}
      </PrimaryBar>
      <SecondaryBar className='secondary-bar-wrapper' show={secondaryOptions && secondaryOptions.length}>
        {secondaryOptions.map((label, i) => (
          <SecondaryBarItem
            id={label.toLowerCase().split(' ').join('-') + "-" + primarySelected}
            className='secondary-bar-item'
            key={i}
            onClick={e => {
              e.stopPropagation();
              handleClickSecondary(i);
              localStorage.setItem('clickOnPrimary', 'false');
              localStorage.setItem('menuSelected', label.toLowerCase().split(' ').join('-') + "-" + primarySelected);
            }}
            selected={secondarySelected === i}
          >
            {label}
          </SecondaryBarItem>
          
        ))}
      </SecondaryBar>
    </Wrapper>
  );
};

export default MenuBar;
