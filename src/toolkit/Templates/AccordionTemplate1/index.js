import React, { useState } from 'react';
import { Accordion1 as Accordion } from '../../Controllers';
import Player from '../SharedComponents/Player';
import MenuBar from '../SharedComponents/MenuBar';
import {
  Wrapper,
  PlayerWrapper,
  Title,
  Subtitle,
} from './accordionTemplate1.styles';

const AccordianTemplate1 = ({
  title,
  subtitle,
  controller,
  configuration,
  handleSetAttribute,
}) => {
  const [activeAddress, setActiveAddress] = useState([0, 0]);

  let secondaryOptions;

  if (controller?.[activeAddress[0]]?.sections) {
    secondaryOptions = controller[activeAddress[0]].sections.map(
      ({ label }) => label
    );
  }

  return (
    <div>
      <MenuBar
        primaryOptions={controller.map(({ label }) => label)}
        primarySelected={activeAddress[0]}
        secondaryOptions={secondaryOptions}
        secondarySelected={activeAddress[1]}
        handleClickPrimary={val => setActiveAddress([val, 0])}
        handleClickSecondary={val => setActiveAddress([activeAddress[0], val])}
        handleSetAttribute={handleSetAttribute}
      />
      <Wrapper className="wrapper-class">
        <PlayerWrapper>
          <Player />
        </PlayerWrapper>
        <div>
          {controller?.[activeAddress[0]] && (
            <Title className="template-title">
              {controller[activeAddress[0]].label}
            </Title>
          )}
          {controller?.[activeAddress[0]]?.sections?.[activeAddress[1]] && (
            <Subtitle className="template-subtitle">
              {controller[activeAddress[0]]?.sections?.[activeAddress[1]].label}
            </Subtitle>
          )}
          <Accordion
            sections={
              controller[activeAddress[0]]?.sections?.[activeAddress[1]]
                ?.sections
            }
            configuration={configuration}
            handleSetAttribute={handleSetAttribute}
          />
        </div>
      </Wrapper>
    </div>
  );
};

export default AccordianTemplate1; 
