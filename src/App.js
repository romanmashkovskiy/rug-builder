import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import StartModal from './components/product-settings-modal/product-settings-modal';
import BuilderSelectPart from './components/builder-select-part/builder-select-part';
import Summary from './components/summary/summary';


class App extends Component {
    render() {
        return (
            <Router basename={'/rugbuilder'}>
                <Switch>
                    <Route exact path="/" component={StartModal}/>
                    <Route exact path="/builder/" component={BuilderSelectPart}/>
                    <Route exact path="/summary/" component={Summary}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
