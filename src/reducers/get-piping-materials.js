import * as actions from '../actions/action-types'

export default (state = [], action) => {
    switch (action.type) {
        case actions.LOAD_PIPING_MATERIALS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}