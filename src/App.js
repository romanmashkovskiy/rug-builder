import React, {Component} from 'react';
import './App.css';
import StartModal from './components/product-settings-modal/product-settings-modal';
import BuilderSelectPart from './components/builder-select-part/builder-select-part';

class App extends Component {
    render() {
        return (
            <BuilderSelectPart />
        );
    }
}

export default App;
