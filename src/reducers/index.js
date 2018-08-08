import {combineReducers} from 'redux';
import widthReducer from './width-reducer';
import lengthReducer from './length-reducer';
import borderReducer from './border-reducer';
import centreReducer from './centre-reducer';            //change action
import innerBorderReducer from './inner-border-reducer'; //change action
import editDimensions from './edit-dimensions-mode-reducer';
import editBorder from './edit-border-mode-reducer';
import setShowCenterMaterialModeReducer from './set-show-center-material-mode';
import setShowCenterMaterialChildrenModeReducer from './set-show-center-material-children-mode';
import setShowInnerBorderMaterialModeReducer from './set-show-inner-border-material-mode';
import setShowInnerBorderMaterialChildrenModeReducer from './set-show-inner-border-material-children-mode';

const rootReducer = combineReducers({
    width: widthReducer,
    length: lengthReducer,
    border: borderReducer,
    centre: centreReducer,
    innerBorder: innerBorderReducer,
    editDimensionsMode: editDimensions,
    editBorderMode: editBorder,
    showCenterMaterialMode: setShowCenterMaterialModeReducer,
    showCenterMaterialChildrenMode: setShowCenterMaterialChildrenModeReducer,
    showInnerBorderMaterialMode: setShowInnerBorderMaterialModeReducer,
    showInnerBorderChildrenMaterialMode: setShowInnerBorderMaterialChildrenModeReducer
});

export default rootReducer;