import * as actions from '../actions/action-types'

export default (state = 'INNER BORDER', action) => {
    switch (action.type) {
        case actions.SET_INNER_BORDER_MATERIAL_TYPE:
            return action.payload;
        default:
            return state;
    }
}