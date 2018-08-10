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

export const setEditDimensionsMode = (mode) => {
    return {
        type: actions.SET_EDIT_DIMENSIONS_MODE,
        payload: mode
    }
};

export const setEditBorderMode = (mode) => {
    return {
        type: actions.SET_EDIT_BORDER_MODE,
        payload: mode
    }
};

export const setShowCenterMaterialMode = (mode) => {
    return {
        type: actions.SHOW_CENTER_MATERIAL_MODE,
        payload: mode
    }
};

export const setShowCenterMaterialFirstChildrenMode = (mode) => {
    return {
        type: actions.SHOW_CENTER_MATERIAL_FIRST_CHILDREN_MODE,
        payload: mode
    }
};

export const setShowCenterMaterialSecondChildrenMode = (mode) => {
    return {
        type: actions.SHOW_CENTER_MATERIAL_SECOND_CHILDREN_MODE,
        payload: mode
    }
};

export const setShowInnerBorderMaterialMode = (mode) => {
    return {
        type: actions.SHOW_INNER_BORDER_MATERIAL_MODE,
        payload: mode
    }
};

export const setShowInnerBorderMaterialFirstChildrenMode = (mode) => {
    return {
        type: actions.SHOW_INNER_BORDER_MATERIAL_FIRST_CHILDREN_MODE,
        payload: mode
    }
};

export const setShowInnerBorderMaterialSecondChildrenMode = (mode) => {
    return {
        type: actions.SHOW_INNER_BORDER_MATERIAL_SECOND_CHILDREN_MODE,
        payload: mode
    }
};

export const setCenterMaterialType = (type) => {
    return {
        type: actions.SET_CENTER_MATERIAL_TYPE,
        payload: type
    }
};

export const setInnerBorderMaterialType = (type) => {
    return {
        type: actions.SET_INNER_BORDER_MATERIAL_TYPE,
        payload: type
    }
};
