import * as actions from '../actions/action-types'

export default (state = false, action) => {
    switch (action.type) {
        case actions.SHOW_OUTER_BORDER_MATERIAL_MODE:
            return action.payload;
        default:
            return state;
    }
}