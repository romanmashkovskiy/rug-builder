import * as actions from '../actions/action-types'

export default (state = 'CENTRE', action) => {
    switch (action.type) {
        case actions.SET_BORDER_TYPE:  //нужно исправить тип действия
            return action.payload;
        default:
            return state;
    }
}