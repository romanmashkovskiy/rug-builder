import * as actions from '../actions/action-types'

export default (state = [], action) => {
    switch (action.type) {
        case actions.LOAD_INNER_BORDER_MATERIALS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}