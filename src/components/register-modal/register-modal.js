import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {setShowRegisterMode, setShowLoginRegisterMode} from "../../actions";

import './register-modal.css';

import restart from './images/restart.svg'
import basket from './images/basket.png';

class RegisterModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            email: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            postcode: '',
            password: '',
            confirmPassword: ''
        };
        this.onChangeEmail = this.onChangeEmail.bind(this);
    }

    onChangeFullName(e) {
        const val = e.target.value;
        this.setState({fullName: val});
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
                        <div className="login-register-text">
                            Register
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
            setShowRegisterMode: setShowRegisterMode
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(RegisterModal);