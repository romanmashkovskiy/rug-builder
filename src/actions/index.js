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


export const setShowOuterBorderMaterialMode = (mode) => {
    return {
        type: actions.SHOW_OUTER_BORDER_MATERIAL_MODE,
        payload: mode
    }
};

export const setShowOuterBorderMaterialFirstChildrenMode = (mode) => {
    return {
        type: actions.SHOW_OUTER_BORDER_MATERIAL_FIRST_CHILDREN_MODE,
        payload: mode
    }
};

export const setShowOuterBorderMaterialSecondChildrenMode = (mode) => {
    return {
        type: actions.SHOW_OUTER_BORDER_MATERIAL_SECOND_CHILDREN_MODE,
        payload: mode
    }
};

export const setShowPipingMaterialMode = (mode) => {
    return {
        type: actions.SHOW_PIPING_MATERIAL_MODE,
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

export const setOuterBorderMaterialType = (type) => {
    return {
        type: actions.SET_OUTER_BORDER_MATERIAL_TYPE,
        payload: type
    }
};

export const setPipingMaterialType = (type) => {
    return {
        type: actions.SET_PIPING_MATERIAL_TYPE,
        payload: type
    }
};



export const getCenterMaterials = () => {
    return {
        type: actions.GET_MATERIALS_CENTER
    }
};

export const getInnerBorderMaterials = () => {
    return {
        type: actions.GET_MATERIALS_INNER_BORDER
    }
};

export const getOuterBorderMaterials = () => {
    return {
        type: actions.GET_MATERIALS_OUTER_BORDER
    }
};

export const getPipingMaterials = () => {
    return {
        type: actions.GET_MATERIALS_PIPING
    }
};

export const setCurrentMaterialHover = (material) => {
    return {
        type: actions.SET_CURRENT_MATERIAL_HOVER,
        payload: material
    }
};

export const setCurrentMaterialHoverCoords = (coords) => {
    return {
        type: actions.SET_CURRENT_MATERIAL_HOVER_COORDS,
        payload: coords
    }
};
