import * as actions from './action-types';
import materialsApi from '../api/get-materials-api';

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
    return (dispatch) => {
        return materialsApi.getMaterials('?request=materials').then(response => {
            dispatch(loadCenterMaterialsSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadCenterMaterialsSuccess(response) {
    return {type: actions.LOAD_CENTER_MATERIALS_SUCCESS, payload: response};
}

export const getCenterMaterialsFirstChildren = (parent) => {
    return (dispatch) => {
        return materialsApi.getMaterials('?request=collections').then(response => {
            dispatch(loadCenterMaterialsFirstChildrenSuccess(response[parent]));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadCenterMaterialsFirstChildrenSuccess(response) {
    return {type: actions.LOAD_CENTER_MATERIALS_FIRST_CHILDREN_SUCCESS, payload: response};
}

export const getCenterMaterialsSecondChildren = (parent) => {
    return (dispatch) => {
        return materialsApi.getMaterials(`?request=swatches&collection=${parent}`).then(response => {
            dispatch(loadCenterMaterialsSecondChildrenSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadCenterMaterialsSecondChildrenSuccess(response) {
    return {type: actions.LOAD_CENTER_MATERIALS_SECOND_CHILDREN_SUCCESS, payload: response};
}

export const getInnerBorderMaterials = () => {
    return (dispatch) => {
        return materialsApi.getMaterials('?request=border').then(response => {
            dispatch(loadInnerBorderMaterialsSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadInnerBorderMaterialsSuccess(response) {
    return {type: actions.LOAD_INNER_BORDER_MATERIALS_SUCCESS, payload: response};
}

export const getInnerBorderMaterialsFirstChildren = (parent) => {
    return (dispatch) => {
        return materialsApi.getMaterials(`?request=collections&collection=${parent}`).then(response => {
            dispatch(loadInnerBorderMaterialsFirstChildrenSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadInnerBorderMaterialsFirstChildrenSuccess(response) {
    return {type: actions.LOAD_INNER_BORDER_MATERIALS_FIRST_CHILDREN_SUCCESS, payload: response};
}

export const getInnerBorderMaterialsSecondChildren = (parent) => {
    return (dispatch) => {
        return materialsApi.getMaterials(`?request=swatches&collection=${parent}`).then(response => {
            dispatch(loadInnerBorderMaterialsSecondChildrenSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadInnerBorderMaterialsSecondChildrenSuccess(response) {
    return {type: actions.LOAD_INNER_BORDER_MATERIALS_SECOND_CHILDREN_SUCCESS, payload: response};
}


export const getOuterBorderMaterials = () => {
    return (dispatch) => {
        return materialsApi.getMaterials('?request=border').then(response => {
            dispatch(loadOuterBorderMaterialsSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadOuterBorderMaterialsSuccess(response) {
    return {type: actions.LOAD_OUTER_BORDER_MATERIALS_SUCCESS, payload: response};
}

export const getOuterBorderMaterialsFirstChildren = (parent) => {
    return (dispatch) => {
        return materialsApi.getMaterials(`?request=collections&collection=${parent}`).then(response => {
            dispatch(loadOuterBorderMaterialsFirstChildrenSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadOuterBorderMaterialsFirstChildrenSuccess(response) {
    return {type: actions.LOAD_OUTER_BORDER_MATERIALS_FIRST_CHILDREN_SUCCESS, payload: response};
}

export const getOuterBorderMaterialsSecondChildren = (parent) => {
    return (dispatch) => {
        return materialsApi.getMaterials(`?request=swatches&collection=${parent}`).then(response => {
            dispatch(loadOuterBorderMaterialsSecondChildrenSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadOuterBorderMaterialsSecondChildrenSuccess(response) {
    return {type: actions.LOAD_OUTER_BORDER_MATERIALS_SECOND_CHILDREN_SUCCESS, payload: response};
}


export const getPipingMaterials = () => {
    return (dispatch) => {
        return materialsApi.getMaterials('?request=piping').then(response => {
            dispatch(loadPipingMaterialsSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadPipingMaterialsSuccess(response) {
    return {type: actions.LOAD_PIPING_MATERIALS_SUCCESS, payload: response};
}

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

export const setRugCurrentView = (view) => {
    return {
        type: actions.SET_RUG_CURRENT_VIEW,
        payload: view
    }
};

export const zoomRugIn = () => {
    return {
        type: actions.ZOOM_RUG_IN
    }
};

export const zoomRugOut = () => {
    return {
        type: actions.ZOOM_RUG_OUT
    }
};

export const setShowRugCornerMode = (mode) => {
    return {
        type: actions.SHOW_RUG_CORNER,
        payload: mode
    }
};

export const getCenterMaterialsPrice = (name) => {
    return (dispatch) => {

        return materialsApi.getMaterials(`?request=price&material=${name}`).then(response => {
            dispatch(loadCenterMaterialsPriceSuccess(response));
        }).catch(error => {
            console.log(error)
        })
    }
};

export function loadCenterMaterialsPriceSuccess(response) {
    return {type: actions.LOAD_CENTER_MATERIALS_PRICE_SUCCESS, payload: response};
};