import { LOG_IN, SIGN_UP, LOG_OUT, USER_INF0, EDIT_PROFILE } from '../actions/actionType';
import AsyncStorage from '@react-native-community/async-storage';
import analytics from '@react-native-firebase/analytics';


INITIAL_STATE = {
    user: null,
    message: null
}

export default (state = INITIAL_STATE, action) => {
    let response, access_token, refresh_token, data, user_id, user_type, device_id;
    switch (action.type) {
        case LOG_IN:
            // console.log(action.payload);
            response = action.payload;
            access_token = ['access_token', response.token];
            refresh_token = ['refresh_token', response.refreshToken];
            data = response.data;
            user_id = ['user_id', data._id];
            user_type = ['user_type', data.type];
            device_id = ['device_id', data.device_id];

            if (data.permission == undefined) {
                data.permission = {
                    item: false,
                    junk_shop: false,
                    news: false
                }
            }
            if (data.type == 'ADMIN') {
                data.permission = {
                    item: true,
                    junk_shop: true,
                    news: true
                }
            }
            analytics().setUserId(data._id);
            analytics().setUserProperty('user_name', data.name);
            AsyncStorage.multiSet([access_token, refresh_token, user_id, user_type, device_id]);
            return { ...state, user: data };
        case SIGN_UP:
            // console.log(action.payload);
            response = action.payload;
            access_token = ['access_token', response.token];
            refresh_token = ['refresh_token', response.refreshToken];
            data = response.data;
            user_id = ['user_id', data._id];
            user_type = ['user_type', data.type];
            device_id = ['device_id', data.device_id];
            if (data.permission == undefined) {
                data.permission = {
                    item: false,
                    junk_shop: false,
                    news: false
                }
            }
            if (data.type == 'ADMIN') {
                data.permission = {
                    item: true,
                    junk_shop: true,
                    news: true
                }
            }
            analytics().setUserId(data._id);
            analytics().setUserProperty('user_name', data.name);
            AsyncStorage.multiSet([access_token, refresh_token, user_id, user_type, device_id]);
            return { ...state, user: data };
        case LOG_OUT:
            const keys = ['access_token', 'refresh_token', 'user_id', 'user_type', 'device_id'];
            AsyncStorage.multiRemove(keys);
            return { ...state, user: null };
        case USER_INF0:
            response = action.payload;
            // console.log(response);
            if (response) {
                data = response.data;
                if (data.permission == undefined) {
                    data.permission = {
                        item: false,
                        junk_shop: false,
                        news: false
                    }
                }
                if (data.type == 'ADMIN') {
                    data.permission = {
                        item: true,
                        junk_shop: true,
                        news: true
                    }
                }
                return { ...state, user: data };
            } else {
                return { ...state, user: response };
            }
        case EDIT_PROFILE:
            message = action.payload;
            return { ...state, message: message };
        default:
            return state;
    }
}
