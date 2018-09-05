import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {setShowRegisterMode, setShowLoginRegisterMode, registerUser } from "../../actions";

import './register-modal.css';

import restart from './images/restart.svg'
import basket from './images/basket.png';

import {withRouter} from 'react-router-dom';

var ls = require('local-storage');

class RegisterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            postcode: '',
            password: '',
            confirmPassword: '',
            orderFreeSwatchSamples: false
        };
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeAddressLine1 = this.onChangeAddressLine1.bind(this);
        this.onChangeAddressLine2 = this.onChangeAddressLine2.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        this.onChangePostcode = this.onChangePostcode.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    }

    onChangeFirstName(e) {
        const val = e.target.value;
        this.setState({firstName: val});
    }

    onChangeLastName(e) {
        const val = e.target.value;
        this.setState({lastName: val});
    }

    onChangeEmail(e) {
        const val = e.target.value;
        this.setState({email: val});
    }

    onChangeAddressLine1(e) {
        const val = e.target.value;
        this.setState({addressLine1: val});
    }

    onChangeAddressLine2(e) {
        const val = e.target.value;
        this.setState({addressLine2: val});
    }

    onChangeCity(e) {
        const val = e.target.value;
        this.setState({city: val});
    }

    onChangePostcode(e) {
        const val = e.target.value;
        this.setState({postcode: val});
    }

    onChangePassword(e) {
        const val = e.target.value;
        this.setState({password: val});
    }

    onChangeConfirmPassword(e) {
        const val = e.target.value;
        this.setState({confirmPassword: val});
    }


    render() {
        return (
            <div className="container">
                <div className="cover-div"/>
                <div className="modal-register">
                    <img src={restart} className="button-back-register" alt="exit" onClick={() => {
                        this.props.setShowRegisterMode(false);
                        this.props.setShowLoginRegisterMode(true);
                    }}/>
                    <div className="register-header-text">
                        Register
                    </div>
                    <div className="input-register-block">
                        <input
                            type="text"
                            value={this.state.firstName}
                            placeholder="First Name"
                            className="input-register"
                            onChange={this.onChangeFirstName}
                        />
                        <input
                            type="text"
                            value={this.state.lastName}
                            placeholder="Last Name"
                            className="input-register"
                            onChange={this.onChangeLastName}
                        />
                    </div>
                    <div className="input-register-block">
                        <input
                            type="text"
                            value={this.state.email}
                            placeholder="Email Address"
                            className="input-register"
                            onChange={this.onChangeEmail}
                        />
                        <input
                            type="text"
                            value={this.state.addressLine1}
                            placeholder="Address Line 1"
                            className="input-register"
                            onChange={this.onChangeAddressLine1}
                        />
                    </div>
                    <div className="input-register-block">
                        <input
                            type="text"
                            value={this.state.addressLine2}
                            placeholder="Address Line 2"
                            className="input-register"
                            onChange={this.onChangeAddressLine2}
                        />
                        <input
                            type="text"
                            value={this.state.city}
                            placeholder="Town/City"
                            className="input-register"
                            onChange={this.onChangeCity}
                        />
                    </div>
                    <div className="input-register-block">
                        <input
                            type="text"
                            value={this.state.postcode}
                            placeholder="Postcode"
                            className="input-register"
                            onChange={this.onChangePostcode}
                        />
                        <input
                            type="password"
                            value={this.state.password}
                            placeholder="Password"
                            className="input-register"
                            onChange={this.onChangePassword}
                        />
                    </div>
                    <div className="input-register-block">
                        <input
                            type="password"
                            value={this.state.confirmPassword}
                            placeholder="Confirm Password"
                            className="input-register"
                            onChange={this.onChangeConfirmPassword}
                        />
                    </div>
                    {this.state.orderFreeSwatchSamples &&
                    <div className="free-swatch-samples-checkmark-register"/>}
                    <img src={basket} className="button-basket-register" alt="basket"/>
                    <div className="free-swatch-samples-register" onClick={() => {
                        this.setState({orderFreeSwatchSamples: !this.state.orderFreeSwatchSamples})
                    }}>
                        Order Free Swatch Samples?
                    </div>
                    <button
                        className="register-button"
                        onClick={() => {
                            if (this.state.password === this.state.confirmPassword) {
                                this.props.registerUser(
                                    this.state.email,
                                    this.state.password,
                                    this.state.firstName,
                                    this.state.lastName,
                                    this.state.addressLine1,
                                    this.state.addressLine2,
                                    this.state.postcode,
                                    this.state.city
                                ).
                                then((result) => {
                                    if (result) {
                                        this.props.history.replace('/summary');
                                    }
                                })
                            }
                        }}
                    >
                        REGISTER
                    </button>
                    <div className="register-checkbox-wrapper">
                        <label className="register-checkbox-container">I agree my personal data being stored and sent
                            to our selected retailer partners in order to process this order. View Privacy Policy.
                            Please tick here to opt-in.
                            <input type="checkbox"/>
                            <span className="register-checkmark"></span>
                        </label>
                    </div>
                    <div className="register-checkbox-wrapper">
                        <label className="register-checkbox-container">I would like to receive marketing communication
                            including promotions, special offers, news and events from Crucial Trading View Privacy
                            Policy
                            Please tick here to opt in.
                            <input type="checkbox"/>
                            <span className="register-checkmark"></span>
                        </label>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {};
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowLoginRegisterMode: setShowLoginRegisterMode,
            setShowRegisterMode: setShowRegisterMode,
            registerUser: registerUser,

        },
        dispatch)
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(RegisterModal));