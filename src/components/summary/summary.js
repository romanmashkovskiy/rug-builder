import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {
    orderSamples,
    setSamplesOrderedSuccess
} from "../../actions";

import './summary.css';
import './mobileSummary.css';

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

const ls = require('local-storage');


class Summary extends Component {
    constructor(props) {
        super(props);
        this.onOrderSwatches = this.onOrderSwatches.bind(this);
    }

    onOrderSwatches() {
        if (ls('curUser')) {
            this.props.orderSamples(
                ls('curUser').user_id,
                this.props.centre.id
            )
                .then(result => {
                    console.log(result);
                    this.props.setSamplesOrderedSuccess(true);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            this.props.orderSamples(
                undefined,
                this.props.centre.id,
                this.props.guestUser.firstName,
                this.props.guestUser.lastName,
                this.props.guestUser.email,
                this.props.guestUser.addressLine1,
                this.props.guestUser.addressLine2,
                undefined,
                this.props.guestUser.city
            )
                .then(result => {
                    console.log(result);
                    this.props.setSamplesOrderedSuccess(true);
                })
                .catch(error => {
                    console.log(error);
                });
        }

    }

    render() {
        return (
            <div className="container-builder-summary">
                <div className="header-builder">
                    <img src={header} alt="header"/>
                </div>
                <div className="summary-block-container summary-block-container__mobile">
                    <div className="summary-block-item summary-block-item__mobile-data_model">
                        <RugSummary/>
                    </div>
                    <div className="summary-block-item summary-block-item__mobile-data">
                        <div className="logo-summary">
                            <img src={logo} alt="logo"/>
                        </div>
                        <div className="summary-title summary-title__mobile">
                            Your rug design has been sent to a local retailer
                        </div>
                        <div className="summary-specification summary-specification__mobile">
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

                        <div className="summary-price-social summary-price__mobile-view">
                            <div className="summary-price summary-price__mobile">
                                Price:
                            </div>
                            <div className="summary-price-data summary-price-data__mobile">
                                &#163; {this.props.rugPrice}
                            </div>
                        </div>

                        <div className="summary-price-social mobile-hide-block">
                            <div className="summary-price">
                                Price:
                            </div>
                            <div className="summary-share-creation">
                                Share your creation:
                            </div>
                        </div>
                        <div className="summary-price-social-data mobile-hide-block">
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
                        <div className="summary-button-block summary-button-block__mobile">
                            {
                                !this.props.samplesOrderedSuccess &&
                                <button className="summary-button-order-swatches"
                                        onClick={this.onOrderSwatches}>
                                    ORDER SWATCHES
                                </button>
                            }
                            <button className="summary-button-print-details">
                                PRINT DETAILS
                            </button>
                        </div>
                        <div className="summary-price-social summary-price-social__mobile-view">
                            <div className="summary-share-creation summary-share-creation__mobile">
                                Share your creation:
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
                    </div>
                </div>

                <div className="summary-block-container summary-block-container__mobile">
                    <div className="summary-block-item">
                        <img src={appStore} alt="appStore"/>
                    </div>
                    <div className="summary-block-item">
                        <img src={room} alt="room"/>
                    </div>
                </div>
                <div className="summary-block-container summary-block-container__mobile">
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

        guestUser: state.guestUser,
        samplesOrderedSuccess: state.samplesOrderedSuccess
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            orderSamples: orderSamples,
            setSamplesOrderedSuccess: setSamplesOrderedSuccess
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Summary);
