import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {
    setShowRandomiseAllMode
} from "../../actions";

import './randomise-all-modal.css';

import logo from './images/logo.png';
import exit from './images/exit.svg';

class RandomiseAllModal extends Component {

    calculateRandom() {
        const lengthCenter = this.props.centerMaterialsSecondChildren.length;
        const randomIndexCenter = Math.round(Math.random() * (lengthCenter - 1));
        this.props.setCenterMaterialType(this.props.centerMaterialsSecondChildren[randomIndexCenter]);

        const lengthOuterBorder = this.props.outerBorderMaterialsSecondChildren.length;
        const randomIndexOuterBorder = Math.round(Math.random() * (lengthOuterBorder - 1));
        this.props.setOuterBorderMaterialType(this.props.outerBorderMaterialsSecondChildren[randomIndexOuterBorder]);

        const lengthInnerBorder = this.props.outerBorderMaterialsSecondChildren.length;
        const randomIndexInnerBorder = Math.round(Math.random() * (lengthInnerBorder - 1));
        this.props.setInnerBorderMaterialType(this.props.outerBorderMaterialsSecondChildren[randomIndexInnerBorder]);

        const lengthPiping = this.props.pipingMaterials.length;
        const randomIndexPiping = Math.round(Math.random() * (lengthPiping - 1));
        this.props.setPipingMaterialType(this.props.pipingMaterials[randomIndexPiping]);
    }


    render() {
        return (
            <div className="container-randomise-all-modal">
                <div className="cover-div"/>
                <div className="randomise-all-modal">
                    <div className="logo-randomise-all-modal">
                        <img src={logo} alt="logo"/>
                    </div>
                    <div className="exit-randomise-all-modal" onClick={() => {
                        this.props.setShowRandomiseAllMode(false);
                    }}>
                        <img src={exit} alt="exit"/>
                    </div>
                    <div className="message-randomise-all-modal">
                        This will randomise your rug selections, this cannot be undone, are you sure you’d like to
                        create a randomised rug?
                    </div>
                    <div>
                        <button className="yes-btn-randomise-all-modal">
                            YES
                        </button>
                        <button className="no-btn-randomise-all-modal" onClick={() => {
                            this.props.setShowRandomiseAllMode(false);
                        }}>
                            NO
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {};
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowRandomiseAllMode: setShowRandomiseAllMode
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(RandomiseAllModal);