import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    setShowOuterBorderMaterialFirstChildrenMode,
    setShowOuterBorderMaterialSecondChildrenMode,
    setOuterBorderMaterialType,

    getOuterBorderMaterials,
    getOuterBorderMaterialsFirstChildren,
    getOuterBorderMaterialsSecondChildren,

    setCurrentMaterialHover,
    setCurrentMaterialHoverCoords
} from "../../actions";

import random from './images/random-icon.svg';

//styles from center-material.css

class OuterBorderMaterial extends Component {

    componentDidMount() {
        this.props.getOuterBorderMaterials();
    }

    showFirstChildren(parent) {
        this.props.setShowOuterBorderMaterialFirstChildrenMode(true);
        this.props.getOuterBorderMaterialsFirstChildren(parent.name);
    }

    showSecondChildren(parent) {
        this.props.setShowOuterBorderMaterialSecondChildrenMode(true);
        this.props.getOuterBorderMaterialsSecondChildren(parent.slug);
    }

    calculateRandom() {
        if (this.props.showOuterBorderMaterialSecondChildrenMode) {
            const length = this.props.outerBorderMaterialsSecondChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.props.setOuterBorderMaterialType(this.props.outerBorderMaterialsSecondChildren[randomIndex]);
        } else {
            const length = this.props.outerBorderMaterialsFirstChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.showSecondChildren(this.props.outerBorderMaterialsFirstChildren[randomIndex]);
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
                    this.props.currentMaterialHover.name &&
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

                    {/*parent outer border material*/}
                    {
                        !this.props.showOuterBorderMaterialFirstChildrenMode &&
                        this.props.outerBorderMaterials.map((material) => {
                            return (
                                <div className="single-materials-center-list" key={material.term_id}
                                     onClick={() => this.showFirstChildren(material)}>
                                    <div>
                                        <img src={material.thumb} alt="type-material-center"/>
                                        <h3>{material.name}</h3>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {/*random children outer border material*/}
                    {
                        (this.props.showOuterBorderMaterialFirstChildrenMode ||
                            this.props.showOuterBorderMaterialSecondChildrenMode) &&
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

                    {/*first children outer border material*/}
                    {
                        (this.props.showOuterBorderMaterialFirstChildrenMode && !this.props.showOuterBorderMaterialSecondChildrenMode) &&
                        this.props.outerBorderMaterialsFirstChildren.map((child) => {
                            return (
                                <div className="single-materials-center-list-child" key={child.term_id}
                                     onClick={() => this.showSecondChildren((child))}>
                                    <div className="single-materials-center-list-child-wrapper">
                                        <img src={child.thumbnail} alt="material-center-child"/>
                                        <h3>{child.name}</h3>
                                    </div>
                                </div>
                            )
                        })
                    }

                    {/*second children outer border material*/}
                    {
                        this.props.showOuterBorderMaterialSecondChildrenMode &&
                        this.props.outerBorderMaterialsSecondChildren.map((child) => {
                            return (
                                <div className="single-materials-center-list-child" key={child.id} ref={child.name}
                                     onClick={() => {
                                         this.props.setOuterBorderMaterialType(child)
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
        showOuterBorderMaterialFirstChildrenMode: state.showOuterBorderMaterialFirstChildrenMode,
        showOuterBorderMaterialSecondChildrenMode: state.showOuterBorderMaterialSecondChildrenMode,

        outerBorderMaterials: state.outerBorderMaterials,
        outerBorderMaterialsFirstChildren: state.outerBorderMaterialsFirstChildren,
        outerBorderMaterialsSecondChildren: state.outerBorderMaterialsSecondChildren,

        currentMaterialHover: state.currentMaterialHover,
        currentMaterialHoverCoords: state.currentMaterialHoverCoords
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowOuterBorderMaterialFirstChildrenMode: setShowOuterBorderMaterialFirstChildrenMode,
            setShowOuterBorderMaterialSecondChildrenMode: setShowOuterBorderMaterialSecondChildrenMode,
            setOuterBorderMaterialType: setOuterBorderMaterialType,

            getOuterBorderMaterials: getOuterBorderMaterials,
            getOuterBorderMaterialsFirstChildren: getOuterBorderMaterialsFirstChildren,
            getOuterBorderMaterialsSecondChildren: getOuterBorderMaterialsSecondChildren,

            setCurrentMaterialHover: setCurrentMaterialHover,
            setCurrentMaterialHoverCoords: setCurrentMaterialHoverCoords
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(OuterBorderMaterial);