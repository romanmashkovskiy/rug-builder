import * as actions from '../actions/action-types';

export default (state = [], action) => {
    switch (action.type) {
        case actions.LOAD_CENTER_MATERIALS_FIRST_CHILDREN_SUCCESS:
            console.log(action.payload);
            return action.payload;
        default:
            return state;
    }
}