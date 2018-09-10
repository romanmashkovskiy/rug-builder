import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {setLength, setWidth, setBorderType, setEditDimensionsMode, setEditBorderMode } from "../../actions";
import LinkButton from '../link-elements/link-button';
import LinkImg from '../link-elements/link-img';
import './product-settings-modal.css';

import logo from './images/logo.png';
import singleBorderIcon from "./images/single-border-icon.svg"
import singlePipingIcon from "./images/single-piping-icon.svg"
import doubleBorderIcon from "./images/double-border-icon.svg"
import exit from './images/exit.svg';
import headerMobile from './images/header-mobile.png';

class StartModal extends Component {
    constructor(props) {
        super(props);
        this.state = {width: '', length: '', borderType: ''};
        this.onChangeWidth = this.onChangeWidth.bind(this);
        this.onChangeLength = this.onChangeLength.bind(this);
        this.setBorderType = this.setBorderType.bind(this);
    }

    onChangeWidth(e) {
        const val = e.target.value;
        this.setState({width: val});
    }

    onChangeLength(e) {
        const val = e.target.value;
        this.setState({length: val});
    }

    setBorderType(e) {
        const val = e.target.value;
        this.setState({borderType: val});
    }

    highlightRadioButton(type) {
        if (this.props.editDimensionsMode) return this.props.border === type ? 'picture-wrapper-highlighted' : 'picture-wrapper';
        return this.state.borderType === type ? 'picture-wrapper-highlighted' : 'picture-wrapper';
    }

    render() {
        return (
            <div className="container">
                <div className="cover-div"/>
                <div className="modal">
                    <div className="header-mobile">
                        <img src={headerMobile} alt="headerMobile" />
                    </div>
                    <div className="logo">
                        <img src={logo} alt="logo"/>
                    </div>
                    <div className="please-let-us-know-w">Please let us know what size rug you're interested in</div>
                    <div>
                        <input
                            type="text"
                            value={ this.props.editBorderMode ? this.props.width : this.state.width }
                            placeholder="Width (m)"
                            className="input"
                            onChange={this.onChangeWidth}/>
                        <input
                            type="text"
                            value={ this.props.editBorderMode ? this.props.length : this.state.length }
                            placeholder="Length (m)"
                            className="input"
                            onChange={this.onChangeLength}/>
                    </div>

                    <div className="border-selector">
                        <div className={this.highlightRadioButton('SINGLE-BORDER')}>
                            <label>
                                <input type="radio" name="border" value="SINGLE-BORDER" onChange={this.setBorderType}/>
                                <img className="border-type-picture" src={singleBorderIcon} alt="singleBorderIcon"/>
                            </label>
                            <h3>Single Border</h3>
                        </div>
                        <div className={this.highlightRadioButton('BORDER-PIPING')}>
                            <label>
                                <input type="radio" name="border" value="BORDER-PIPING" onChange={this.setBorderType}/>
                                <img className="border-type-picture" src={singlePipingIcon} alt="singlePipingIcon"/>
                            </label>
                            <h3>Border & Piping</h3>
                        </div>
                        <div className={this.highlightRadioButton('DOUBLE-BORDER')}>
                            <label>
                                <input type="radio" name="border" value="DOUBLE-BORDER" onChange={this.setBorderType} />
                                <img className="border-type-picture" src={doubleBorderIcon} alt="doubleBorderIcon"/>
                            </label>
                            <h3>Double Border</h3>
                        </div>
                    </div>
                    {
                        ((!this.props.editDimensionsMode && !this.props.editBorderMode) &&
                            (this.state.width === '' ||
                                this.state.length === '' ||
                                this.state.borderType === '')) &&
                        <button
                            className="get-started-btn-inactive"
                            disabled
                        >
                            GET STARTED</button>
                    }
                    {
                        ((!this.props.editDimensionsMode && !this.props.editBorderMode) &&
                            this.state.width !== ''
                            && this.state.length !== '' &&
                            this.state.borderType !== '') &&
                        <LinkButton
                            to='/builder'
                            className="get-started-btn-active"
                            onClick={() => {
                                this.props.setWidth(this.state.width);
                                this.props.setLength(this.state.length);
                                this.props.setBorderType(this.state.borderType);
                            }}
                        >GET STARTED</LinkButton>
                    }
                    {
                        (this.props.editDimensionsMode &&
                            (this.state.width === '' ||
                                this.state.length === '')) &&
                        <button
                            className="get-started-btn-inactive"
                            disabled
                        >EDIT SIZE</button>
                    }
                    {
                        (this.props.editBorderMode && this.state.borderType === '') &&
                        <button
                            className="get-started-btn-inactive"
                            disabled
                        >EDIT SIZE</button>
                    }
                    {
                        (this.props.editDimensionsMode &&
                            this.state.width !== '' &&
                            this.state.length !== '') &&
                        <LinkButton
                            to='/builder'
                            className="get-started-btn-active"
                            onClick={() => {
                                this.props.setWidth(this.state.width);
                                this.props.setLength(this.state.length);
                                this.props.setEditDimensionsMode(false);
                            }}
                        >EDIT SIZE</LinkButton>
                    }
                    {
                        (this.props.editBorderMode &&
                            this.state.borderType !== '') &&
                        <LinkButton
                            to='/builder'
                            className="get-started-btn-active"
                            onClick={() => {
                                this.props.setBorderType(this.state.borderType);
                                this.props.setEditBorderMode(false);
                            }}
                        >EDIT SIZE</LinkButton>
                    }
                    {
                        (this.props.editDimensionsMode || this.props.editBorderMode) &&
                        <LinkImg
                            className="exit-edit-mode-btn"
                            src={exit}
                            alt="exit"
                            to='/builder'
                            onClick={() => {
                                this.props.setEditDimensionsMode(false);
                                this.props.setEditBorderMode(false);
                            }}
                        />
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        width: state.width,
        length: state.length,
        border: state.border,
        editDimensionsMode: state.editDimensionsMode,
        editBorderMode: state.editBorderMode
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setWidth: setWidth,
            setLength: setLength,
            setBorderType: setBorderType,
            setEditDimensionsMode: setEditDimensionsMode,
            setEditBorderMode: setEditBorderMode,

        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(StartModal);