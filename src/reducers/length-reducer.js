import * as actions from '../actions/action-types'

export default (state = '', action) => {
    switch (action.type) {
        case actions.SET_LENGTH:
            return action.payload;
        default:
            return state;
    }
}