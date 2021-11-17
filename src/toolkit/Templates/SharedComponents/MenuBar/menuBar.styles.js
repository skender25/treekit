import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const PrimaryBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  /* height: 70px; */
`;

export const PrimaryBarItem = styled.div`
  padding: 0px 12px;
  height: max-content;
  font-size: 18px;
  /* position: relative;
  top: 50%;
  transform: translateY(-50%); */
  text-transform: uppercase;
  color: ${props => (props.selected ? '#dbe200' : '#57585A')};

  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};

  & > div:nth-child(1) {
    padding-top: 15px;
    padding-bottom: 10px;
  }

  & > div:nth-child(2) {
    position: relative;
    left: 50%;
    transform: translate(-50%);
    height: 10px;
    width: 10px;

    visibility: ${props => (props.selected ? 'visible' : 'hidden')};

    border-left: 10px solid transparent;
    border-right: 10px solid transparent;

    border-bottom: 10px solid #dddddd;
  }
`;

export const SecondaryBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 40px;
  background: #dddddd;
  font-size: 16px;

  visibility: ${props => (props.show ? 'visible' : 'hidden')};
`;

export const SecondaryBarItem = styled.div`
  padding: 0px 12px;
  height: max-content;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-transform: uppercase;
  color: ${props => (props.selected ? '#dbe200' : '#333333')};

  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`;
