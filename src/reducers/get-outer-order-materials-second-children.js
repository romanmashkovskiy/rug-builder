import * as actions from '../actions/action-types';
import { convertObjectToArray } from "../utils/object-to-array";

export default (state = [], action) => {
    switch (action.type) {
        case actions.LOAD_OUTER_BORDER_MATERIALS_SECOND_CHILDREN_SUCCESS:
            return convertObjectToArray(action.payload);
        case actions.CLEAR_OUTER_BORDER_MATERIAL_SECOND_CHILDREN:
            return [];
        default:
            return state;
    }
}