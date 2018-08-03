import React, {Component} from 'react';
import './builder-select-part.css';
import header from './images/header.png';
import footer from './images/footer.png';


class BuilderSelectPart extends Component {
    render() {
        return (
            <div className="container-builder">
                <div className="header-builder">
                    <img src={header}/>
                </div>
                <div className="main-builder">
                    <div className="main-builder-carpet">
                        <div className="main-carpet-preview">
                        </div>
                        <div className="main-carpet-controls">
                            <div className="rug-specification">
                                <div className="your-bespoke-rug-spe">
                                    YOUR BESPOKE RUG SPECIFICATION
                                </div>
                            </div>
                            <div className="current-carpet-size">
                            </div>
                            <div className="current-border-type">
                            </div>
                            <div className="centre-is-selected">
                            </div>
                            <div className="border-is-selected">
                            </div>
                            <div className="carpet-price">
                            </div>
                        </div>
                    </div>
                    <div className="main-area-builder">
                        <div className="main-area-builder-centre">
                        </div>
                        <div className="main-area-builder-inner-border">
                        </div>
                        <div className="main-area-builder-rest">
                        </div>
                    </div>
                </div>
                <div className="footer-builder">
                    <img src={footer}/>
                </div>

            </div>
        );
    }
}

export default BuilderSelectPart;