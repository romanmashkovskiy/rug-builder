import * as actions from '../actions/action-types'

export default (state = false, action) => {
    switch (action.type) {
        case actions.SHOW_RANDOMISE_ALL_MODAL:
            return action.payload;
        default:
            return state;
    }
}