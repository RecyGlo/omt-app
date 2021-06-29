import { GET_ITEM } from '../actions/actionType';

const INITIAL_STATE = {
    item_list: [],
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_ITEM:
            // console.log(action.payload.data);
            return { ...state, item_list: action.payload.data };
        default:
            return state;
    }
}