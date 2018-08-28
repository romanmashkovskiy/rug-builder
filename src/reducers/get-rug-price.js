import * as actions from '../actions/action-types'

export default (state = '', action) => {
    switch (action.type) {
        case actions.RUG_PRICE_CALCULATED:
            return action.payload;
        default:
            return state;
    }
}

