import styled from 'styled-components';

export const Wrapper = styled.div`
width: 100%;
  & > div {
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    padding: 6%;
    cursor: pointer;
  }

  & > div span {
    font-size: 16px;
    color: #4A4B4A;
  }

  & > div.activeButton {
    background: #F69362;
  }

  & > div.activeButton span {
    color: white;
  }
`;