import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import { setShowLoginRegisterMode, setShowLoginMode, setShowRegisterMode } from '../../actions';

import './login-register-modal.css';

class LoginRegisterModal extends Component {

    render() {
        return (
            <div className="container">
                <div className="cover-div"/>
                <div className="modal-login-register">
                    <div className="login-register">
                        <div className="login-register-start">
                            <div className="login-register-header">
                                Register
                            </div>
                            <div className="login-register-text">
                                Don't have an account yet? Register for an
                                account now to access features such as our
                                ARR App Experience
                            </div>
                            <button className="login-register-button" onClick={() => {
                                this.props.setShowLoginRegisterMode(false);
                                this.props.setShowRegisterMode(true);
                            }}>
                                REGISTER
                            </button>
                        </div>
                        <div className="login-register-start">
                            <div className="login-register-header">
                                Login
                            </div>
                            <div className="login-register-text">
                                Please log in to your Crucial Trading Accout
                                to access this feature and save your created
                                rug design
                            </div>
                            <button className="login-register-button" onClick={() => {
                                this.props.setShowLoginRegisterMode(false);
                                this.props.setShowLoginMode(true);
                            }}>
                                LOGIN
                            </button>
                        </div>
                    </div>
                    <div className="continue-as-guest">
                        <div className="continue-as-guest-text">
                            Continue as a Guest
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        showLoginRegisterModal: state.showLoginRegisterModal
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowLoginRegisterMode: setShowLoginRegisterMode,
            setShowLoginMode: setShowLoginMode,
            setShowRegisterMode: setShowRegisterMode
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(LoginRegisterModal);