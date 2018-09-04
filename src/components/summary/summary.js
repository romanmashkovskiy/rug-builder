import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";



class Summary extends Component {


    render() {
        return (
            <div>
                summary screen
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {};
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({

        },
        dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Summary);