import * as actions from '../actions/action-types'

const initial = {
    id: 0,
    name: 'OUTER BORDER'
};

export default (state = initial, action) => {
    switch (action.type) {
        case actions.SET_OUTER_BORDER_MATERIAL_TYPE:
            return { ...action.payload };
        default:
            return state;
    }
}