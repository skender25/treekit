import React from 'react';
import { storiesOf } from '@storybook/react';
import TextInput from './index';

const data = {
  placeholder: 'Enter text',
  value: 'Hello mars',
};

storiesOf('Input Components | TextInput', module).add('default', () => (
  <TextInput {...data} />
));
