import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import { setShowLoginRegisterMode, setShowLoginMode, setShowRegisterMode, setShowGuestMode } from '../../actions';

import './login-register-modal.css';
import './mobileLoginRegister.css';

class LoginRegisterModal extends Component {

    render() {
        return (
            <div className="container">
                <div className="cover-div cover-div__log-reg-mobile"/>
                <div className="modal-login-register login-register__mobile">
                    <div className="login-register login-register__mobile-content">
                        <div className="login-register-start login-register-start__mobile">
                            <div className="login-register-header login-register-header__mobile">
                                Register
                            </div>
                            <div className="login-register-text login-register-text__mobile">
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
                        <div className="login-register-start login-register-start__mobile">
                            <div className="login-register-header login-register-header__mobile">
                                Login
                            </div>
                            <div className="login-register-text login-register-text__mobile">
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
                    <div className="continue-as-guest continue-as-guest__mobile">
                        <div className="continue-as-guest-text" onClick={() => {
                            this.props.setShowLoginRegisterMode(false);
                            this.props.setShowGuestMode(true);
                        }}>
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
            setShowRegisterMode: setShowRegisterMode,
            setShowGuestMode: setShowGuestMode
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(LoginRegisterModal);
