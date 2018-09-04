import {combineReducers} from 'redux';
import widthReducer from './width-reducer';
import lengthReducer from './length-reducer';
import borderReducer from './border-reducer';

import centreReducer from './centre-reducer';
import innerBorderReducer from './inner-border-reducer';
import outerBorderReducer from './outer-border-reducer';
import pipingReducer from './piping-reducer';

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
import setShowPipingMaterialModeReducer from './set-show-piping-material-mode';

import getInnerBorderMaterialsReducer from './get-inner-border-materials';
import getInnerBorderMaterialsFirstChildrenReducer from './get-inner-border-materials-first-children';
import getInnerBorderMaterialsSecondChildrenReducer from './get-inner-border-materials-second-children';

import getCenterMaterialsReducer from './get-center-materials';
import getCenterMaterialsFirstChildrenReducer from './get-center-materials-first-children';
import getCenterMaterialsSecondChildrenReducer from './get-center-materials-second-children';

import getOuterBorderMaterialsReducer from './get-outer-border-materials';
import getOuterBorderMaterialsFirstChildrenReducer from './get-outer-border-materials-first-children';
import getOuterBorderMaterialsSecondChildrenReducer from './get-outer-order-materials-second-children';

import getPipingMaterialsReducer from './get-piping-materials';

import setCurrentMaterialHoverReducer from './set-current-material-hover';
import setCurrentMaterialHoverCoordsReducer from './set-current-material-hover-coords';

import setRugCurrentViewReducer from './set-rug-current-view';

import currentZoomReducer from './zoom-rug-in-out';

import showRugCornerModeReducer from './show-rug-corner';

import rugPriceReducer from './get-rug-price';

import setShowLoginRegisterModalReducer from './set-show-login-register-mode';
import setShowLoginModalReducer from './set-show-login-mode';
import setShowRegisterModalReducer from './set-show-register-mode';
import setShowGuestModalReducer from './set-show-guest-mode';


const rootReducer = combineReducers({
    width: widthReducer,
    length: lengthReducer,
    border: borderReducer,

    centre: centreReducer,
    innerBorder: innerBorderReducer,
    outerBorder: outerBorderReducer,
    piping: pipingReducer,

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

    showPipingMaterialMode: setShowPipingMaterialModeReducer,

    innerBorderMaterials: getInnerBorderMaterialsReducer,
    innerBorderMaterialsFirstChildren: getInnerBorderMaterialsFirstChildrenReducer,
    innerBorderMaterialsSecondChildren: getInnerBorderMaterialsSecondChildrenReducer,

    centerMaterials: getCenterMaterialsReducer,
    centerMaterialsFirstChildren: getCenterMaterialsFirstChildrenReducer,
    centerMaterialsSecondChildren: getCenterMaterialsSecondChildrenReducer,

    outerBorderMaterials: getOuterBorderMaterialsReducer,
    outerBorderMaterialsFirstChildren: getOuterBorderMaterialsFirstChildrenReducer,
    outerBorderMaterialsSecondChildren: getOuterBorderMaterialsSecondChildrenReducer,

    pipingMaterials: getPipingMaterialsReducer,

    currentMaterialHover: setCurrentMaterialHoverReducer,
    currentMaterialHoverCoords: setCurrentMaterialHoverCoordsReducer,

    currentRugView: setRugCurrentViewReducer,

    currentZoom: currentZoomReducer,

    showRugCornerMode: showRugCornerModeReducer,

    rugPrice: rugPriceReducer,

    showLoginRegisterModal: setShowLoginRegisterModalReducer,
    showLoginModal: setShowLoginModalReducer,
    showRegisterModal: setShowRegisterModalReducer,
    showGuestModal: setShowGuestModalReducer
});

export default rootReducer;