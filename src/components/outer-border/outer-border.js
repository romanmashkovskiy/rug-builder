import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    setShowOuterBorderMaterialFirstChildrenMode,
    setShowOuterBorderMaterialSecondChildrenMode,
    setOuterBorderMaterialType,
    getOuterBorderMaterials
} from "../../actions";

import random from './images/random-icon.svg';

//styles from center-material.css

class OuterBorderMaterial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFirstChildren: [],
            currentSecondChildren: []
        }
    }

    componentDidMount() {
        this.props.getOuterBorderMaterials();
    }

    showFirstChildren(children) {
        this.props.setShowOuterBorderMaterialFirstChildrenMode(true);
        this.setState({
            currentFirstChildren: children
        });
    }

    showSecondChildren(children) {
        this.props.setShowOuterBorderMaterialSecondChildrenMode(true);
        this.setState({
            currentSecondChildren: children
        });
    }

    calculateRandom() {
        if (this.props.showOuterBorderMaterialSecondChildrenMode) {
            const length = this.state.currentSecondChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.props.setOuterBorderMaterialType(this.state.currentSecondChildren[randomIndex]);
        } else {
            const length = this.state.currentFirstChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.showSecondChildren(this.state.currentFirstChildren[0].children);
        }
    }

    render() {

        return (
            <div className="materials-center-list">

                {/*parent outer border material*/}
                {
                    !this.props.showOuterBorderMaterialFirstChildrenMode &&
                    this.props.outerBorderMaterials.map((material) => {
                        return (
                            <div className="single-materials-center-list" key={material.id}
                                 onClick={() => this.showFirstChildren(material.children)}>
                                <div>
                                    <img src={material.src} alt="type-material-center"/>
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
                    this.state.currentFirstChildren.map((child) => {
                        return (
                            <div className="single-materials-center-list-child" key={child.id}
                                 onClick={() => this.showSecondChildren((child.children))}>
                                <div className="single-materials-center-list-child-wrapper">
                                    <img src={child.src} alt="material-center-child"/>
                                    <h3>{child.name}</h3>
                                </div>
                            </div>
                        )
                    })
                }

                {/*second children outer border material*/}
                {
                    this.props.showOuterBorderMaterialSecondChildrenMode &&
                    this.state.currentSecondChildren.map((child) => {
                        return (
                            <div className="single-materials-center-list-child" key={child.id}
                                 onClick={() => {
                                     this.props.setOuterBorderMaterialType(child)
                                 }}>
                                <div className="single-materials-center-list-child-wrapper">
                                    <img src={child.src} alt="material-center-child"/>
                                    <h3>{child.name}</h3>
                                </div>
                            </div>
                        )
                    })
                }


            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        showOuterBorderMaterialFirstChildrenMode: state.showOuterBorderMaterialFirstChildrenMode,
        showOuterBorderMaterialSecondChildrenMode: state.showOuterBorderMaterialSecondChildrenMode,
        outerBorderMaterials: state.outerBorderMaterials
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowOuterBorderMaterialFirstChildrenMode: setShowOuterBorderMaterialFirstChildrenMode,
            setShowOuterBorderMaterialSecondChildrenMode: setShowOuterBorderMaterialSecondChildrenMode,
            setOuterBorderMaterialType: setOuterBorderMaterialType,
            getOuterBorderMaterials: getOuterBorderMaterials
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(OuterBorderMaterial);