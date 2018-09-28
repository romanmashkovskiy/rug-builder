import * as actions from '../actions/action-types'

export default (state = 0, action) => {
    switch (action.type) {
        case actions.SET_CURRENT_CONTAINER_RUG_WIDTH:
            return action.payload;
        default:
            return state;
    }
}