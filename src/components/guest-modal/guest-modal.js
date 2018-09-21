import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {
    setShowGuestMode,
    setShowLoginRegisterMode,
    setRugPositionGuest,
    orderSamples,
    setGuestUser,
    setSamplesOrderedSuccess
} from "../../actions";

import './guest-modal.css';


import restart from './images/restart.svg'
import basket from './images/basket.png';

class GuestModal extends Component {
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
            orderFreeSwatchSamples: false,
            isAgree: 0,
            isSubscribed: 0
        };
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeAddressLine1 = this.onChangeAddressLine1.bind(this);
        this.onChangeAddressLine2 = this.onChangeAddressLine2.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        this.onChangePostcode = this.onChangePostcode.bind(this);
        this.onChangeIsAgree = this.onChangeIsAgree.bind(this);
        this.onChangeIsSubscribed = this.onChangeIsSubscribed.bind(this);
        this.onFinish = this.onFinish.bind(this);
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

    onChangeIsAgree(e) {
        const val = e.target.checked;
        val ? this.setState({isAgree: 1}) : this.setState({isAgree: 0});
    }

    onChangeIsSubscribed(e) {
        const val = e.target.checked;
        val ? this.setState({isSubscribed: 1}) : this.setState({isSubscribed: 0});
    }

    async onFinish() {
        await this.props.setGuestUser(
            this.state.firstName,
            this.state.lastName,
            this.state.email,
            this.state.addressLine1,
            this.state.addressLine2,
            this.state.city,
            this.state.postcode
        );

        if (this.state.orderFreeSwatchSamples) {
            this.props.orderSamples(
                undefined,
                this.props.centre.id,
                this.state.firstName,
                this.state.lastName,
                this.state.email,
                this.state.addressLine1,
                this.state.addressLine2,
                undefined,
                this.state.city
            )
                .then(result => {
                    console.log(result);
                    this.props.setSamplesOrderedSuccess(true);
                    this.props.setRugPositionGuest(true);
                })
                .catch(error => {
                    console.log(error);
                })
            ;
        } else {
            this.props.setRugPositionGuest(true);
        }
    }

    render() {
        return (
            <div className="container container-A">
                <div className="cover-div"/>
                <div className="modal-guest modal-guest-A">
                    <img src={restart} className="button-back-register" alt="exit" onClick={() => {
                        this.props.setShowGuestMode(false);
                        this.props.setShowLoginRegisterMode(true);
                    }}/>
                    <div className="register-header-text">
                        Guest
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
                    </div>
                    {this.state.orderFreeSwatchSamples &&
                    <div className="free-swatch-samples-checkmark-guest"/>}
                    <img src={basket} className="button-basket-guest" alt="basket"/>
                    <div className="free-swatch-samples-register" onClick={() => {
                        this.setState({orderFreeSwatchSamples: !this.state.orderFreeSwatchSamples})
                    }}>
                        Order Free Swatch Samples?
                    </div>
                    <button className="register-button" onClick={this.onFinish}>
                        FINISH BUILDING
                    </button>
                    <div className="register-checkbox-wrapper">
                        <label className="register-checkbox-container">I agree to my personal data being stored and sent
                            to our selected retailer partners in order to process this order. View Privacy Policy Please
                            tick here to opt-in.
                            <input type="checkbox"/>
                            <span className="register-checkmark"></span>
                        </label>
                    </div>
                    <div className="register-checkbox-wrapper">
                        <label className="register-checkbox-container">I would like to receive marketing communication
                            including promotions, special offers, news and events from Crucial Trading View Privacy
                            Policy Please tick here to opt in.
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
    return {
        width: state.width,
        length: state.length,
        border: state.border,

        centre: state.centre,
        innerBorder: state.innerBorder,
        outerBorder: state.outerBorder,
        piping: state.piping,
        guestUser: state.guestUser
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowLoginRegisterMode: setShowLoginRegisterMode,
            setShowGuestMode: setShowGuestMode,
            setRugPositionGuest: setRugPositionGuest,
            orderSamples: orderSamples,
            setGuestUser: setGuestUser,
            setSamplesOrderedSuccess: setSamplesOrderedSuccess
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(GuestModal);
