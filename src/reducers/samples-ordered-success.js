import * as actions from '../actions/action-types'

export default (state = false, action) => {
    switch (action.type) {
        case actions.SAMPLES_ORDERED_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}