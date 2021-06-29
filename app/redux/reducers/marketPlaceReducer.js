import {
    GET_MARKET_PLACE,
    GET_MARKET_PLACE_DASHBOARD,
    GET_MARKET_PRODUCT_INFO,
    GET_MARKET_PLACE_NOTIFICATION_LIST,
    GET_SAVED_MARKET_PRODUCT_LIST,
    GET_UPLOADED_MARKET_PRODUCT_LIST,
    GET_ORDERED_MARKET_PRODUCT_LIST,
    GET_ORDERED_ACCEPTED_MARKET_PRODUCT_LIST,
    GET_MY_MARKET_PRODUCT_ORDEDED_LIST,
    GET_MY_MARKET_PRODUCT_ORDEDED_ACCEPTED_LIST
} from '../actions/actionType';
// import AsyncStorage from '@react-native-community/async-storage';


const INITIAL_STATE = {
    market_place_list: [],
    market_place_dashboard_list: [],
    market_product_info: null,
    market_place_notification_list: [],
    uploaded_market_product_list: [],
    saved_market_product_list: [],
    ordered_market_product_list: [],
    ordered_accepted_market_product_list: [],
    my_market_product_ordered_list: [],
    my_market_product_ordered_accepted_list: [],
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_MARKET_PLACE:
            return { ...state, market_place_list: action.payload.data };
        case GET_MARKET_PLACE_DASHBOARD:
            return { ...state, market_place_dashboard_list: action.payload.data };
        case GET_MARKET_PRODUCT_INFO:
            return { ...state, market_product_info: action.payload.data };
        case GET_MARKET_PLACE_NOTIFICATION_LIST:
            return { ...state, market_place_notification_list: action.payload.data };
        case GET_SAVED_MARKET_PRODUCT_LIST:
            return { ...state, saved_market_product_list: action.payload.data };
        case GET_UPLOADED_MARKET_PRODUCT_LIST:
            return { ...state, uploaded_market_product_list: action.payload.data };
        case GET_ORDERED_MARKET_PRODUCT_LIST:
            return { ...state, ordered_market_product_list: action.payload.data };
        case GET_ORDERED_ACCEPTED_MARKET_PRODUCT_LIST:
            return { ...state, ordered_accepted_market_product_list: action.payload.data };
        case GET_MY_MARKET_PRODUCT_ORDEDED_LIST:
            return { ...state, my_market_product_ordered_list: action.payload.data };
        case GET_MY_MARKET_PRODUCT_ORDEDED_ACCEPTED_LIST:
            return { ...state, my_market_product_ordered_accepted_list: action.payload.data };
        default:
            return state;
    }
}