import React from 'react';
import ReactDOM from 'react-dom';


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import 'semantic-ui-css/semantic.min.css';
import '../../css/app.css';
import App from './app';

const Page=()=>
<Router>
<App/>
</Router>

if (document.getElementById('app')) {
    ReactDOM.render(<Page />, document.getElementById('app'));
}
