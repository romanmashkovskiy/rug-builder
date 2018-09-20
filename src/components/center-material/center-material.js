import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    setShowCenterMaterialFirstChildrenMode,
    setShowCenterMaterialSecondChildrenMode,
    setCenterMaterialType,
    getCenterMaterials,
    getCenterMaterialsFirstChildren,
    getCenterMaterialsSecondChildren,
    setCurrentMaterialHover,
    setCurrentMaterialHoverCoords
} from "../../actions";

import random from './images/random-icon.svg';
import './center-material.css';


class CenterMaterial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentParent: ''
        }
    }

    componentDidMount() {
        this.props.getCenterMaterials();
    }

    showFirstChildren(parent) {
        this.props.setShowCenterMaterialFirstChildrenMode(true);
        this.props.getCenterMaterialsFirstChildren(parent.name);
    }

    showSecondChildren(parent) {
        this.props.setShowCenterMaterialSecondChildrenMode(true);
        this.props.getCenterMaterialsSecondChildren(parent.slug);
    }

    calculateRandom() {
        if (this.props.showCenterMaterialSecondChildrenMode) {
            const length = this.props.centerMaterialsSecondChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.props.setCenterMaterialType(this.props.centerMaterialsSecondChildren[randomIndex]);
        } else {
            const length = this.props.centerMaterialsFirstChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.showSecondChildren(this.props.centerMaterialsFirstChildren[randomIndex]);
        }
    }

    currentMaterialHover(child) {
        this.props.setCurrentMaterialHover(child);
        const {left, top, width} = this.refs[child.name].getBoundingClientRect();
        this.props.setCurrentMaterialHoverCoords({left, top, width});
    }

    render() {

        return (
            <Fragment>
                {
                    window.innerWidth > 450 && this.props.currentMaterialHover.name &&
                    <div className="single-materials-center-hover"
                         style={{
                             left: this.props.currentMaterialHoverCoords.left - (195 - this.props.currentMaterialHoverCoords.width) / 2,
                             top: this.props.currentMaterialHoverCoords.top - 340
                         }}>
                        <img src={this.props.currentMaterialHover.picture} alt="material-center-child"/>
                        <h3>{this.props.currentMaterialHover.code}</h3>
                    </div>
                }
                <div className="materials-center-list">

                    {/*parent center material*/}
                    {
                        !this.props.showCenterMaterialFirstChildrenMode &&
                        this.props.centerMaterials.map((material) => {
                            return (
                                material.thumb &&
                                <div className="single-materials-center-list" key={material.term_id}
                                     onClick={() => this.showFirstChildren(material)}>
                                    <div className="single-materials-center-list-wrapper">
                                        <img src={material.thumb} alt="type-material-center"/>
                                        <h3>{material.name}</h3>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {/*random children center material*/}
                    {
                        (this.props.showCenterMaterialFirstChildrenMode ||
                            this.props.showCenterMaterialSecondChildrenMode) &&
                        <div className="single-materials-center-list-child"
                             onClick={() => {
                                 this.calculateRandom();
                             }}>
                            <div className="single-materials-center-list-child-wrapper">
                                <img src={random} alt="random"/>
                                <h3>random</h3>
                            </div>
                        </div>
                    }

                    {/*first children center material*/}
                    {
                        (this.props.showCenterMaterialFirstChildrenMode && !this.props.showCenterMaterialSecondChildrenMode) &&
                        this.props.centerMaterialsFirstChildren.map((child) => {
                            return (
                                <div className="single-materials-center-list-child" key={child.term_id}
                                     onClick={() => this.showSecondChildren(child)}>
                                    <div className="single-materials-center-list-child-wrapper">
                                        <img src={child.thumbnail} alt="material-center-child"/>
                                        <h3>{child.name}</h3>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {/*second children center material*/}
                    {
                        this.props.showCenterMaterialSecondChildrenMode &&
                        this.props.centerMaterialsSecondChildren.map((child) => {
                            return (
                                <div className="single-materials-center-list-child" key={child.id} ref={child.name}
                                     onClick={() => {
                                         this.props.setCenterMaterialType(child);
                                     }}
                                     onMouseEnter={() => {
                                         this.currentMaterialHover(child);
                                     }}
                                     onMouseLeave={() => {
                                         this.props.setCurrentMaterialHover({});
                                         this.props.setCurrentMaterialHoverCoords({});
                                     }}>
                                    <div className="single-materials-center-list-child-wrapper">
                                        <img src={child.picture} alt="material-center-child"/>
                                        <h3>{child.code}</h3>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Fragment>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        showCenterMaterialFirstChildrenMode: state.showCenterMaterialFirstChildrenMode,
        showCenterMaterialSecondChildrenMode: state.showCenterMaterialSecondChildrenMode,

        centerMaterials: state.centerMaterials,
        centerMaterialsFirstChildren: state.centerMaterialsFirstChildren,
        centerMaterialsSecondChildren: state.centerMaterialsSecondChildren,

        currentMaterialHover: state.currentMaterialHover,
        currentMaterialHoverCoords: state.currentMaterialHoverCoords
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowCenterMaterialFirstChildrenMode: setShowCenterMaterialFirstChildrenMode,
            setShowCenterMaterialSecondChildrenMode: setShowCenterMaterialSecondChildrenMode,
            setCenterMaterialType: setCenterMaterialType,

            getCenterMaterials: getCenterMaterials,
            getCenterMaterialsFirstChildren: getCenterMaterialsFirstChildren,
            getCenterMaterialsSecondChildren: getCenterMaterialsSecondChildren,

            setCurrentMaterialHover: setCurrentMaterialHover,
            setCurrentMaterialHoverCoords: setCurrentMaterialHoverCoords,
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(CenterMaterial)