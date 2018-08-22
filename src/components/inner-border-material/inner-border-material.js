import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    setShowInnerBorderMaterialFirstChildrenMode,
    setShowInnerBorderMaterialSecondChildrenMode,
    setInnerBorderMaterialType,

    getInnerBorderMaterials,
    getInnerBorderMaterialsFirstChildren,
    getInnerBorderMaterialsSecondChildren,

    setCurrentMaterialHover,
    setCurrentMaterialHoverCoords
} from "../../actions";

import random from './images/random-icon.svg';

//styles from center-material.css

class InnerBorderMaterial extends Component {

    componentDidMount() {
        this.props.getInnerBorderMaterials();
    }

    showFirstChildren(parent) {
        this.props.setShowInnerBorderMaterialFirstChildrenMode(true);
        this.props.getInnerBorderMaterialsFirstChildren(parent.name);
    }

    showSecondChildren(parent) {
        this.props.setShowInnerBorderMaterialSecondChildrenMode(true);
        this.props.getInnerBorderMaterialsSecondChildren(parent.slug);
    }

    calculateRandom() {
        if (this.props.showInnerBorderMaterialSecondChildrenMode) {
            const length = this.props.outerBorderMaterialsSecondChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.props.setInnerBorderMaterialType(this.props.outerBorderMaterialsSecondChildren[randomIndex]);
        } else {
            const length = this.props.innerBorderMaterialsFirstChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.showSecondChildren(this.props.innerBorderMaterialsFirstChildren[randomIndex]);
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

                    {/*parent inner border material*/}
                    {
                        !this.props.showInnerBorderMaterialFirstChildrenMode &&
                        this.props.innerBorderMaterials.map((material) => {
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

                    {/*random children inner border material*/}
                    {
                        (this.props.showInnerBorderMaterialFirstChildrenMode ||
                            this.props.showInnerBorderMaterialSecondChildrenMode) &&
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

                    {/*first children inner border material*/}
                    {
                        (this.props.showInnerBorderMaterialFirstChildrenMode && !this.props.showInnerBorderMaterialSecondChildrenMode) &&
                        this.props.innerBorderMaterialsFirstChildren.map((child) => {
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

                    {/*second children inner border material*/}
                    {
                        this.props.showInnerBorderMaterialSecondChildrenMode &&
                        this.props.innerBorderMaterialsSecondChildren.map((child) => {
                            return (
                                <div className="single-materials-center-list-child" key={child.id} ref={child.name}
                                     onClick={() => {
                                         this.props.setInnerBorderMaterialType(child)
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
        showInnerBorderMaterialFirstChildrenMode: state.showInnerBorderMaterialFirstChildrenMode,
        showInnerBorderMaterialSecondChildrenMode: state.showInnerBorderMaterialSecondChildrenMode,

        innerBorderMaterials: state.innerBorderMaterials,
        innerBorderMaterialsFirstChildren: state.innerBorderMaterialsFirstChildren,
        innerBorderMaterialsSecondChildren: state.innerBorderMaterialsSecondChildren,

        currentMaterialHover: state.currentMaterialHover,
        currentMaterialHoverCoords: state.currentMaterialHoverCoords
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowInnerBorderMaterialFirstChildrenMode: setShowInnerBorderMaterialFirstChildrenMode,
            setShowInnerBorderMaterialSecondChildrenMode: setShowInnerBorderMaterialSecondChildrenMode,
            setInnerBorderMaterialType: setInnerBorderMaterialType,

            getInnerBorderMaterials: getInnerBorderMaterials,
            getInnerBorderMaterialsFirstChildren: getInnerBorderMaterialsFirstChildren,
            getInnerBorderMaterialsSecondChildren: getInnerBorderMaterialsSecondChildren,

            setCurrentMaterialHover: setCurrentMaterialHover,
            setCurrentMaterialHoverCoords: setCurrentMaterialHoverCoords
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(InnerBorderMaterial);