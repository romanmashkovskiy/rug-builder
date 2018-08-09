import * as actions from '../actions/action-types'

export default (state = false, action) => {
    switch (action.type) {
        case actions.SHOW_CENTER_MATERIAL_SECOND_CHILDREN_MODE:
            return action.payload;
        default:
            return state;
    }
}