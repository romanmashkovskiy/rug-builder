import * as actions from '../actions/action-types'

const initial = {
    id: 0,
    name: 'INNER BORDER'
};

export default (state = initial, action) => {
    switch (action.type) {
        case actions.SET_INNER_BORDER_MATERIAL_TYPE:
            return { ...action.payload };
        default:
            return state;
    }
}