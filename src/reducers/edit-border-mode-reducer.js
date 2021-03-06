import * as actions from '../actions/action-types'

export default (state = false, action) => {
    switch (action.type) {
        case actions.SET_EDIT_BORDER_MODE:
            return action.payload;
        default:
            return state;
    }
}