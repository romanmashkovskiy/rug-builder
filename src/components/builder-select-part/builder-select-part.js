import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from 'react-router-dom';

import './builder-select-part.css';

import StartModal from '../product-settings-modal/product-settings-modal';
import CenterMaterial from '../center-material/center-material';
import InnerBorderMaterial from '../inner-border-material/inner-border-material';
import {setEditDimensionsMode, setEditBorderMode} from "../../actions";

import header from './images/header.png';
import footer from './images/footer.png';
import edit from './images/edit-icon.svg';
import exit from './images/exit.svg';
import twice from './images/2x.png';
import zoomIn from './images/zoom-in.svg';
import zoomOut from './images/zoom-out.svg';
import leftControlFirst from './images/zoom window.svg';
import leftControlSecond from './images/room-presets.svg';
import leftControlThird from './images/random-icon.svg';
import aboveHorizontal from './images/above-horizontal.svg';
import aboveVertical from './images/above-vertical.svg';
import angledHorizontal from './images/angled-horizontal.svg';
import angled from './images/angled.svg';
import centre from './images/centre-icon.svg';
import innerBorder from './images/inner-border-icon.svg';

//import Rug from '../rug/rug'


class BuilderSelectPart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showCenterMaterial: false,
            showInnerBorderMaterial: false
        }
    }

    render() {
        return (
            <div className="container-builder">
                <div className="header-builder">
                    <img src={header} alt="header"/>
                </div>
                <div className="main-builder">
                    {(this.props.editDimensionsMode || this.props.editBorderMode) &&
                    <StartModal/>}
                    <div className="main-builder-carpet">
                        <div className="main-carpet-preview">
                            <div className="left-controls">
                                <div className="left-controls-first">
                                    <img src={leftControlFirst} alt="leftControlFirst"/>
                                </div>
                                <div className="left-controls-second">
                                    <img src={leftControlSecond} alt="leftControlSecond"/>
                                </div>
                                <div className="left-controls-third">
                                    <img src={leftControlThird} alt="leftControlThird"/>
                                </div>
                            </div>
                            <div className="zoomin-zoomout">
                                <div className="twice">
                                    <img src={twice} alt="twice"/>
                                </div>
                                <div className="zoom-in">
                                    <img src={zoomIn} alt="zoomIn"/>
                                </div>
                                <div className="zoom-out">
                                    <img src={zoomOut} alt="zoomOut"/>
                                </div>
                            </div>
                            <div className="perspective-control">
                                <div className="above-vertical">
                                    <img src={aboveVertical} alt="aboveVertical"/>
                                </div>
                                <div className="above-horizontal">
                                    <img src={aboveHorizontal} alt="aboveHorizontal"/>
                                </div>
                                <div className="angled-horizontal">
                                    <img src={angledHorizontal} alt="angledHorizontal"/>
                                </div>
                                <div className="angled">
                                    <img src={angled} alt="angled"/>
                                </div>
                            </div>
                        </div>
                        <div className="main-carpet-controls">
                            <div className="rug-specification">
                                <div className="your-bespoke-rug-spe">
                                    YOUR BESPOKE RUG SPECIFICATION
                                </div>
                            </div>
                            <div className="current-carpet-size">
                                <div
                                    className="current-size-edit"
                                    onClick={() => {
                                        this.props.setEditDimensionsMode(true);
                                    }
                                    }
                                >
                                    <img src={edit} alt="edit"/>
                                    <div className="current-size-edit-dimensions">
                                        {`${this.props.length}m X ${this.props.width}m`}
                                    </div>
                                </div>
                            </div>
                            <div className="current-border-type">
                                <div
                                    className="current-size-edit"
                                    onClick={() => {
                                        this.props.setEditBorderMode(true);
                                    }
                                    }
                                >
                                    <img src={edit} alt="edit"/>
                                    <div className="current-size-edit-dimensions">
                                        {`${this.props.border.toUpperCase()}`}
                                    </div>
                                </div>
                            </div>
                            <div className="centre-is-selected">
                                <div className="current-size-edit">
                                    <img src={exit} alt="exit"/>
                                    <div className="centre-is-selected-type">
                                        {`${this.props.centre}`}
                                    </div>
                                </div>
                            </div>
                            <div className="border-is-selected">
                                <div className="current-size-edit">
                                    <img src={exit} alt="exit"/>
                                    <div className="centre-is-selected-type">
                                        {`${this.props.innerBorder}`}
                                    </div>
                                </div>
                            </div>
                            <div className="border-is-selected">
                            </div>
                            <div className="carpet-price">
                                <div className="carpet-price-block">
                                    <div className="price-word">Price:</div>
                                    <div className="price-value">&#163; 1050</div>
                                </div>
                            </div>
                            <div className="finish-building-block">
                                <button className="finish-building-btn-inactive" disabled>FINISH BUILDING</button>
                            </div>
                            <div className="finish-building-block">
                                <button className="ap-preview-btn" disabled>AR PREVIEW</button>
                            </div>
                        </div>
                    </div>
                    <div className="main-area-builder">
                        {this.state.showCenterMaterial && <CenterMaterial />}
                        {this.state.showInnerBorderMaterial && <InnerBorderMaterial />}

                        {
                            !this.state.showCenterMaterial && !this.state.showInnerBorderMaterial &&
                            <div className="main-area-builder-centre">
                                <div className="centre"
                                     onClick={() => {
                                         this.setState({showCenterMaterial: true})
                                     }}>
                                    <img src={centre} alt="centre" />
                                    <h3>CENTRE</h3>
                                </div>
                            </div>

                        }
                        {
                            !this.state.showCenterMaterial && !this.state.showInnerBorderMaterial &&
                            <div className="main-area-builder-inner-border">
                                <div className="centre" onClick={() => {
                                    this.setState({showInnerBorderMaterial: true})
                                }}>
                                    <img src={innerBorder} alt="innerBorder"/>
                                    <h3>INNER BORDER</h3>
                                </div>
                            </div>
                        }
                        <div className="main-area-builder-rest">
                            {
                                (this.state.showCenterMaterial || this.state.showInnerBorderMaterial) &&
                                <div className="close-center" onClick={() => {
                                    this.setState({showCenterMaterial: false, showInnerBorderMaterial: false})
                                }}>
                                    {
                                        this.state.showCenterMaterial ? 'CLOSE CENTRE' : 'CLOSE INNER BORDER'
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="footer-builder">
                    <img src={footer} alt="footer"/>
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
        centre: state.centre,
        innerBorder: state.innerBorder,
        editDimensionsMode: state.editDimensionsMode,
        editBorderMode: state.editBorderMode
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setEditDimensionsMode: setEditDimensionsMode,
            setEditBorderMode: setEditBorderMode
        },
        dispatch)
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(BuilderSelectPart));