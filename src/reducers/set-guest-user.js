import * as actions from '../actions/action-types';

export default (state = {}, action) => {
    switch (action.type) {
        case actions.SET_GUEST_USER:
            return action.payload;
        default:
            return state;
    }
}