import * as actions from '../actions/action-types';

export default (state = '', action) => {
    switch (action.type) {
        case actions.SET_BORDER_TYPE:
            return action.payload;
        default:
            return state;
    }
}