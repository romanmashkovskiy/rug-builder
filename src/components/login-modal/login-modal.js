import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {
    setRugPosition,
    setShowLoginMode,
    setShowLoginRegisterMode,
    loginUser,
    forgotPassword,
    saveRug,
    orderSamples,
    setSamplesOrderedSuccess
} from "../../actions";

import './login-modal.css';

import restart from './images/restart.svg';
import basket from './images/basket.png';

import {withRouter} from 'react-router-dom';

const ls = require('local-storage');

class LoginModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            orderFreeSwatchSamples: false,
            loginError: false
        };
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    onChangeEmail(e) {
        const val = e.target.value;
        this.setState({email: val});
    }

    onChangePassword(e) {
        const val = e.target.value;
        this.setState({password: val});
    }

    render() {
        return (
            <div className="container-login-register container-A">
                <div className="cover-div"/>
                <div className="modal-login modal-login-A">
                    <img src={restart} className="button-back-login" alt="exit" onClick={() => {
                        this.props.setShowLoginMode(false);
                        this.props.setShowLoginRegisterMode(true);
                    }}/>
                    <div className="login-header-text">
                        Login
                    </div>
                    <input
                        type="text"
                        value={this.state.email}
                        placeholder="Email"
                        className="input-login"
                        onChange={this.onChangeEmail}
                    />
                    <input
                        type="password"
                        value={this.state.password}
                        placeholder="Password"
                        className="input-login"
                        onChange={this.onChangePassword}
                    />
                    {this.state.orderFreeSwatchSamples &&
                    <div className="free-swatch-samples-checkmark-login"/>}
                    <img src={basket} className="button-basket-login button-basket-login-A" alt="basket"/>
                    <div className="free-swatch-samples-login" onClick={() => {
                        this.setState({orderFreeSwatchSamples: !this.state.orderFreeSwatchSamples})
                    }}>
                        Order Free Swatch Samples?
                    </div>
                    {this.state.loginError &&
                        <div className="login-error-message">
                            Sorry your email or password was incorrect.
                            Please try again or click forgotten password
                        </div>

                    }
                    <button
                        className="login-button login-button-A5"
                        onClick={() => {
                            if (this.state.email !== '' && this.state.password !== '') {
                                this.props.loginUser(
                                    this.state.email,
                                    this.state.password
                                )
                                    .then((result) => {
                                        ls('curUser', result);
                                        this.setState({loginError: false});
                                        if (this.state.orderFreeSwatchSamples) {
                                            return this.props.orderSamples(
                                                ls('curUser').user_id,
                                                this.props.centre.id
                                            )
                                        } else {
                                            this.props.setRugPosition(true);
                                        }
                                    })
                                    .then(result => {
                                        if (result) {
                                            console.log(result);
                                            this.props.setSamplesOrderedSuccess(true);
                                            this.props.setRugPosition(true);
                                        }
                                    })
                                    .catch(error => {
                                        this.setState({loginError: true});
                                        console.log(error);
                                    })
                            }
                        }}
                    >
                        LOGIN
                    </button>
                    <div className="forgotten-password"
                         onClick={() => {
                             this.props.forgotPassword(this.state.email);
                         }}
                    >
                        Forgotten your password?
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
        piping: state.piping
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setRugPosition: setRugPosition,
            setShowLoginRegisterMode: setShowLoginRegisterMode,
            setShowLoginMode: setShowLoginMode,
            loginUser: loginUser,
            forgotPassword: forgotPassword,
            saveRug: saveRug,
            orderSamples: orderSamples,
            setSamplesOrderedSuccess: setSamplesOrderedSuccess
        },
        dispatch)
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(LoginModal));