import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {setShowLoginMode, setShowLoginRegisterMode} from "../../actions";

import './login-modal.css';

import restart from './images/restart.svg'
import basket from './images/basket.png';

class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};
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
                        type="text"
                        value={this.state.password}
                        placeholder="Password"
                        className="input-login"
                        onChange={this.onChangePassword}
                    />
                    <img src={basket} className="button-basket" alt="exit"/>
                    <div className="free-swatch-samples">
                        Order Free Swatch Samples?
                    </div>
                    <button className="login-button">
                        LOGIN
                    </button>
                    <div className="forgotten-password">
                        Forgotten your password?
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
            setShowLoginMode: setShowLoginMode
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(LoginModal);