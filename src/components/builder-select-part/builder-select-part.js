import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from 'react-router-dom';

import './builder-select-part.css';

import StartModal from '../product-settings-modal/product-settings-modal';

import CenterMaterial from '../center-material/center-material';
import InnerBorderMaterial from '../inner-border-material/inner-border-material';
import OuterBorderMaterial from '../outer-border-material/outer-border';
import PipingMaterial from '../piping-material/piping-material';
import {
    setEditDimensionsMode,
    setEditBorderMode,

    setShowCenterMaterialMode,
    setShowCenterMaterialFirstChildrenMode,
    setShowCenterMaterialSecondChildrenMode,

    setShowInnerBorderMaterialMode,
    setShowInnerBorderMaterialFirstChildrenMode,
    setShowInnerBorderMaterialSecondChildrenMode,

    setShowOuterBorderMaterialMode,
    setShowOuterBorderMaterialFirstChildrenMode,
    setShowOuterBorderMaterialSecondChildrenMode,

    setShowPipingMaterialMode,

    setCenterMaterialType,
    setInnerBorderMaterialType,
    setOuterBorderMaterialType,
    setPipingMaterialType

} from "../../actions";

import header from './images/header.png';
import footer from './images/footer.png';
import edit from './images/edit-icon.svg';
import exit from './images/exit.svg';
import exitSelected from './images/exit-selected.png';
import restart from './images/restart.svg'
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
import donePale from './images/done-pale.png';
import done from './images/done.png';
import exitSelection from './images/exit.png';
import outerBorder from './images/outer-border.svg'
import piping from './images/piping.svg';

//import Rug from '../rug/rug'
import Rug from '../rug/rug-new';


class BuilderSelectPart extends Component {


    render() {
        const initCenter = {
            id: 0,
            name: 'CENTRE',
            src: ''
        };

        const initInnerBorder = {
            id: 0,
            name: 'INNER BORDER',
            src: ''
        };

        const initOuterBorder = {
            id: 0,
            name: 'OUTER BORDER',
            src: ''
        };

        const initPiping = {
            id: 0,
            name: 'PIPING',
            src: ''
        };

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
                            <div className="rug-3d">
                                <Rug/>
                            </div>
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
                                        {`${this.props.border}`}
                                    </div>
                                </div>
                            </div>
                            <div className="centre-is-selected">

                                {/*type of selected center*/}
                                {this.props.centre.name === "CENTRE" &&
                                <div className="current-size-edit">
                                    <img src={exit} alt="exit"/>
                                    <div className="centre-is-not-selected-type">
                                        {`${this.props.centre.name}`}
                                    </div>
                                </div>}
                                {this.props.centre.name !== "CENTRE" &&
                                <div className="current-size-edit">
                                    <img src={exitSelected} alt="exit" onClick={() => {
                                        this.props.setCenterMaterialType(initCenter);
                                    }}/>
                                    <div className="centre-is-selected-type">
                                        {`${this.props.centre.name}`}
                                    </div>
                                </div>}
                            </div>

                            {/*type of selected outer border*/}

                            <div className="centre-is-selected">

                                {/*type of selected center*/}
                                {this.props.outerBorder.name === "OUTER BORDER" &&
                                <div className="current-size-edit">
                                    <img src={exit} alt="exit"/>
                                    <div className="centre-is-not-selected-type">
                                        {`${this.props.outerBorder.name}`}
                                    </div>
                                </div>}
                                {this.props.outerBorder.name !== "OUTER BORDER" &&
                                <div className="current-size-edit">
                                    <img src={exitSelected} alt="exit" onClick={() => {
                                        this.props.setOuterBorderMaterialType(initOuterBorder);
                                    }}/>
                                    <div className="centre-is-selected-type">
                                        {`${this.props.outerBorder.name}`}
                                    </div>
                                </div>}
                            </div>


                            {/*type of selected inner border*/}
                            {
                                this.props.border === 'DOUBLE-BORDER' &&
                                <div className="border-is-selected">
                                    {this.props.innerBorder.name === "INNER BORDER" &&
                                    <div className="current-size-edit">
                                        <img src={exit} alt="exit"/>
                                        <div className="centre-is-not-selected-type">
                                            {`${this.props.innerBorder.name}`}
                                        </div>
                                    </div>}
                                    {this.props.innerBorder.name !== "INNER BORDER" &&
                                    <div className="current-size-edit">
                                        <img src={exitSelected} alt="exit" onClick={() => {
                                            this.props.setInnerBorderMaterialType(initInnerBorder);
                                        }}/>
                                        <div className="centre-is-selected-type">
                                            {`${this.props.innerBorder.name}`}
                                        </div>
                                    </div>}
                                </div>
                            }

                            {/*type of selected piping*/}
                            {
                                this.props.border === 'BORDER-PIPING' &&
                                <div className="border-is-selected">
                                    {this.props.piping.name === "PIPING" &&
                                    <div className="current-size-edit">
                                        <img src={exit} alt="exit"/>
                                        <div className="centre-is-not-selected-type">
                                            {`${this.props.piping.name}`}
                                        </div>
                                    </div>}
                                    {this.props.piping.name !== "PIPING" &&
                                    <div className="current-size-edit">
                                        <img src={exitSelected} alt="exit" onClick={() => {
                                            this.props.setPipingMaterialType(initPiping);
                                        }}/>
                                        <div className="centre-is-selected-type">
                                            {`${this.props.piping.name}`}
                                        </div>
                                    </div>}
                                </div>
                            }

                            {
                                this.props.border === 'SINGLE-BORDER' &&
                                <div className="border-is-selected">
                                </div>
                            }


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
                        {this.props.showCenterMaterialMode && <CenterMaterial/>}
                        {this.props.showInnerBorderMaterialMode && <InnerBorderMaterial/>}
                        {this.props.showOuterBorderMaterialMode && <OuterBorderMaterial/>}
                        {this.props.showPipingMaterialMode && <PipingMaterial/>}


                        {/*CENTRE*/}
                        {
                            (
                                this.props.border === 'DOUBLE-BORDER' ||
                                this.props.border === 'SINGLE-BORDER' ||
                                this.props.border === 'BORDER-PIPING'
                            ) &&
                            !this.props.showCenterMaterialMode &&
                            !this.props.showInnerBorderMaterialMode &&
                            !this.props.showOuterBorderMaterialMode &&
                            !this.props.showPipingMaterialMode &&
                            <div className="main-area-builder-centre">
                                <div className="centre"
                                     onClick={() => {
                                         this.props.setShowCenterMaterialMode(true);
                                     }}>
                                    <img className="centre-icon" src={centre} alt="centre"/>
                                    <h3>CENTRE</h3>
                                    {this.props.centre.name !== 'CENTRE' &&
                                    <div className="centre-icon-selected-material">
                                        <img src={this.props.centre.src} alt="type"/>
                                    </div>}
                                </div>

                            </div>

                        }

                        {/*OUTER BORDER*/}
                        {
                            (
                                this.props.border === 'DOUBLE-BORDER' ||
                                this.props.border === 'SINGLE-BORDER' ||
                                this.props.border === 'BORDER-PIPING'
                            ) &&
                            !this.props.showCenterMaterialMode &&
                            !this.props.showInnerBorderMaterialMode &&
                            !this.props.showOuterBorderMaterialMode &&
                            !this.props.showPipingMaterialMode &&
                            <div className="main-area-builder-centre">
                                <div className="centre" onClick={() => {
                                    this.props.setShowOuterBorderMaterialMode(true);
                                }}>
                                    <img className="centre-icon" src={outerBorder} alt="outerBorder"/>
                                    <h3>OUTER BORDER</h3>
                                    {this.props.outerBorder.name !== 'OUTER BORDER' &&
                                    <div className="centre-icon-selected-material">
                                        <img src={this.props.outerBorder.src} alt="type"/>
                                    </div>}
                                </div>
                            </div>
                        }

                        {/*INNER BORDER*/}
                        {
                            this.props.border === 'DOUBLE-BORDER' &&
                            !this.props.showCenterMaterialMode &&
                            !this.props.showInnerBorderMaterialMode &&
                            !this.props.showOuterBorderMaterialMode &&
                            !this.props.showPipingMaterialMode &&
                            <div className="main-area-builder-centre">
                                <div className="centre" onClick={() => {
                                    this.props.setShowInnerBorderMaterialMode(true);
                                }}>
                                    <img className="centre-icon" src={innerBorder} alt="innerBorder"/>
                                    <h3>INNER BORDER</h3>
                                    {this.props.innerBorder.name !== 'INNER BORDER' &&
                                    <div className="centre-icon-selected-material">
                                        <img src={this.props.innerBorder.src} alt="type"/>
                                    </div>}
                                </div>
                            </div>
                        }


                        {/*PIPING*/}
                        {
                            this.props.border === 'BORDER-PIPING' &&
                            !this.props.showCenterMaterialMode &&
                            !this.props.showInnerBorderMaterialMode &&
                            !this.props.showOuterBorderMaterialMode &&
                            !this.props.showPipingMaterialMode &&
                            <div className="main-area-builder-inner-border">
                                <div className="centre" onClick={() => {
                                    this.props.setShowPipingMaterialMode(true);
                                }}>
                                    <img className="centre-icon" src={piping} alt="piping"/>
                                    <h3>PIPING</h3>
                                    {this.props.piping.name !== 'PIPING' &&
                                    <div className="centre-icon-selected-material">
                                        <img src={this.props.piping.src} alt="type"/>
                                    </div>}
                                </div>
                            </div>
                        }


                        <div className="main-area-builder-rest">

                            {/*center material types*/}
                            {
                                (this.props.showCenterMaterialMode && !this.props.showCenterMaterialFirstChildrenMode) &&
                                <div className="close-center" onClick={() => {
                                    this.props.setShowCenterMaterialMode(false);
                                }}>
                                    CLOSE CENTRE
                                </div>
                            }

                            {/*inner border material types*/}
                            {
                                (this.props.showInnerBorderMaterialMode && !this.props.showInnerBorderMaterialFirstChildrenMode) &&
                                <div className="close-center" onClick={() => {
                                    this.props.setShowInnerBorderMaterialMode(false);
                                }}>
                                    CLOSE INNER BORDER
                                </div>
                            }

                            {/*outer border material types*/}
                            {
                                (this.props.showOuterBorderMaterialMode && !this.props.showOuterBorderMaterialFirstChildrenMode) &&
                                <div className="close-center" onClick={() => {
                                    this.props.setShowOuterBorderMaterialMode(false);
                                }}>
                                    CLOSE OUTER BORDER
                                </div>
                            }

                            {/*center material types first children */}
                            {
                                (this.props.showCenterMaterialMode
                                    && this.props.showCenterMaterialFirstChildrenMode
                                    && !this.props.showCenterMaterialSecondChildrenMode) &&
                                <div className="back-to-fibre-close-center">
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowCenterMaterialFirstChildrenMode(false)
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={restart} alt="restart"/>
                                            <div>
                                                BACK TO FIBRE
                                            </div>
                                        </div>
                                    </div>
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowCenterMaterialMode(false);
                                        this.props.setShowCenterMaterialFirstChildrenMode(false)
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={exit} alt="exit"/>
                                            <div>
                                                CLOSE CENTRE
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {/*center material types second children */}
                            {
                                (this.props.showCenterMaterialMode &&
                                    this.props.showCenterMaterialFirstChildrenMode &&
                                    this.props.showCenterMaterialSecondChildrenMode) &&
                                <div className="back-to-fibre-close-center">
                                    {this.props.centre.name === 'CENTRE' &&
                                    <div className="back-to-fibre-close-center-first">
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={donePale} alt="done"/>
                                        </div>
                                    </div>}
                                    {this.props.centre.name !== 'CENTRE' &&
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowCenterMaterialMode(false);
                                        this.props.setShowCenterMaterialFirstChildrenMode(false);
                                        this.props.setShowCenterMaterialSecondChildrenMode(false);
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={done} alt="done"/>
                                        </div>
                                    </div>}
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowCenterMaterialSecondChildrenMode(false);
                                        this.props.setCenterMaterialType(initCenter);
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={exitSelection} alt="exit"/>
                                        </div>
                                    </div>
                                </div>
                            }

                            {/*inner border material types first children */}
                            {
                                (this.props.showInnerBorderMaterialMode &&
                                    this.props.showInnerBorderMaterialFirstChildrenMode &&
                                    !this.props.showInnerBorderMaterialSecondChildrenMode) &&
                                <div className="back-to-fibre-close-center">
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowInnerBorderMaterialFirstChildrenMode(false)
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={restart} alt="restart"/>
                                            <div>
                                                BACK TO STYLE
                                            </div>
                                        </div>
                                    </div>
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowInnerBorderMaterialMode(false);
                                        this.props.setShowInnerBorderMaterialFirstChildrenMode(false)
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={exit} alt="exit"/>
                                            <div>
                                                CLOSE INNER BORDER
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {/*inner border material types second children */}
                            {
                                (this.props.showInnerBorderMaterialMode &&
                                    this.props.showInnerBorderMaterialFirstChildrenMode &&
                                    this.props.showInnerBorderMaterialSecondChildrenMode) &&
                                <div className="back-to-fibre-close-center">
                                    {this.props.innerBorder.name === 'INNER BORDER' &&
                                    <div className="back-to-fibre-close-center-first">
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={donePale} alt="done"/>
                                        </div>
                                    </div>}
                                    {this.props.innerBorder.name !== 'INNER BORDER' &&
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowInnerBorderMaterialMode(false);
                                        this.props.setShowInnerBorderMaterialFirstChildrenMode(false);
                                        this.props.setShowInnerBorderMaterialSecondChildrenMode(false);
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={done} alt="done"/>
                                        </div>
                                    </div>}
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowInnerBorderMaterialSecondChildrenMode(false);
                                        this.props.setInnerBorderMaterialType(initInnerBorder);
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={exitSelection} alt="exit"/>
                                        </div>
                                    </div>
                                </div>
                            }

                            {/*outer border material types first children */}
                            {
                                (this.props.showOuterBorderMaterialMode &&
                                    this.props.showOuterBorderMaterialFirstChildrenMode &&
                                    !this.props.showOuterBorderMaterialSecondChildrenMode) &&
                                <div className="back-to-fibre-close-center">
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowOuterBorderMaterialFirstChildrenMode(false)
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={restart} alt="restart"/>
                                            <div>
                                                BACK TO STYLE
                                            </div>
                                        </div>
                                    </div>
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowOuterBorderMaterialMode(false);
                                        this.props.setShowOuterBorderMaterialFirstChildrenMode(false)
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={exit} alt="exit"/>
                                            <div>
                                                CLOSE OUTER BORDER
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {/*outer border material types second children */}
                            {
                                (this.props.showOuterBorderMaterialMode &&
                                    this.props.showOuterBorderMaterialFirstChildrenMode &&
                                    this.props.showOuterBorderMaterialSecondChildrenMode) &&
                                <div className="back-to-fibre-close-center">
                                    {this.props.outerBorder.name === 'OUTER BORDER' &&
                                    <div className="back-to-fibre-close-center-first">
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={donePale} alt="done"/>
                                        </div>
                                    </div>}
                                    {this.props.outerBorder.name !== 'OUTER BORDER' &&
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowOuterBorderMaterialMode(false);
                                        this.props.setShowOuterBorderMaterialFirstChildrenMode(false);
                                        this.props.setShowOuterBorderMaterialSecondChildrenMode(false);
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={done} alt="done"/>
                                        </div>
                                    </div>}
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowOuterBorderMaterialSecondChildrenMode(false);
                                        this.props.setOuterBorderMaterialType(initOuterBorder);
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={exitSelection} alt="exit"/>
                                        </div>
                                    </div>
                                </div>
                            }

                            {/*piping material types*/}
                            {
                                this.props.showPipingMaterialMode &&
                                <div className="back-to-fibre-close-center">
                                    {this.props.piping.name === 'PIPING' &&
                                    <div className="back-to-fibre-close-center-first">
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={donePale} alt="done"/>
                                        </div>
                                    </div>}
                                    {this.props.piping.name !== 'PIPING' &&
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowPipingMaterialMode(false);
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={done} alt="done"/>
                                        </div>
                                    </div>}
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowPipingMaterialMode(false);
                                        this.props.setPipingMaterialType(initPiping);
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={exitSelection} alt="exit"/>
                                        </div>
                                    </div>
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
        outerBorder: state.outerBorder,
        piping: state.piping,

        editDimensionsMode: state.editDimensionsMode,
        editBorderMode: state.editBorderMode,

        showCenterMaterialMode: state.showCenterMaterialMode,
        showCenterMaterialFirstChildrenMode: state.showCenterMaterialFirstChildrenMode,
        showCenterMaterialSecondChildrenMode: state.showCenterMaterialSecondChildrenMode,

        showInnerBorderMaterialMode: state.showInnerBorderMaterialMode,
        showInnerBorderMaterialFirstChildrenMode: state.showInnerBorderMaterialFirstChildrenMode,
        showInnerBorderMaterialSecondChildrenMode: state.showInnerBorderMaterialSecondChildrenMode,

        showOuterBorderMaterialMode: state.showOuterBorderMaterialMode,
        showOuterBorderMaterialFirstChildrenMode: state.showOuterBorderMaterialFirstChildrenMode,
        showOuterBorderMaterialSecondChildrenMode: state.showOuterBorderMaterialSecondChildrenMode,

        showPipingMaterialMode: state.showPipingMaterialMode
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setEditDimensionsMode: setEditDimensionsMode,
            setEditBorderMode: setEditBorderMode,

            setShowCenterMaterialMode: setShowCenterMaterialMode,
            setShowCenterMaterialFirstChildrenMode: setShowCenterMaterialFirstChildrenMode,
            setShowCenterMaterialSecondChildrenMode: setShowCenterMaterialSecondChildrenMode,

            setShowInnerBorderMaterialMode: setShowInnerBorderMaterialMode,
            setShowInnerBorderMaterialFirstChildrenMode: setShowInnerBorderMaterialFirstChildrenMode,
            setShowInnerBorderMaterialSecondChildrenMode: setShowInnerBorderMaterialSecondChildrenMode,

            setShowOuterBorderMaterialMode: setShowOuterBorderMaterialMode,
            setShowOuterBorderMaterialFirstChildrenMode: setShowOuterBorderMaterialFirstChildrenMode,
            setShowOuterBorderMaterialSecondChildrenMode: setShowOuterBorderMaterialSecondChildrenMode,

            setShowPipingMaterialMode: setShowPipingMaterialMode,

            setCenterMaterialType: setCenterMaterialType,
            setInnerBorderMaterialType: setInnerBorderMaterialType,
            setOuterBorderMaterialType: setOuterBorderMaterialType,
            setPipingMaterialType: setPipingMaterialType
        },
        dispatch)
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(BuilderSelectPart));