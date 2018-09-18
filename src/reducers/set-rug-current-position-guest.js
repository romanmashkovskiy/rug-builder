import * as actions from '../actions/action-types';

export default (state = false, action) => {
    switch (action.type) {
        case actions.SET_RUG_POSITION_GUEST:
            return action.payload;
        default:
            return state;
    }
}