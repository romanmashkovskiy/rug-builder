import React, {Component} from 'react';
import './product-settings-modal.css';
import {setLength, setWidth, setBorderType} from "../../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import logo from './images/logo.png';
import singleBorderIcon from "./images/single-border-icon.svg"
import singlePipingIcon from "./images/single-piping-icon.svg"
import doubleBorderIcon from "./images/double-border-icon.svg"


class StartModal extends Component {
    constructor(props) {
        super(props);
        this.onChangeWidth = this.onChangeWidth.bind(this);
        this.onChangeLength = this.onChangeLength.bind(this);
        this.setBorderType = this.setBorderType.bind(this);
    }

    onChangeWidth(e) {
        const val = e.target.value;
        console.log(val);
        this.props.setWidth(val); // в сторе строка
    }

    onChangeLength(e) {
        const val = e.target.value;
        console.log(val);
        this.props.setLength(val); // в сторе строка
    }

    setBorderType(e) {
        const val = e.target.value;
        console.log(val);
        this.props.setBorderType(val);
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
                        <input type="text" value={this.props.width} placeholder="Width (m)" className="input"
                               onChange={this.onChangeWidth}/>
                        <input type="text" value={this.props.length} placeholder="Length (m)" className="input"
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
                    {(this.props.width === '' || this.props.length === '' || this.props.border === '') &&
                    <button className="get-started-btn-inactive" disabled>Get started</button>}
                    {(this.props.width !== '' && this.props.length !== '' && this.props.border !== '') &&
                    <button className="get-started-btn-active">Get started</button>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        width: state.width,
        length: state.length,
        border: state.border
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setWidth: setWidth,
            setLength: setLength,
            setBorderType: setBorderType
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(StartModal);