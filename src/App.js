import React from 'react';
import { Templates } from './toolkit';
import templateData from './config/template';
import threekitConfig from './config/threekitConfig';

function App() {
  return (
    <Templates
      template={templateData}
      threekitConfig={threekitConfig}
    />
  );
}

export default App;
