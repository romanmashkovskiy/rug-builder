import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from 'react-router-dom';

import './builder-select-part.css';

import StartModal from '../product-settings-modal/product-settings-modal';
import LoginRegisterModal from '../login-register/login-register-modal';
import LoginModal from '../login-modal/login-modal';
import RegisterModal from '../register-modal/register-modal';
import GuestModal from '../guest-modal/guest-modal';

import CenterMaterial from '../center-material/center-material';
import InnerBorderMaterial from '../inner-border-material/inner-border-material';
import OuterBorderMaterial from '../outer-border-material/outer-border';
import PipingMaterial from '../piping-material/piping-material';
import {
    setEditDimensionsMode,
    setEditBorderMode,
    setRugPosition,

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
    setPipingMaterialType,

    setRugCurrentView,

    zoomRugIn,
    zoomRugOut,

    setShowRugCornerMode,
    setShowRoomPresetsMode,

    getRugPrice,

    setShowLoginRegisterMode,

    clearCenterMaterialFirstChildrenMaterials,
    clearCenterMaterialSecondChildrenMaterials,
    clearInnerBorderMaterialFirstChildrenMaterials,
    clearInnerBorderMaterialSecondChildrenMaterials,
    clearOuterBorderMaterialFirstChildrenMaterials,
    clearOuterBorderMaterialSecondChildrenMaterials
} from "../../actions";

import header from './images/header.png';
import footer from './images/footer.png';
import edit from './images/edit-icon.svg';
import exit from './images/exit.svg';
import exitSelected from './images/exit-selected.png';
import restart from './images/restart.svg'
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

import roomSet1 from './room-presets/room-set-1.jpg';
import roomSet2 from './room-presets/room-set-2.jpg';
import roomSet3 from './room-presets/room-set-3.jpg';
import roomSet4 from './room-presets/room-set-4.jpg';
import roomSet5 from './room-presets/room-set-5.jpg';

import Rug from '../rug/rug';
import RugCorner from '../rug/rug-corner';

const ls = require('local-storage');


class BuilderSelectPart extends Component {
    constructor(props) {
        super(props);
        this.state = {showMobileSpecification: false};
        this.slideIndex = 1;
    }

    changeRoomPreset(n) {
        this.showRoomPreset(this.slideIndex += n);
    }

    showRoomPreset(n) {
        let i;
        const x = document.getElementsByClassName("room-presets-images");
        if (n > x.length) {
            this.slideIndex = 1
        }
        if (n < 1) {
            this.slideIndex = x.length
        }
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        x[this.slideIndex - 1].style.display = "block";
        document.getElementsByClassName("room-presets-room-name")[0].innerHTML = x[this.slideIndex - 1].name;
    }

    checkRugFinished() {
        if (this.props.width !== '' &&
            this.props.width !== 0 &&
            this.props.length !== '' &&
            this.props.length !== 0 &&
            (
                (
                    this.props.border === 'DOUBLE-BORDER' &&
                    this.props.innerBorder.name !== 'INNER BORDER' &&
                    this.props.outerBorder.name !== 'OUTER BORDER' &&
                    this.props.centre.name !== 'CENTRE'
                ) ||
                (
                    this.props.border === 'BORDER-PIPING' &&
                    this.props.piping.post_title !== 'PIPING' &&
                    this.props.outerBorder.name !== 'OUTER BORDER' &&
                    this.props.centre.name !== 'CENTRE'
                ) ||
                (
                    this.props.border === 'SINGLE-BORDER' &&
                    this.props.outerBorder.name !== 'OUTER BORDER' &&
                    this.props.centre.name !== 'CENTRE'
                )
            )
        ) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        this.props.getRugPrice(
            encodeURIComponent(this.props.centre.name),
            this.props.length,
            this.props.width,
            this.props.border,
            this.props.innerBorder,
            this.props.outerBorder,
            this.props.piping
        );
    }

    render() {
        const initCenter = {
            id: 0,
            name: 'CENTRE'
        };

        const initInnerBorder = {
            id: 0,
            name: 'INNER BORDER'
        };

        const initOuterBorder = {
            id: 0,
            name: 'OUTER BORDER'
        };

        const initPiping = {
            id: 0,
            post_title: 'PIPING'
        };

        return (
            <div className="container-builder">
                {(this.props.editDimensionsMode || this.props.editBorderMode) &&
                <StartModal/>}
                {/*<div className="header-builder header-builder-A">*/}
                    {/*/!*<img src={header} alt="header"/>*!/*/}
                    {/*<img/>*/}
                {/*</div>*/}
                <div className="main-builder">
                    {this.props.showLoginRegisterModal &&
                    <LoginRegisterModal/>
                    }
                    {this.props.showLoginModal &&
                    <LoginModal/>
                    }
                    {this.props.showRegisterModal &&
                    <RegisterModal/>
                    }
                    {this.props.showGuestModal &&
                    <GuestModal/>
                    }

                    <div className="main-builder-carpet">
                        <div className="main-carpet-preview">
                            <div className="rug-3d">
                                <Rug/>
                            </div>
                            <div className="left-controls">
                                <div className="left-controls-first"
                                     onClick={() => this.props.setShowRugCornerMode(true)}>
                                    <img src={leftControlFirst} alt="leftControlFirst"/>
                                </div>
                                <div className="left-controls-second"
                                     onClick={() => this.props.setShowRoomPresetsMode(true)}>
                                    <img src={leftControlSecond} alt="leftControlSecond"/>
                                </div>
                                {
                                    false && // not ready
                                    <div className="left-controls-third">
                                        <img src={leftControlThird} alt="leftControlThird"/>
                                    </div>

                                }
                            </div>
                            {this.props.showRugCornerMode && !this.props.showRoomPresetsMode &&
                            <div className="rug-corner">
                                <div className="rug-corner-preview">
                                    <RugCorner/>
                                </div>
                                <div className="rug-corner-close"
                                     onClick={() => this.props.setShowRugCornerMode(false)}>
                                    <img src={exitSelected} alt="exit"/>
                                    <div className="rug-corner-close-text">
                                        CLOSE
                                    </div>
                                </div>
                            </div>
                            }
                            {this.props.showRoomPresetsMode && !this.props.showRugCornerMode &&
                            <div className="room-presets">
                                <div className="room-presets-header">
                                    PRESET SCENES
                                </div>
                                <div className="room-presets-image-wrapper">
                                    <img className="room-presets-images" src={roomSet1} name="PATIO1"/>
                                    <img className="room-presets-images" src={roomSet2} style={{display: "none"}}
                                         name="PATIO2"/>
                                    <img className="room-presets-images" src={roomSet3} style={{display: "none"}}
                                         name="PATIO3"/>
                                    <img className="room-presets-images" src={roomSet4} style={{display: "none"}}
                                         name="PATIO4"/>
                                    <img className="room-presets-images" src={roomSet5} style={{display: "none"}}
                                         name="PATIO5"/>
                                </div>
                                <div className="room-presets-room-select">
                                    <div className="room-presets-back" onClick={() => {
                                        this.changeRoomPreset(-1)
                                    }}/>
                                    <div className="room-presets-room-name">
                                        PATIO1
                                    </div>
                                    <div className="room-presets-forward" onClick={() => {
                                        this.changeRoomPreset(1)
                                    }}/>
                                </div>
                                <div>
                                    <button className="room-presets-clear-preset-btn"
                                            onClick={() => this.props.setShowRoomPresetsMode(false)}
                                    >
                                        CLEAR PRESET
                                    </button>
                                </div>
                            </div>
                            }
                            {!this.props.showRoomPresetsMode &&
                            <div className="zoomin-zoomout">
                                <div className="twice">
                                    {this.props.currentZoom}X
                                </div>
                                <div className="zoom-in" onClick={() => this.props.zoomRugIn()}>
                                    <img src={zoomIn} alt="zoomIn"/>
                                </div>
                                <div className="zoom-out" onClick={() => this.props.zoomRugOut()}>
                                    <img src={zoomOut} alt="zoomOut"/>
                                </div>
                            </div>
                            }
                            {
                                window.innerWidth < 450 &&
                                <div className="price-mobile">
                                    <div className="price-mobile-value">
                                        &#163; {this.props.rugPrice}
                                    </div>
                                </div>
                            }
                            {!this.props.showRoomPresetsMode &&
                            <div className="perspective-control">
                                <div className="above-vertical"
                                     onClick={() => this.props.setRugCurrentView('above-vertical')}>
                                    <img src={aboveVertical} alt="aboveVertical"/>
                                </div>
                                <div className="above-horizontal"
                                     onClick={() => this.props.setRugCurrentView('above-horizontal')}>
                                    <img src={aboveHorizontal} alt="aboveHorizontal"/>
                                </div>
                                <div className="angled-horizontal"
                                     onClick={() => this.props.setRugCurrentView('angled-horizontal')}>
                                    <img src={angledHorizontal} alt="angledHorizontal"/>
                                </div>
                                <div className="angled" onClick={() => this.props.setRugCurrentView('angled')}>
                                    <img src={angled} alt="angled"/>
                                </div>
                            </div>
                            }
                        </div>
                        {/*<div className="main-carpet-controls">*/}
                        <div className={window.innerWidth > 450 ? "main-carpet-controls" :
                            (this.state.showMobileSpecification ? "main-carpet-controls visible" : "main-carpet-controls")
                        }>
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
                                        {`${this.props.centre.name} ${this.props.centre.code}`}
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
                                        {`${this.props.outerBorder.name} ${this.props.outerBorder.code}`}
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
                                            {`${this.props.innerBorder.name} ${this.props.innerBorder.code}`}
                                        </div>
                                    </div>}
                                </div>
                            }

                            {/*type of selected piping*/}
                            {
                                this.props.border === 'BORDER-PIPING' &&
                                <div className="border-is-selected">
                                    {this.props.piping.post_title === "PIPING" &&
                                    <div className="current-size-edit">
                                        <img src={exit} alt="exit"/>
                                        <div className="centre-is-not-selected-type">
                                            {`${this.props.piping.post_title}`}
                                        </div>
                                    </div>}
                                    {this.props.piping.post_title !== "PIPING" &&
                                    <div className="current-size-edit">
                                        <img src={exitSelected} alt="exit" onClick={() => {
                                            this.props.setPipingMaterialType(initPiping);
                                        }}/>
                                        <div className="centre-is-selected-type">
                                            {`${this.props.piping.post_title} ${this.props.piping.code}`}
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
                                    <div className="price-value">&#163; {this.props.rugPrice}</div>
                                </div>
                            </div>
                            {
                                (
                                    this.props.width === '' ||
                                    this.props.width === 0 ||
                                    this.props.length === '' ||
                                    this.props.length === 0 ||
                                    this.props.centre === 'CENTRE' ||
                                    this.props.border === '' ||
                                    (
                                        this.props.border === 'DOUBLE-BORDER' &&
                                        (this.props.innerBorder.name === 'INNER BORDER' ||
                                            this.props.outerBorder.name === 'OUTER BORDER' ||
                                            this.props.centre.name === 'CENTRE')
                                    ) ||
                                    (
                                        this.props.border === 'BORDER-PIPING' &&
                                        (this.props.piping.post_title === 'PIPING' ||
                                            this.props.outerBorder.name === 'OUTER BORDER' ||
                                            this.props.centre.name === 'CENTRE')
                                    ) ||
                                    (
                                        this.props.border === 'SINGLE-BORDER' &&
                                        (this.props.outerBorder.name === 'OUTER BORDER' ||
                                            this.props.centre.name === 'CENTRE')
                                    )
                                )
                                &&
                                <div className="finish-building-block">
                                    <button className="finish-building-btn-inactive" disabled>FINISH BUILDING</button>
                                </div>
                            }
                            {
                                this.checkRugFinished()
                                &&
                                <div className="finish-building-block">
                                    <button
                                        className="finish-building-btn-active"
                                        onClick={() => {
                                            if (!ls('curUser')) {
                                                this.props.setShowLoginRegisterMode(true);
                                            } else {
                                                this.props.setRugPosition(true)
                                            }
                                        }}>FINISH BUILDING
                                    </button>
                                </div>
                            }

                            <div className="ap-preview-block">
                                <button className="ap-preview-btn" disabled>AR PREVIEW</button>
                            </div>

                            {
                                window.innerWidth < 450 && this.state.showMobileSpecification &&
                                <div className="back-to-builder-mobile" onClick={() => {
                                    this.setState({showMobileSpecification: false})
                                }
                                }>
                                    <div>
                                        BACK TO BUILDER
                                    </div>
                                </div>
                            }


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
                                        <img src={this.props.centre.picture} alt="type"/>
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
                                        <img src={this.props.outerBorder.picture} alt="type"/>
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
                                        <img src={this.props.innerBorder.picture} alt="type"/>
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
                            <div className="main-area-builder-centre">
                                <div className="centre" onClick={() => {
                                    this.props.setShowPipingMaterialMode(true);
                                }}>
                                    <img className="centre-icon" src={piping} alt="piping"/>
                                    <h3>PIPING</h3>
                                    {this.props.piping.post_title !== 'PIPING' &&
                                    <div className="centre-icon-selected-material">
                                        <img src={this.props.piping.picture} alt="type"/>
                                    </div>}
                                </div>
                            </div>
                        }

                        {
                            !this.props.showCenterMaterialMode &&
                            !this.props.showInnerBorderMaterialMode &&
                            !this.props.showOuterBorderMaterialMode &&
                            !this.props.showPipingMaterialMode &&

                            <div className={this.state.showMobileSpecification ?
                                "main-area-builder-view-selections inVisible" : "main-area-builder-view-selections"}>
                                <div className="centre" onClick={() => this.setState({showMobileSpecification: true})}>
                                    <h3>VIEW SELECTIONS</h3>
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
                                        this.props.setShowCenterMaterialFirstChildrenMode(false);
                                        this.props.clearCenterMaterialFirstChildrenMaterials();
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
                                        this.props.setShowCenterMaterialFirstChildrenMode(false);
                                        this.props.clearCenterMaterialFirstChildrenMaterials();
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
                                        this.props.clearCenterMaterialFirstChildrenMaterials();
                                        this.props.clearCenterMaterialSecondChildrenMaterials();

                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={done} alt="done"/>
                                        </div>
                                    </div>}
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowCenterMaterialSecondChildrenMode(false);
                                        this.props.setCenterMaterialType(initCenter);
                                        this.props.clearCenterMaterialSecondChildrenMaterials();
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
                                        this.props.setShowInnerBorderMaterialFirstChildrenMode(false);
                                        this.props.clearInnerBorderMaterialFirstChildrenMaterials();
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
                                        this.props.setShowInnerBorderMaterialFirstChildrenMode(false);
                                        this.props.clearInnerBorderMaterialFirstChildrenMaterials();
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
                                        this.props.clearInnerBorderMaterialFirstChildrenMaterials();
                                        this.props.clearInnerBorderMaterialSecondChildrenMaterials();
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={done} alt="done"/>
                                        </div>
                                    </div>}
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowInnerBorderMaterialSecondChildrenMode(false);
                                        this.props.setInnerBorderMaterialType(initInnerBorder);
                                        this.props.clearInnerBorderMaterialSecondChildrenMaterials();
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
                                        this.props.setShowOuterBorderMaterialFirstChildrenMode(false);
                                        this.props.clearOuterBorderMaterialFirstChildrenMaterials();
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
                                        this.props.setShowOuterBorderMaterialFirstChildrenMode(false);
                                        this.props.clearOuterBorderMaterialFirstChildrenMaterials();
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
                                        this.props.clearOuterBorderMaterialFirstChildrenMaterials();
                                        this.props.clearOuterBorderMaterialSecondChildrenMaterials();
                                    }
                                    }>
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={done} alt="done"/>
                                        </div>
                                    </div>}
                                    <div className="back-to-fibre-close-center-first" onClick={() => {
                                        this.props.setShowOuterBorderMaterialSecondChildrenMode(false);
                                        this.props.setOuterBorderMaterialType(initOuterBorder);
                                        this.props.clearOuterBorderMaterialSecondChildrenMaterials();
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
                                    {this.props.piping.post_title === 'PIPING' &&
                                    <div className="back-to-fibre-close-center-first">
                                        <div className="back-to-fibre-close-center-first-text-image">
                                            <img src={donePale} alt="done"/>
                                        </div>
                                    </div>}
                                    {this.props.piping.post_title !== 'PIPING' &&
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
                {/*<div className="footer-builder">*/}
                    {/*<img src={footer} alt="footer"/>*/}
                {/*</div>*/}


            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        width: state.width,
        length: state.length,
        border: state.border,
        rugImage: state.rugImage,

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

        showPipingMaterialMode: state.showPipingMaterialMode,

        currentZoom: state.currentZoom,

        showRugCornerMode: state.showRugCornerMode,
        showRoomPresetsMode: state.showRoomPresetsMode,

        rugPrice: state.rugPrice,

        showLoginRegisterModal: state.showLoginRegisterModal,
        showLoginModal: state.showLoginModal,
        showRegisterModal: state.showRegisterModal,
        showGuestModal: state.showGuestModal,
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setEditDimensionsMode: setEditDimensionsMode,
            setEditBorderMode: setEditBorderMode,
            setRugPosition: setRugPosition,

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
            setPipingMaterialType: setPipingMaterialType,

            setRugCurrentView: setRugCurrentView,

            zoomRugIn: zoomRugIn,
            zoomRugOut: zoomRugOut,

            setShowRugCornerMode: setShowRugCornerMode,
            setShowRoomPresetsMode: setShowRoomPresetsMode,

            getRugPrice: getRugPrice,

            setShowLoginRegisterMode: setShowLoginRegisterMode,

            clearCenterMaterialFirstChildrenMaterials: clearCenterMaterialFirstChildrenMaterials,
            clearCenterMaterialSecondChildrenMaterials: clearCenterMaterialSecondChildrenMaterials,
            clearInnerBorderMaterialFirstChildrenMaterials: clearInnerBorderMaterialFirstChildrenMaterials,
            clearInnerBorderMaterialSecondChildrenMaterials: clearInnerBorderMaterialSecondChildrenMaterials,
            clearOuterBorderMaterialFirstChildrenMaterials: clearOuterBorderMaterialFirstChildrenMaterials,
            clearOuterBorderMaterialSecondChildrenMaterials: clearOuterBorderMaterialSecondChildrenMaterials
        },
        dispatch)
};

export default withRouter(connect(mapStateToProps, matchDispatchToProps)(BuilderSelectPart));