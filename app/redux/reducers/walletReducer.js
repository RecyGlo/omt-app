import { GET_WALLET, GET_WALLET_BY_USERID } from '../actions/actionType';

const INITIAL_STATE = {
  wallet_list: [],
  wallet_by_userid: {},
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_WALLET:
            return { ...state, wallet_list: action.payload.data};
        case GET_WALLET_BY_USERID:
            return { ...state, wallet_by_userid: action.payload.data};
        default:
            return state;
    }
}