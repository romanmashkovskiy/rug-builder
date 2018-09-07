import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {
    setShowLoginMode,
    setShowLoginRegisterMode,
    loginUser,
    forgotPassword,
    saveRug
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
            orderFreeSwatchSamples: false
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
            <div className="container">
                <div className="cover-div"/>
                <div className="modal-login">
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
                    <img src={basket} className="button-basket-login" alt="basket"/>
                    <div className="free-swatch-samples-login" onClick={() => {
                        this.setState({orderFreeSwatchSamples: !this.state.orderFreeSwatchSamples})
                    }}>
                        Order Free Swatch Samples?
                    </div>
                    <button
                        className="login-button"
                        onClick={() => {
                            if (this.state.email !== '' && this.state.password !== '') {
                                this.props.loginUser(this.state.email, this.state.password).then((result) => {


                                    ls('curUser', result);
                                    this.props.history.replace('/summary');
                                    this.props.saveRug(
                                        this.props.border,

                                        this.props.centre.code,
                                        this.props.centre.name,
                                        this.props.centre.id,

                                        this.props.outerBorder.code,
                                        this.props.outerBorder.name,
                                        this.props.outerBorder.id,

                                        this.props.innerBorder.code,
                                        this.props.innerBorder.name,
                                        this.props.innerBorder.id,

                                        this.props.piping.code,
                                        this.props.piping.post_title,
                                        this.props.piping.ID,

                                        this.props.width,
                                        this.props.length
                                    );

                                }).catch(error => {
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
            setShowLoginRegisterMode: setShowLoginRegisterMode,
            setShowLoginMode: setShowLoginMode,
            loginUser: loginUser,
            forgotPassword: forgotPassword,
            saveRug: saveRug
        },
        dispatch)
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(LoginModal));