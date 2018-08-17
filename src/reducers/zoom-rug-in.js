import * as actions from '../actions/action-types'

export default (state = '', action) => {
    switch (action.type) {
        case actions.ZOOM_RUG_IN:
            return action.payload;
        default:
            return state;
    }
}