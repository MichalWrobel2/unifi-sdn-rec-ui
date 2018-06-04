import { render } from 'react-dom';
import React from 'react';
import AppContainer from './components/AppContainer/AppContainer.js';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
render(<AppContainer/>, document.getElementById('root'));

