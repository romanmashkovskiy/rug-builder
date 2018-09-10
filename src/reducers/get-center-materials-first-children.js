import * as actions from '../actions/action-types';

export default (state = [], action) => {
    switch (action.type) {
        case actions.LOAD_CENTER_MATERIALS_FIRST_CHILDREN_SUCCESS:
            return action.payload;
        case actions.CLEAR_CENTER_MATERIAL_FIRST_CHILDREN:
            return [];
        default:
            return state;
    }
}