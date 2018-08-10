import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    setShowCenterMaterialFirstChildrenMode,
    setShowCenterMaterialSecondChildrenMode,
    setCenterMaterialType,
    getCenterMaterials
} from "../../actions";

import random from './images/random-icon.svg';


import './center-material.css';


class CenterMaterial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFirstChildren: [],
            currentSecondChildren: []
        }
    }

    componentDidMount(){
        this.props.getCenterMaterials();
    }

    showFirstChildren(children) {
        this.props.setShowCenterMaterialFirstChildrenMode(true);
        this.setState({
            currentFirstChildren: children
        });
    }

    showSecondChildren(children) {
        this.props.setShowCenterMaterialSecondChildrenMode(true);
        this.setState({
            currentSecondChildren: children
        });
    }

    render() {

        return (
            <div className="materials-center-list">

                {/*parent center material*/}
                {
                    !this.props.showCenterMaterialFirstChildrenMode &&
                    this.props.centerMaterials.map((material) => {
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

                {/*random children center material*/}
                {
                    (this.props.showCenterMaterialFirstChildrenMode ||
                        this.props.showCenterMaterialSecondChildrenMode) &&
                    <div className="single-materials-center-list-child">
                        <div className="single-materials-center-list-child-wrapper">
                            <img src={random} alt="random"/>
                            <h3>random</h3>
                        </div>
                    </div>
                }

                {/*first children center material*/}
                {
                    (this.props.showCenterMaterialFirstChildrenMode && !this.props.showCenterMaterialSecondChildrenMode) &&
                    this.state.currentFirstChildren.map((child) => {
                        return (
                            <div className="single-materials-center-list-child" key={child.id}
                                 onClick={() => this.showSecondChildren(child.children)}>
                                <div className="single-materials-center-list-child-wrapper">
                                    <img src={child.src} alt="material-center-child"/>
                                    <h3>{child.name}</h3>
                                </div>
                            </div>
                        )
                    })
                }

                {/*second children center material*/}
                {
                    this.props.showCenterMaterialSecondChildrenMode &&
                    this.state.currentSecondChildren.map((child) => {
                        return (
                            <div className="single-materials-center-list-child" key={child.id}
                                 onClick={() => {this.props.setCenterMaterialType(child.name)}}>
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
        showCenterMaterialFirstChildrenMode: state.showCenterMaterialFirstChildrenMode,
        showCenterMaterialSecondChildrenMode: state.showCenterMaterialSecondChildrenMode,
        centerMaterials: state.centerMaterials
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowCenterMaterialFirstChildrenMode: setShowCenterMaterialFirstChildrenMode,
            setShowCenterMaterialSecondChildrenMode: setShowCenterMaterialSecondChildrenMode,
            setCenterMaterialType: setCenterMaterialType,
            getCenterMaterials: getCenterMaterials
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(CenterMaterial)