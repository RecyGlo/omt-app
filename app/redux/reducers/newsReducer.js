import { GET_NEWS } from '../actions/actionType';

const INITIAL_STATE = {
    news_list: [],
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_NEWS:
            return { ...state, news_list: action.payload.data};
        default:
            return state;
    }
}