import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {setLength, setWidth, setBorderType, setEditDimensionsBorderMode} from "../../actions";
import LinkButton from '../link-elements/link-button';
import LinkImg from '../link-elements/link-img';
import './product-settings-modal.css';

import logo from './images/logo.png';
import singleBorderIcon from "./images/single-border-icon.svg"
import singlePipingIcon from "./images/single-piping-icon.svg"
import doubleBorderIcon from "./images/double-border-icon.svg"
import exit from './images/exit.svg';


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

    render() {
        return (
            <div className="container">
                <div className="cover-div"/>
                <div className="modal">
                    <div className="logo">
                        <img src={logo} alt="logo"/>
                    </div>
                    <div className="please-let-us-know-w">Please let us know what size rug you're interested in</div>
                    <div>
                        <input
                            type="text"
                            value={ this.state.width }
                            placeholder="Width (m)"
                            className="input"
                            onChange={this.onChangeWidth}/>
                        <input
                            type="text"
                            value={ this.state.length }
                            placeholder="Length (m)"
                            className="input"
                            onChange={this.onChangeLength}/>
                    </div>

                    <div className="border-selector">
                        <div className="picture-wrapper">
                            <label>
                                <input type="radio" name="border" value="single-border" onClick={this.setBorderType}/>
                                <img className="border-type-picture" src={singleBorderIcon} alt="singleBorderIcon"/>
                            </label>
                            <h3>Single Border</h3>
                        </div>
                        <div className="picture-wrapper">
                            <label>
                                <input type="radio" name="border" value="border-piping" onClick={this.setBorderType}/>
                                <img className="border-type-picture" src={singlePipingIcon} alt="singlePipingIcon"/>
                            </label>
                            <h3>Border & Piping</h3>
                        </div>
                        <div className="picture-wrapper">
                            <label>
                                <input type="radio" name="border" value="double-border" onClick={this.setBorderType}/>
                                <img className="border-type-picture" src={doubleBorderIcon} alt="doubleBorderIcon"/>
                            </label>
                            <h3>Double Border</h3>
                        </div>
                    </div>
                    {
                        (!this.props.editDimensionsBorderMode &&
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
                        (!this.props.editDimensionsBorderMode &&
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
                        (this.props.editDimensionsBorderMode &&
                            (this.state.width === '' ||
                                this.state.length === '' ||
                                this.state.borderType === '')) &&
                        <button
                            className="get-started-btn-inactive"
                            disabled
                        >EDIT SIZE</button>
                    }
                    {
                        (this.props.editDimensionsBorderMode &&
                            this.state.width !== '' &&
                            this.state.length !== '' &&
                            this.state.borderType !== '') &&
                        <LinkButton
                            to='/builder'
                            className="get-started-btn-active"
                            onClick={() => {
                                this.props.setWidth(this.state.width);
                                this.props.setLength(this.state.length);
                                this.props.setBorderType(this.state.borderType);
                                this.props.setEditDimensionsBorderMode(false)
                            }}
                        >EDIT SIZE</LinkButton>
                    }
                    {
                        this.props.editDimensionsBorderMode &&
                        <LinkImg
                            className="exit-edit-mode-btn"
                            src={exit}
                            alt="exit"
                            to='/builder'
                            onClick={() => this.props.setEditDimensionsBorderMode(false)}
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
        editDimensionsBorderMode: state.editDimensionsBorderMode
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setWidth: setWidth,
            setLength: setLength,
            setBorderType: setBorderType,
            setEditDimensionsBorderMode: setEditDimensionsBorderMode
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(StartModal);