import * as actions from '../actions/action-types';
import { convertObjectToArray } from "../utils/object-to-array";

export default (state = [], action) => {
    switch (action.type) {
        case actions.LOAD_CENTER_MATERIALS_SECOND_CHILDREN_SUCCESS:
            console.log(action.payload);
            console.log(convertObjectToArray(action.payload));
            return convertObjectToArray(action.payload);
        default:
            return state;
    }
}