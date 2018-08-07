import {combineReducers} from 'redux';
import widthReducer from './width-reducer';
import lengthReducer from './length-reducer';
import borderReducer from './border-reducer';
import centreReducer from './centre-reducer';            //change action
import innerBorderReducer from './inner-border-reducer'; //change action
import editDimensions from './edit-dimensions-reducer';
import editBorder from './edit-border-mode';

const rootReducer = combineReducers({
    width: widthReducer,
    length: lengthReducer,
    border: borderReducer,
    centre: centreReducer,
    innerBorder: innerBorderReducer,
    editDimensionsMode: editDimensions,
    editBorderMode: editBorder
});

export default rootReducer;