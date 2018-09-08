import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import './summary.css';

import header from './images/header.png';
import footer from './images/footer.png';
import appStore from './images/App Store.png';
import room from './images/room.png';
import map from './images/map.png';
import findRetailer from './images/find-retailer.png';
import logo from './images/logo.png';

import twitter from './images/twitter-logo-silhouette.svg';
import facebook from './images/facebook.svg';
import pinterest from './images/pinterest-logo.svg';
import chain from './images/link-symbol.svg';
import mail from './images/envelope.svg';

import RugSummary from '../rug/rug-summary';


class Summary extends Component {


    render() {
        return (
            <div className="container-builder">
                <div className="header-builder">
                    <img src={header} alt="header"/>
                </div>
                <div className="summary-block-container">
                    <div className="summary-block-item">
                        <RugSummary/>
                    </div>
                    <div className="summary-block-item">
                        <div className="logo-summary">
                            <img src={logo} alt="logo"/>
                        </div>
                        <div className="summary-title">
                            Your rug design has been sent to a local retailer
                        </div>
                        <div className="summary-specification">
                            <div className="summary-specification-rug-size">
                                <div className="summary-specification-rug-size-title">
                                    RUG SIZE:
                                </div>
                                <div className="summary-specification-rug-size-dimensions">
                                    {this.props.length}m X {this.props.width}m
                                </div>
                            </div>
                            <div className="summary-specification-rug-data">
                                <div className="summary-specification-rug-data-title">
                                    BORDER TYPE:
                                </div>
                                <div className="summary-specification-rug-data-parameters">
                                    {this.props.border}
                                </div>
                            </div>
                            <div className="summary-specification-rug-data">
                                <div className="summary-specification-rug-data-title">
                                    CENTRE:
                                </div>
                                <div className="summary-specification-rug-data-parameters-block">
                                    <img src={this.props.centre.picture} alt="img"/>
                                    <div className="summary-specification-rug-data-parameters">
                                        {this.props.centre.name} {this.props.centre.code}
                                    </div>
                                </div>

                            </div>
                            <div className="summary-specification-rug-data">
                                <div className="summary-specification-rug-data-title">
                                    OUTER BORDER:
                                </div>
                                <div className="summary-specification-rug-data-parameters-block">
                                    <img src={this.props.outerBorder.picture} alt="img"/>
                                    <div className="summary-specification-rug-data-parameters">
                                        {this.props.outerBorder.name} {this.props.outerBorder.code}
                                    </div>
                                </div>
                            </div>
                            {
                                this.props.border === 'DOUBLE-BORDER' &&
                                <div className="summary-specification-rug-data">
                                    <div className="summary-specification-rug-data-title">
                                        INNER BORDER:
                                    </div>
                                    <div className="summary-specification-rug-data-parameters-block">
                                        <img src={this.props.innerBorder.picture} alt="img"/>
                                        <div className="summary-specification-rug-data-parameters">
                                            {this.props.innerBorder.name} {this.props.innerBorder.code}
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                this.props.border === 'BORDER-PIPING' &&
                                <div className="summary-specification-rug-data">
                                    <div className="summary-specification-rug-data-title">
                                        PIPING:
                                    </div>
                                    <div className="summary-specification-rug-data-parameters-block">
                                        <img src={this.props.piping.picture} alt="img"/>
                                        <div className="summary-specification-rug-data-parameters">
                                            {this.props.piping.post_title} {this.props.piping.code}
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                this.props.border === 'SINGLE-BORDER' &&
                                <div className="summary-specification-rug-data">
                                </div>
                            }

                        </div>
                        <div className="summary-price-social">
                            <div className="summary-price">
                                Price:
                            </div>
                            <div className="summary-share-creation">
                                Share your creation:
                            </div>
                        </div>
                        <div className="summary-price-social-data">
                            <div className="summary-price-data">
                                &#163; {this.props.rugPrice}
                            </div>
                            <div className="summary-share-creation-links">
                                <div className="social-link">
                                    <img src={twitter} alt="twitter"/>
                                </div>
                                <div className="social-link">
                                    <img src={facebook} alt="facebook"/>
                                </div>
                                <div className="social-link">
                                    <img src={pinterest} alt="pinterest"/>
                                </div>
                                <div className="social-link">
                                    <img src={chain} alt="chain"/>
                                </div>
                                <div className="social-link">
                                    <img src={mail} alt="mail"/>
                                </div>
                            </div>
                        </div>
                        <div className="summary-button-block">
                            <button className="summary-button-order-swatches">
                                ORDER SWATCHES
                            </button>
                            <button className="summary-button-print-details">
                                PRINT DETAILS
                            </button>
                        </div>
                    </div>
                </div>

                <div className="summary-block-container">
                    <div className="summary-block-item">
                        <img src={appStore} alt="appStore"/>
                    </div>
                    <div className="summary-block-item">
                        <img src={room} alt="room"/>
                    </div>
                </div>
                <div className="summary-block-container">
                    <div className="summary-block-item">
                        <img src={map} alt="map"/>
                    </div>
                    <div className="summary-block-item">
                        <img src={findRetailer} alt="findRetailer"/>
                    </div>
                </div>
                <div className="footer-builder">
                    <img src={footer} alt="footer"/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        width: state.width,
        length: state.length,
        border: state.border,

        centre: state.centre,
        innerBorder: state.innerBorder,
        outerBorder: state.outerBorder,
        piping: state.piping,

        rugPrice: state.rugPrice,
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({},
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Summary);