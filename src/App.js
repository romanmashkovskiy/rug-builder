import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import StartModal from './components/product-settings-modal/product-settings-modal';
import BuilderSelectPart from './components/builder-select-part/builder-select-part';
import Summary from './components/summary/summary';


class App extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={StartModal}/>
                    <Route path="/builder" component={BuilderSelectPart}/>
                    <Route path="/summary" component={Summary}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
