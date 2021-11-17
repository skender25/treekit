import React, { ReactNode } from 'react';
import { Tooltip } from 'antd';
//import { InfoCircleOutlined } from '@ant-design/icons';

const Infotip = ({ title }) => {
  return (
    <Tooltip placement={'top'} title={title}>
     
    </Tooltip>
  );
};

export default Infotip;
