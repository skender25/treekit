import styled from 'styled-components';

export const Wrapper = styled.div``;

export const ButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const ButtonWrapper = styled.div`
  width: max-content;
  margin: 8px auto;
  padding: 8px 12px;
  cursor: pointer;

  font-weight: ${props => (props.selected ? 600 : 400)};
  border: ${props => (props.selected ?  '2px solid #F69362;' : 'none;')};
  ${props => (props.selected ? `#F69362;` : 'rgba(0, 0, 0, 0)')};
  ${props => props.selected && '#F69362 0 0 5px;'}
  ${props => props.selected && `color: grey;`};

  transition: all 0.3s;

  & > div:nth-child(1) {
    ${props => (props.selected ? `height: 40px;` : `height: 42px;`)}
    ${props => (props.selected ? `height: 40px;` : `width: 42px;`)}
    border-radius: 2px;

    img {
      ${props => (props.selected ? `height: 40px;` : `height: 100%`)}
      ${props => (props.selected ? `width: 40px;` : `width: 100%;`)}
      ${props => (props.selected ? `transform: scale(1)` : ``)}
      object-fit: contain;
    }
  }

  & > div:nth-child(2) {
    width: 100px;
    text-align: center;
    padding-top: 8px;
    font-size: 13px;
  }
`;
