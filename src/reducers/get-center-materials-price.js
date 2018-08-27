import * as actions from '../actions/action-types'

export default (state = false, action) => {
    switch (action.type) {
        case actions.LOAD_CENTER_MATERIALS_PRICE_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}

