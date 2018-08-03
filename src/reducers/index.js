import {combineReducers} from 'redux';
import widthReducer from './width-reducer';
import lengthReducer from './length-reducer';
import borderReducer from './border-reducer';

const rootReducer = combineReducers({
    width: widthReducer,
    length: lengthReducer,
    border: borderReducer
});

export default rootReducer;