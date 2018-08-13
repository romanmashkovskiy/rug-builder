import {combineReducers} from 'redux';
import widthReducer from './width-reducer';
import lengthReducer from './length-reducer';
import borderReducer from './border-reducer';
import centreReducer from './centre-reducer';
import innerBorderReducer from './inner-border-reducer';
import outerBorderReducer from './outer-border-reducer';

import editDimensions from './edit-dimensions-mode-reducer';
import editBorder from './edit-border-mode-reducer';

import setShowCenterMaterialModeReducer from './set-show-center-material-mode';
import setShowCenterMaterialFirstChildrenModeReducer from './set-show-center-material-first-children-mode';
import setShowCenterMaterialSecondChildrenModeReducer from './set-show-center-material-second-children-mode';

import setShowInnerBorderMaterialModeReducer from './set-show-inner-border-material-mode';
import setShowInnerBorderMaterialFirstChildrenModeReducer from './set-show-inner-border-material-first-children-mode';
import setShowInnerBorderMaterialSecondChildrenModeReducer from './set-show-inner-border-material-second-children-mode';

import setShowOuterBorderMaterialModeReducer from './set-show-outer-border-material-mode';
import setShowOuterBorderMaterialFirstChildrenModeReducer from './set-show-outer-border-material-first-children-mode';
import setShowOuterBorderMaterialSecondChildrenModeReducer from './set-show-outer-border-material-second-children-mode';

import getInnerBorderMaterialsReducer from './get-inner-border-materials';
import getCenterMaterialsReducer from './get-center-materials';
import getOuterBorderMaterialsReducer from './get-outer-border-materials';
import setCurrentMaterialHoverReducer from './set-current-material-hover';
import setCurrentMaterialHoverCoordsReducer from './set-current-material-hover-coords';


const rootReducer = combineReducers({
    width: widthReducer,
    length: lengthReducer,
    border: borderReducer,
    centre: centreReducer,
    innerBorder: innerBorderReducer,
    outerBorder: outerBorderReducer,
    editDimensionsMode: editDimensions,
    editBorderMode: editBorder,
    showCenterMaterialMode: setShowCenterMaterialModeReducer,
    showCenterMaterialFirstChildrenMode: setShowCenterMaterialFirstChildrenModeReducer,
    showCenterMaterialSecondChildrenMode: setShowCenterMaterialSecondChildrenModeReducer,
    showInnerBorderMaterialMode: setShowInnerBorderMaterialModeReducer,
    showInnerBorderMaterialFirstChildrenMode: setShowInnerBorderMaterialFirstChildrenModeReducer,
    showInnerBorderMaterialSecondChildrenMode: setShowInnerBorderMaterialSecondChildrenModeReducer,
    showOuterBorderMaterialMode: setShowOuterBorderMaterialModeReducer,
    showOuterBorderMaterialFirstChildrenMode: setShowOuterBorderMaterialFirstChildrenModeReducer,
    showOuterBorderMaterialSecondChildrenMode: setShowOuterBorderMaterialSecondChildrenModeReducer,
    innerBorderMaterials: getInnerBorderMaterialsReducer,
    centerMaterials: getCenterMaterialsReducer,
    currentMaterialHover: setCurrentMaterialHoverReducer,
    currentMaterialHoverCoords: setCurrentMaterialHoverCoordsReducer,
    outerBorderMaterials: getOuterBorderMaterialsReducer
});

export default rootReducer;