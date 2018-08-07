import * as actions from '../actions/action-types'

export default (state = 'CENTRE', action) => {
    switch (action.type) {
        case actions.SET_BORDER_TYPE: //change action
            return action.payload;
        default:
            return state;
    }
}