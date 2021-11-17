import React, { useState } from 'react';
import { Select } from 'antd';

const Dropdown = ({ options, value, onChange, languageData, dropdownStatus }) => {

  const [open, setOpen] = useState(false);
  let valueAssetId = typeof value === 'object' ? value?.assetId : value;
  if (!options || options.length === 0) return null;

  const handleVisibleChange = () => {
    if (dropdownStatus !== true) {
      setOpen(!open);
    }
  };

  return (
    <Select
      id={'selected'}
      value={valueAssetId}
      onChange={onChange}
      style={{ minWidth: '160px' }}
      open={dropdownStatus !== null ? dropdownStatus : open}
      onDropdownVisibleChange={handleVisibleChange}


    >
      {options.map(({ label, value: val, assetId }, i) => (
        <Select.Option key={i} value={val} id={assetId}>
          {languageData && Object.entries(languageData).length !== 0 && languageData[label] ? languageData[label] : label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default Dropdown;
