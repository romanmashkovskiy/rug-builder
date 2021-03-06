import * as actions from './action-types';

import materialsApi from '../api/get-materials-api';
import LoginApi from '../api/login-api';
import RegisterApi from '../api/register-api';
import ForgotPasswordApi from '../api/forgot-password api';
import SaveRugApi from '../api/save-rug-api';
import OrderSamplesApi from '../api/order-samples-api';
import GuestCheckoutApi from '../api/guest-checkout-api';

import {calculatePrice} from '../utils/calculate-rug-price';

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
        return materialsApi.getMaterials('materials-data').then(response => {
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
        return materialsApi.getMaterials('collections-data').then(response => {
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
        return materialsApi.getMaterials(`swatches-data/?collection=${parent}`).then(response => {
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
        return materialsApi.getMaterials('borders-data').then(response => {
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
        return materialsApi.getMaterials(`collections-data/?collection=${parent}`).then(response => {
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
        return materialsApi.getMaterials(`swatches-data/?collection=${parent}`).then(response => {
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
        return materialsApi.getMaterials('borders-data').then(response => {
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
        return materialsApi.getMaterials(`collections-data/?collection=${parent}`).then(response => {
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
        return materialsApi.getMaterials(`swatches-data/?collection=${parent}`).then(response => {
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
        return materialsApi.getMaterials('piping-data').then(response => {
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

export const setRugPosition = (isSet) => {
    return {
        type: actions.SET_RUG_POSITION,
        payload: isSet
    }
};

export const setRugPositionGuest = (isSet) => {
    return {
        type: actions.SET_RUG_POSITION_GUEST,
        payload: isSet
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

export const setShowRoomPresetsMode = (mode) => {
    return {
        type: actions.SHOW_ROOM_PRESETS,
        payload: mode
    }
};

export const getRugPrice = (name, length, width, rugType, innerBorder, outerBorder, piping) => {
    return (dispatch) => {

        return materialsApi.getMaterials(`price-data/?material=${name}`).then(response => {
            dispatch(loadCenterMaterialsPriceSuccess(response, length, width, rugType, innerBorder, outerBorder, piping));
        }).catch(error => {
            console.log(error)
        })
    }
};

export const loadCenterMaterialsPriceSuccess = (response, length, width, rugType, innerBorder, outerBorder, piping) => {
    const rugPrice = calculatePrice(
        length,
        width,
        rugType,
        innerBorder,
        outerBorder,
        piping,
        response
    );

    return {type: actions.RUG_PRICE_CALCULATED, payload: rugPrice ? rugPrice : ''};
};

export const setShowLoginRegisterMode = (mode) => {
    return {
        type: actions.SHOW_LOGIN_REGISTER_MODAL,
        payload: mode
    }
};

export const setShowLoginMode = (mode) => {
    return {
        type: actions.SHOW_LOGIN_MODAL,
        payload: mode
    }
};

export const setShowRegisterMode = (mode) => {
    return {
        type: actions.SHOW_REGISTER_MODAL,
        payload: mode
    }
};

export const setShowGuestMode = (mode) => {
    return {
        type: actions.SHOW_GUEST_MODAL,
        payload: mode
    }
};

export const loginUser = (username, password) => {
    return () => {
        return LoginApi.LoginUser(username, password)
    }
};

export const registerUser = (email, password, first_name, last_name, address_1, address_2, postcode, city, is_agree, is_subscribed) => {
    return () => {
        return RegisterApi
            .RegisterUser(email, password, first_name, last_name, address_1, address_2, postcode, city, is_agree, is_subscribed)
    }
};

export const forgotPassword = (email) => {
    return () => {
        return ForgotPasswordApi.ForgotPassword(email).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        })
    }
};

export const saveRug = (
    rug_type,
    cm_sku,
    cm_product_name,
    cm_product_id,
    bm1_sku,
    bm1_product_name,
    bm1_product_id,
    bm2_sku,
    bm2_product_name,
    bm2_product_id,
    piping_sku,
    piping_product_name,
    piping_product_id,
    width,
    height,
    preview_image
) => {
    return () => {

        switch (rug_type) {

            case 'SINGLE-BORDER':
                return SaveRugApi.SaveRug(
                    // rug_type,
                    'Single border', //on demand 12.09.18
                    cm_sku,
                    cm_product_name,
                    cm_product_id,
                    bm1_sku,
                    bm1_product_name,
                    bm1_product_id,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    width,
                    height,
                    preview_image
                ).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                });

            case 'BORDER-PIPING':
                return SaveRugApi.SaveRug(
                    //rug_type,
                    'Single border', //on demand 12.09.18
                    cm_sku,
                    cm_product_name,
                    cm_product_id,
                    bm1_sku,
                    bm1_product_name,
                    bm1_product_id,
                    undefined,
                    undefined,
                    undefined,
                    piping_sku,
                    piping_product_name,
                    piping_product_id,
                    width,
                    height,
                    preview_image
                ).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                });

            case 'DOUBLE-BORDER':
                return SaveRugApi.SaveRug(
                    //rug_type,
                    'Double border', //on demand 12.09.18
                    cm_sku,
                    cm_product_name,
                    cm_product_id,
                    bm1_sku,
                    bm1_product_name,
                    bm1_product_id,
                    bm2_sku,
                    bm2_product_name,
                    bm2_product_id,
                    undefined,
                    undefined,
                    undefined,
                    width,
                    height,
                    preview_image
                ).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                });
        }
    }
};

export const guestCheckout = (
    first_name,
    last_name,
    email,
    rug_type,
    cm_sku,
    cm_product_name,
    cm_product_id,
    bm1_sku,
    bm1_product_name,
    bm1_product_id,
    bm2_sku,
    bm2_product_name,
    bm2_product_id,
    piping_sku,
    piping_product_name,
    piping_product_id,
    width,
    height,
    preview_image
) => {
    return () => {

        switch (rug_type) {

            case 'SINGLE-BORDER':
                return GuestCheckoutApi.GuestCheckout(
                    first_name,
                    last_name,
                    email,
                    rug_type,
                    cm_sku,
                    cm_product_name,
                    cm_product_id,
                    bm1_sku,
                    bm1_product_name,
                    bm1_product_id,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    width,
                    height,
                    preview_image
                ).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                });

            case 'BORDER-PIPING':
                return GuestCheckoutApi.GuestCheckout(
                    first_name,
                    last_name,
                    email,
                    rug_type,
                    cm_sku,
                    cm_product_name,
                    cm_product_id,
                    bm1_sku,
                    bm1_product_name,
                    bm1_product_id,
                    undefined,
                    undefined,
                    undefined,
                    piping_sku,
                    piping_product_name,
                    piping_product_id,
                    width,
                    height,
                    preview_image
                ).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                });

            case 'DOUBLE-BORDER':
                return GuestCheckoutApi.GuestCheckout(
                    first_name,
                    last_name,
                    email,
                    rug_type,
                    cm_sku,
                    cm_product_name,
                    cm_product_id,
                    bm1_sku,
                    bm1_product_name,
                    bm1_product_id,
                    bm2_sku,
                    bm2_product_name,
                    bm2_product_id,
                    undefined,
                    undefined,
                    undefined,
                    width,
                    height,
                    preview_image
                ).then(response => {
                    console.log(response);
                }).catch(error => {
                    console.log(error);
                });
        }
    }
};

export const orderSamples = (
    user_id,
    product_id,
    first_name,
    last_name,
    email,
    address_1,
    address_2,
    postcode,
    city
) => {
    return () => {
        return OrderSamplesApi.OrderSamples(
            user_id,
            product_id,
            first_name,
            last_name,
            email,
            address_1,
            address_2,
            postcode,
            city
        )
    }
};

export const setSamplesOrderedSuccess = (isSuccess) => {
    return {
        type: actions.SAMPLES_ORDERED_SUCCESS,
        payload: isSuccess
    }
};



export const clearCenterMaterialFirstChildrenMaterials = () => {
    return {
        type: actions.CLEAR_CENTER_MATERIAL_FIRST_CHILDREN
    }
};

export const clearCenterMaterialSecondChildrenMaterials = () => {
    return {
        type: actions.CLEAR_CENTER_MATERIAL_SECOND_CHILDREN
    }
};

export const clearInnerBorderMaterialFirstChildrenMaterials = () => {
    return {
        type: actions.CLEAR_INNER_BORDER_MATERIAL_FIRST_CHILDREN
    }
};

export const clearInnerBorderMaterialSecondChildrenMaterials = () => {
    return {
        type: actions.CLEAR_INNER_BORDER_MATERIAL_SECOND_CHILDREN
    }
};

export const clearOuterBorderMaterialFirstChildrenMaterials = () => {
    return {
        type: actions.CLEAR_OUTER_BORDER_MATERIAL_FIRST_CHILDREN
    }
};

export const clearOuterBorderMaterialSecondChildrenMaterials = () => {
    return {
        type: actions.CLEAR_OUTER_BORDER_MATERIAL_SECOND_CHILDREN
    }
};

export const setGuestUser = (
    firstName,
    lastName,
    email,
    addressLine1,
    addressLine2,
    city,
    postcode
) => {
    return {
        type: actions.SET_GUEST_USER,
        payload: {
            firstName,
            lastName,
            email,
            addressLine1,
            addressLine2,
            city,
            postcode
        }
    }
};

export const setCurrentRoomPreset = (room) => {
    return {
        type: actions.SET_CURRENT_ROOM_PRESET,
        payload: room
    }
};

export const setShowRandomiseAllMode = (mode) => {
    return {
        type: actions.SHOW_RANDOMISE_ALL_MODAL,
        payload: mode
    }
};




