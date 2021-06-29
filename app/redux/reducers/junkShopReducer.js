import { GET_JUNK_SHOP, GET_ADDED_JUNK_SHOP, GET_JUNK_SHOP_DETAIL, GET_ADMIN_JUNK_SHOP } from '../actions/actionType';

const INITIAL_STATE = {
    junk_shop_list: [],
    junk_shop_detail: null,
    added_junk_shop_list: {
        page: 1,
        total_page: 1,
        added_junk_shop_list: []
    },
    admin_junk_shop_list: {
        page: 1,
        total_page: 1,
        count: 0,
        admin_junk_shop_list: []
    }
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_JUNK_SHOP:
            return { ...state, junk_shop_list: action.payload.data };
        case GET_JUNK_SHOP_DETAIL:
            return { ...state, junk_shop_detail: action.payload.data };
        case GET_ADDED_JUNK_SHOP:
            let added_junk_shop_list;
            if (action.payload.page == 1)
                added_junk_shop_list = {
                    page: action.payload.page,
                    total_page: action.payload.total_page,
                    added_junk_shop_list: action.payload.data
                }
            else
                added_junk_shop_list = {
                    page: action.payload.page,
                    total_page: action.payload.total_page,
                    added_junk_shop_list: [...state.added_junk_shop_list.added_junk_shop_list, ...action.payload.data]
                }
            return { ...state, added_junk_shop_list: added_junk_shop_list };
        case GET_ADMIN_JUNK_SHOP:
            let admin_junk_shop_list;
            if (action.payload.page == 1)
                admin_junk_shop_list = {
                    page: action.payload.page,
                    total_page: action.payload.total_page,
                    count: action.payload.count,
                    admin_junk_shop_list: action.payload.data
                }
            else
                admin_junk_shop_list = {
                    page: action.payload.page,
                    total_page: action.payload.total_page,
                    count: action.payload.count,
                    admin_junk_shop_list: [...state.admin_junk_shop_list.admin_junk_shop_list, ...action.payload.data]
                }
            return { ...state, admin_junk_shop_list: admin_junk_shop_list };
        default:
            return state;
    }
}