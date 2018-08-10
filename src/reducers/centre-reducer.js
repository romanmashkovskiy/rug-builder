import * as actions from '../actions/action-types'

// const initial ={
//     id,
//     name: 'CENTRE',
//     src
// };

export default (state = 'CENTRE', action) => {
    switch (action.type) {
        case actions.SET_CENTER_MATERIAL_TYPE:
            return action.payload;
        default:
            return state;
    }
}