import {combineReducers} from 'redux';
import widthReducer from './width-reducer';
import lengthReducer from './length-reducer';
import borderReducer from './border-reducer';
import centreReducer from './centre-reducer';
import innerBorderReducer from './inner-border-reducer';
import editDimensions from './edit-dimensions-mode-reducer';
import editBorder from './edit-border-mode-reducer';
import setShowCenterMaterialModeReducer from './set-show-center-material-mode';
import setShowCenterMaterialFirstChildrenModeReducer from './set-show-center-material-first-children-mode';
import setShowCenterMaterialSecondChildrenModeReducer from './set-show-center-material-second-children-mode';
import setShowInnerBorderMaterialModeReducer from './set-show-inner-border-material-mode';
import setShowInnerBorderMaterialFirstChildrenModeReducer from './set-show-inner-border-material-first-children-mode';
import setShowInnerBorderMaterialSecondChildrenModeReducer from './set-show-inner-border-material-second-children-mode';

const rootReducer = combineReducers({
    width: widthReducer,
    length: lengthReducer,
    border: borderReducer,
    centre: centreReducer,
    innerBorder: innerBorderReducer,
    editDimensionsMode: editDimensions,
    editBorderMode: editBorder,
    showCenterMaterialMode: setShowCenterMaterialModeReducer,
    showCenterMaterialFirstChildrenMode: setShowCenterMaterialFirstChildrenModeReducer,
    showCenterMaterialSecondChildrenMode: setShowCenterMaterialSecondChildrenModeReducer,
    showInnerBorderMaterialMode: setShowInnerBorderMaterialModeReducer,
    showInnerBorderMaterialFirstChildrenMode: setShowInnerBorderMaterialFirstChildrenModeReducer,
    showInnerBorderMaterialSecondChildrenMode: setShowInnerBorderMaterialSecondChildrenModeReducer
});

export default rootReducer;