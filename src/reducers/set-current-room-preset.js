import * as actions from '../actions/action-types';

export default (state = '', action) => {
    switch (action.type) {
        case actions.SET_CURRENT_ROOM_PRESET:
            return action.payload;
        default:
            return state;
    }
}