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
} from './actionType';
import axios from 'axios';
import { market_place, dashboard_market_place, market_place_notification, save_product, order_product, order_accepted_product, upload_product, my_product_ordered, my_product_ordered_accepted, discuss_product } from '../../api/endPoints';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const get_market_place_list = () => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.get(market_place,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            dispatch({
                type: GET_MARKET_PLACE,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting market place product list.');
        });

}


const get_market_place_dashboard_list = () => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.get(dashboard_market_place,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            dispatch({
                type: GET_MARKET_PLACE_DASHBOARD,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting market place dashboard product list.');
        });

}

const get_market_product_info = (product_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.get(`${market_place}/${product_id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response)
            dispatch({
                type: GET_MARKET_PRODUCT_INFO,
                payload: response.data,
            });
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting market place product info.');
        });

}


const get_market_place_notification_list = (user_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.get(`${market_place_notification}/${user_id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response)
            dispatch({
                type: GET_MARKET_PLACE_NOTIFICATION_LIST,
                payload: response.data,
            });
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting market place notification list.');
        });

}



const get_uploaded_market_product_list = (uploaded_by) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.get(`${upload_product}/${uploaded_by}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response)
            dispatch({
                type: GET_UPLOADED_MARKET_PRODUCT_LIST,
                payload: response.data,
            });
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting uploaded market place product list.');
        });

}


const get_saved_market_product_list = (user_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.get(`${save_product}/${user_id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response)
            dispatch({
                type: GET_SAVED_MARKET_PRODUCT_LIST,
                payload: response.data,
            });
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting saved market product list.');
        });

}


const get_ordered_market_product_list = (user_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.get(`${order_product}/${user_id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response)
            dispatch({
                type: GET_ORDERED_MARKET_PRODUCT_LIST,
                payload: response.data,
            });
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting ordered market place product list.');
        });

}

const get_ordered_accepted_market_product_list = (user_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.get(`${order_accepted_product}/${user_id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response)
            dispatch({
                type: GET_ORDERED_ACCEPTED_MARKET_PRODUCT_LIST,
                payload: response.data,
            });
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting ordered accepted market place product list.');
        });

}

const get_my_market_product_ordered_list = (user_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.get(`${my_product_ordered}/${user_id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response)
            dispatch({
                type: GET_MY_MARKET_PRODUCT_ORDEDED_LIST,
                payload: response.data,
            });
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting my market place product ordered list.');
        });

}

const get_my_market_product_ordered_accepted_list = (user_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.get(`${my_product_ordered_accepted}/${user_id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // console.log(response)
            dispatch({
                type: GET_MY_MARKET_PRODUCT_ORDEDED_ACCEPTED_LIST,
                payload: response.data,
            });
        })
        .catch(error => {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting my market place product ordered accepted list.');
        });

}

const add_market_product = (data, callback) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.post(market_place, data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                // 'Content-Type': 'application/json',
                // 'Access-Control-Allow-Credentials': true,
                'Authorization': `Bearer ${token}`
            },
            // params: { timestamp: new Date().getTime() },
            // withCredentials: false,
        }).then(response => {
            // console.log(response);
            Alert.alert('Success!', 'Your product is added successfully.');
            dispatch(get_market_place_list());
            callback();
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in uploading ur product.')
            console.log(error);
        });
}

const edit_market_product = (product_id, data, callback) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    const user_id = await AsyncStorage.getItem('user_id');
    axios.patch(market_place + "/" + product_id, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            // console.log('edit market product', response)
            Alert.alert('Success!', 'Your product is edited successfully.');
            dispatch(get_market_place_list());
            dispatch(get_uploaded_market_product_list(user_id))
            dispatch(get_market_product_info(product_id));
            callback();
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in editing market place.')
            console.log(error);
        });
}


const toggle_hide_product = (product_id, data) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    const user_id = await AsyncStorage.getItem('user_id');
    axios.patch(market_place + "/" + product_id, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            Alert.alert('Success!', 'Your product status is changed successfully.');
            dispatch(get_market_place_list());
            dispatch(get_uploaded_market_product_list(user_id))
            dispatch(get_market_product_info(product_id));
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in toggle hide market place.')
            console.log(error);
        });
}


const toggle_save_product = (product_id, data) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.patch(save_product + '/' + product_id, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    }
    )
        .then(response => {
            // console.log(response);
            dispatch(get_market_place_list());
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in saving the product.')
            console.log(error);
        });
}



const order_market_product = (product_id, data) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');

    axios.patch(order_product + '/' + product_id, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    }
    )
        .then(response => {
            // console.log(response);
            dispatch(get_market_product_info(product_id));
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in ordering the product.')
            console.log(error);
        });
}


const accept_my_market_product_ordered = (product_id, data) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    const user_id = await AsyncStorage.getItem('user_id');
    axios.patch(my_product_ordered + "/" + product_id, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            // console.log('accept my market product ordered', response)
            Alert.alert('Success!', 'Your product is accepted successfully.');
            dispatch(get_market_place_list());
            dispatch(get_my_market_product_ordered_list(user_id));
            dispatch(get_market_product_info(product_id));
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in accepting my market product ordered.')
            console.log(error);
        });
}


const send_message = (product_id, data) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.patch(discuss_product + '/' + product_id, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        },
    }
    )
        .then(response => {
            // console.log('send_message', response)
            // Alert.alert('Success!', 'Your product is edited successfully.');
            // dispatch(get_market_product_info(product_id));
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in sending message.')
            console.log(error);
        });
}




export {
    get_market_place_list,
    get_market_place_dashboard_list,
    get_market_product_info,
    get_market_place_notification_list,
    get_saved_market_product_list,
    get_uploaded_market_product_list,
    get_ordered_market_product_list,
    get_ordered_accepted_market_product_list,
    get_my_market_product_ordered_list,
    get_my_market_product_ordered_accepted_list,
    add_market_product,
    edit_market_product,
    toggle_hide_product,
    toggle_save_product,
    order_market_product,
    accept_my_market_product_ordered,
    send_message
}