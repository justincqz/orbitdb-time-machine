import React from 'react';
import ReactDOM from 'react-dom';
import LocalDBForm from './LocalDBForm';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<LocalDBForm />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  