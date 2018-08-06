import {combineReducers} from 'redux';
import widthReducer from './width-reducer';
import lengthReducer from './length-reducer';
import borderReducer from './border-reducer';
import centreReducer from './centre-reducer';
import innerBorderReducer from './inner-border-reducer';
import editDimensionsBorder from './edit-dimensions-border-reducer';

const rootReducer = combineReducers({
    width: widthReducer,
    length: lengthReducer,
    border: borderReducer,
    centre: centreReducer,
    innerBorder: innerBorderReducer,
    editDimensionsBorderMode: editDimensionsBorder
});

export default rootReducer;