import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

import {
    setShowInnerBorderMaterialFirstChildrenMode,
    setShowInnerBorderMaterialSecondChildrenMode,
    setInnerBorderMaterialType
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

    render() {
        const materials = [
            {
                id: 1,
                name: "cotton",
                src: "http://cdn.crucial-trading.com/uploads/20161114130802/cotton-icon-1.svg",
                children: [
                    {
                        id: 1,
                        name: "Cotton Chenille",
                        src: "http://cdn.crucial-trading.com/uploads/20170131113640/Cotton_Chenille_CCN1_1223_small.jpg",
                        children: [
                            {
                                id: 1,
                                name: "CCN1",
                                src: "http://cdn.crucial-trading.com/uploads/20161114134225/GPC20238437-150x150.jpg"
                            },
                            {
                                id: 2,
                                name: "CCN10",
                                src: "http://cdn.crucial-trading.com/uploads/20161114172558/GPC20238445-150x150.jpg"
                            },
                            {
                                id: 3,
                                name: "CCN12",
                                src: "http://cdn.crucial-trading.com/uploads/20161114172602/GPC20238453-150x150.jpg"
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: "Cotton Herrinbone",
                        src: "http://cdn.crucial-trading.com/uploads/20170202104646/Cotton_Herringbone_C33_1327_small1.jpg"
                    },
                    {
                        id: 3,
                        name: "Cotton Picallo",
                        src: "http://cdn.crucial-trading.com/uploads/20170202110958/Cotton_Picallo_CP2_1298_small.jpg"
                    },
                ]
            },
            {
                id: 2,
                name: "leather",
                src: "http://cdn.crucial-trading.com/uploads/20161114130816/leather-icon-1.svg"
            },
            {
                id: 3,
                name: "linen",
                src: "http://cdn.crucial-trading.com/uploads/20161114130818/linen-icon-1.svg"
            },
            {
                id: 4,
                name: "suede",
                src: "http://cdn.crucial-trading.com/uploads/20161114130819/suede-icon-1.svg"
            }
        ];

        return (
            <div className="materials-center-list">

                {/*parent inner border material*/}
                {
                    !this.props.showInnerBorderMaterialFirstChildrenMode &&
                    materials.map((material) => {
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
                    <div className="single-materials-center-list-child">
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
                                 onClick={() => {this.props.setInnerBorderMaterialType(child.name)}}>
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
    };
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
            setShowInnerBorderMaterialFirstChildrenMode: setShowInnerBorderMaterialFirstChildrenMode,
            setShowInnerBorderMaterialSecondChildrenMode: setShowInnerBorderMaterialSecondChildrenMode,
            setInnerBorderMaterialType: setInnerBorderMaterialType
        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(InnerBorderMaterial);