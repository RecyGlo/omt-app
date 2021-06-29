import { GET_JUNK_SHOP, GET_ADDED_JUNK_SHOP, GET_JUNK_SHOP_DETAIL, GET_ADMIN_JUNK_SHOP } from './actionType';
import axios from 'axios';
import { junk_shop, added_junk_shop, pending_junk_shop, approved_junk_shop, rejected_junk_shop } from '../../api/endPoints';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const get_junk_shop_list = () => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.get(junk_shop,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            console.log(response.data.data[0].list[0]);
            dispatch({
                type: GET_JUNK_SHOP,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting junk shop list.');
        });

}

const get_admin_junk_shop_list = (type, page) => async dispatch => {

    let url;
    if (type == 'PENDING') {
        url = pending_junk_shop;
    } else if (type == 'APPROVED') {
        url = approved_junk_shop;
    } else if (type == 'REJECTED') {
        url = rejected_junk_shop;
    }

    const token = await AsyncStorage.getItem('access_token');
    axios.get(`${url}` + '?page=' + page,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {

            if (type == 'PENDING') {
                total_page = parseInt(response.data.count.pending_junk_shop_count / 10) + 1;
            } else if (type == 'APPROVED') {
                total_page = parseInt(response.data.count.approved_junk_shop_count / 10) + 1;
            } else if (type == 'REJECTED') {
                total_page = parseInt(response.data.count.rejected_junk_shop_count / 10) + 1;
            }
            // total_page = parseInt(response.data.count / 10) + 1;
            response.data.total_page = total_page;
            response.data.page = page;
            dispatch({
                type: GET_ADMIN_JUNK_SHOP,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting admin junk shop list.');
        });

}

const get_junk_shop_detail = (junk_shop_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.get(`${junk_shop}/${junk_shop_id}`,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            dispatch({
                type: GET_JUNK_SHOP_DETAIL,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting junk shop detail.');
        });

}


const get_added_junk_shop_list = (user_id, page) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.get(`${added_junk_shop}${user_id}` + '?page=' + page,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            total_page = parseInt(response.data.count / 10) + 1;
            response.data.total_page = total_page;
            response.data.page = page;
            // console.log(response.data);
            dispatch({
                type: GET_ADDED_JUNK_SHOP,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting added junk shop list.');
        });

}


// get_added_junk_shop_list = () => {
//     let { token, user_id, page, total_page, added_junk_shop_list } = this.state;

//     axios.get(`${added_junk_shop}${user_id}` + '?page=' + page,
//         {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//         .then(response => {
//             total_page = parseInt(response.data.count / 10) + 1;
//             this.setState({
//                 total_page: total_page,
//                 added_junk_shop_list: [...added_junk_shop_list, ...response.data.data]
//             })
//         })
//         .catch(error => {
//             console.log(error);
//         });
// }

const add_junk_shop = (data, callback) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.post(junk_shop, data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => {
            // console.log(response);
            Alert.alert('Success!', 'Junk shop is added successfully.We will review the junk shop and upload it on the map.');
            dispatch(get_junk_shop_list());
            callback();

        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in adding junk shop.')
            console.log(error);
        });
}


const edit_junk_shop = (junk_shop_id, data, callback) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    const user_id = await AsyncStorage.getItem('user_id');
    axios.patch(`${junk_shop}/${junk_shop_id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            // console.log('edit junk shop', response)
            dispatch(get_junk_shop_detail(junk_shop_id));
            dispatch(get_added_junk_shop_list(user_id, 1));
            dispatch(get_junk_shop_list());
            callback();
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in editing junk shop.')
            console.log(error);
        });
}

const change_approve_status = (junk_shop_id, data, previous_status) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.patch(`${junk_shop}/${junk_shop_id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            // console.log('change approve status junk shop', response)
            Alert.alert('Success!', 'Successfully changed the status of junk shop.')
            dispatch(get_junk_shop_detail(junk_shop_id));
            dispatch(get_admin_junk_shop_list(previous_status, 1));
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in changing approve status of junk shop.')
            console.log(error);
        });
}


const delete_junk_shop = (junk_shop_id, previous_status, callback) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    const user_id = await AsyncStorage.getItem('user_id');
    axios.delete(`${junk_shop}/${junk_shop_id}`, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            // console.log('delete junk shop', response)
            if (previous_status === 'ADDED') {
                dispatch(get_added_junk_shop_list(user_id, 1));
            } else {
                dispatch(get_admin_junk_shop_list(previous_status, 1));
            }
            callback();
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in deleting junk shop.')
            console.log(error);
        });
}



export {
    get_junk_shop_list,
    get_admin_junk_shop_list,
    get_junk_shop_detail,
    get_added_junk_shop_list,
    add_junk_shop,
    edit_junk_shop,
    change_approve_status,
    delete_junk_shop
}