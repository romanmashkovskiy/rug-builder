import * as actions from '../actions/action-types'


let initZoom = 2;

const zoomIn = (currentCameraZoom) => {

    const newZoom = currentCameraZoom + 1;
    if ( newZoom > 10 ) {
        return 10;
    }
    return newZoom;
};

const zoomOut = (currentCameraZoom) => {

    const newZoom = currentCameraZoom - 1;
    if ( newZoom < 1 ) {
        return 1;
    }
    return newZoom;
};

export default (state = initZoom, action) => {
    switch (action.type) {
        case actions.ZOOM_RUG_IN:
            return zoomIn(state);
        case actions.ZOOM_RUG_OUT:
            return zoomOut(state);
        default:
            return state;
    }
}