import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './app_container.js';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
        <AppContainer />
    </React.StrictMode>,
    document.getElementById('root')
);
