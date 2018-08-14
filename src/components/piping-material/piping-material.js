import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    setPipingMaterialType,
    getPipingMaterials,
    setCurrentMaterialHover,
    setCurrentMaterialHoverCoords
} from "../../actions";

import random from './images/random-icon.svg';

//styles from center-material.css


class PipingMaterial extends Component {

    componentDidMount() {
        this.props.getPipingMaterials();
    }

    calculateRandom() {
        const length = this.props.pipingMaterials.length;
        const randomIndex = Math.round(Math.random() * (length - 1));
        this.props.setPipingMaterialType(this.props.pipingMaterials[randomIndex]);
    }

    currentMaterialHover(material) {
        this.props.setCurrentMaterialHover(material);
        const {left, top, width} = this.refs[material.name].getBoundingClientRect();
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
                        <img src={this.props.currentMaterialHover.src} alt="material-center-child"/>
                        <h3>{this.props.currentMaterialHover.name}</h3>
                    </div>
                }
                <div className="materials-center-list">

                    {/*piping material*/}


                    <div className="single-materials-center-list-child"
                         onClick={() => {
                             this.calculateRandom();
                         }}>
                        <div className="single-materials-center-list-child-wrapper">
                            <img src={random} alt="random"/>
                            <h3>random</h3>
                        </div>
                    </div>

                    {
                        this.props.pipingMaterials.map((material) => {
                            return (
                                <div className="single-materials-center-list-child" key={material.id}
                                     ref={material.name}
                                     onClick={() => {
                                         this.props.setPipingMaterialType(material);
                                     }}
                                     onMouseEnter={() => {
                                         this.currentMaterialHover(material);
                                     }}
                                     onMouseLeave={() => {
                                         this.props.setCurrentMaterialHover({});
                                         this.props.setCurrentMaterialHoverCoords({});
                                     }}>
                                    <div className="single-materials-center-list-child-wrapper">
                                        <img src={material.src} alt="material-center-child"/>
                                        <h3>{material.name}</h3>
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
        pipingMaterials: state.pipingMaterials,
        currentMaterialHover: state.currentMaterialHover,
        currentMaterialHoverCoords: state.currentMaterialHoverCoords
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setPipingMaterialType: setPipingMaterialType,
            getPipingMaterials: getPipingMaterials,
            setCurrentMaterialHover: setCurrentMaterialHover,
            setCurrentMaterialHoverCoords: setCurrentMaterialHoverCoords
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(PipingMaterial)