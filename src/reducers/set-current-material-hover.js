import * as actions from '../actions/action-types';

export default (state = {}, action) => {
    switch (action.type) {
        case actions.SET_CURRENT_MATERIAL_HOVER:
            return {...action.payload};
        default:
            return state;
    }
}