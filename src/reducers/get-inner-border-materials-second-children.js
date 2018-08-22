import * as actions from '../actions/action-types';
import { convertObjectToArray } from "../utils/object-to-array";

export default (state = [], action) => {
    switch (action.type) {
        case actions.LOAD_INNER_BORDER_MATERIALS_SECOND_CHILDREN_SUCCESS:
            return convertObjectToArray(action.payload);
        default:
            return state;
    }
}