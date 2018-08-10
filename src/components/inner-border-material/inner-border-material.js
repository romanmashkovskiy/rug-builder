import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    setShowInnerBorderMaterialFirstChildrenMode,
    setShowInnerBorderMaterialSecondChildrenMode,
    setInnerBorderMaterialType,
    getInnerBorderMaterials
} from "../../actions";

import random from './images/random-icon.svg';

//styles from center-material.css

class InnerBorderMaterial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFirstChildren: [],
            currentSecondChildren: []
        }
    }

    componentDidMount() {
        this.props.getInnerBorderMaterials();
    }

    showFirstChildren(children) {
        this.props.setShowInnerBorderMaterialFirstChildrenMode(true);
        this.setState({
            currentFirstChildren: children
        });
    }

    showSecondChildren(children) {
        this.props.setShowInnerBorderMaterialSecondChildrenMode(true);
        this.setState({
            currentSecondChildren: children
        });
    }

    calculateRandom() {
        if (this.props.showInnerBorderMaterialSecondChildrenMode) {
            const length = this.state.currentSecondChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.props.setInnerBorderMaterialType(this.state.currentSecondChildren[randomIndex]);
        } else {
            const length = this.state.currentFirstChildren.length;
            const randomIndex = Math.round(Math.random() * (length - 1));
            this.showSecondChildren(this.state.currentFirstChildren[0].children);
        }
    }

    render() {

        return (
            <div className="materials-center-list">

                {/*parent inner border material*/}
                {
                    !this.props.showInnerBorderMaterialFirstChildrenMode &&
                    this.props.innerBorderMaterials.map((material) => {
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

                {/*second children inner border material*/}
                {
                    this.props.showInnerBorderMaterialSecondChildrenMode &&
                    this.state.currentSecondChildren.map((child) => {
                        return (
                            <div className="single-materials-center-list-child" key={child.id}
                                 onClick={() => {
                                     this.props.setInnerBorderMaterialType(child)
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
        showInnerBorderMaterialFirstChildrenMode: state.showInnerBorderMaterialFirstChildrenMode,
        showInnerBorderMaterialSecondChildrenMode: state.showInnerBorderMaterialSecondChildrenMode,
        innerBorderMaterials: state.innerBorderMaterials
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowInnerBorderMaterialFirstChildrenMode: setShowInnerBorderMaterialFirstChildrenMode,
            setShowInnerBorderMaterialSecondChildrenMode: setShowInnerBorderMaterialSecondChildrenMode,
            setInnerBorderMaterialType: setInnerBorderMaterialType,
            getInnerBorderMaterials: getInnerBorderMaterials
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(InnerBorderMaterial);