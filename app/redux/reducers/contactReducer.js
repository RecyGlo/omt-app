import { GET_CONTACT } from '../actions/actionType';

const INITIAL_STATE = {
    contact_list: [],
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_CONTACT:
            return { ...state, contact_list: action.payload.data};
        default:
            return state;
    }
}