import * as actions from '../actions/action-types'

export default (state = false, action) => {
    switch (action.type) {
        case actions.SHOW_INNER_BORDER_MATERIAL_FIRST_CHILDREN_MODE:
            return action.payload;
        default:
            return state;
    }
}