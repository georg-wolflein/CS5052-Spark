import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Results from './results.js';
import Visualisations from './visualisations.js';

/**
 * This component renders either the results, or visualisatigons component depending on the path.
 */
class Main extends React.Component {
    render() {
        return (
            <Switch>
                <Route exact path='/' component={Results}></Route>
                <Route exact path='/visualisations' component={Visualisations}></Route>
            </Switch>
        );
    }
}

export default Main;