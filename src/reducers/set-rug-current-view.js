import * as actions from '../actions/action-types';

export default (state = '', action) => {
    switch (action.type) {
        case actions.SET_RUG_CURRENT_VIEW:
            return action.payload;
        default:
            return state;
    }
}