import * as actions from './action-types';

export const setLength = (length) => {
    return {
        type: actions.SET_LENGTH,
        payload: length
    }
};

export const setWidth = (width) => {
    return {
        type: actions.SET_WIDTH,
        payload: width
    }
};

export const setBorderType = (border) => {
    return {
        type: actions.SET_BORDER_TYPE,
        payload: border
    }
};

export const setEditDimensionsBorderMode = (mode) => {
    return {
        type: actions.SET_EDIT_DIMENSIONS_BORDER_MODE,
        payload: mode
    }
};

