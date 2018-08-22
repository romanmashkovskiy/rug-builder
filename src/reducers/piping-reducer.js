import * as actions from '../actions/action-types'

const initial ={
    ID: 0,
    post_title: 'PIPING'
};

export default (state = initial, action) => {
    switch (action.type) {
        case actions.SET_PIPING_MATERIAL_TYPE:
            return { ...action.payload };
        default:
            return state;
    }
}