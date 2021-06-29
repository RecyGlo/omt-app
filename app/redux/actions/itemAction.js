import { GET_ITEM } from './actionType';
import axios from 'axios';
import { item } from '../../api/endPoints';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

// const token = async () => await AsyncStorage.getItem('token');

// const get_token = async () => {
//     try {
//         const token = await AsyncStorage.getItem('access_token');
//         return token;
//     } catch (error) {
//         console.log(error);
//     }
// };

const get_item_list = () => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.get(item,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            dispatch({
                type: GET_ITEM,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting item list.');
        });

}

const add_item = (data, callback) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.post(item, data,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => {
            // console.log(response);
            Alert.alert('Success!', 'Item is added successfully.');
            dispatch(get_item_list());
            callback();

        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in adding item.')
            console.log(error);
        });
}


const edit_item = (item_id, data, callback) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.patch(`${item}/${item_id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            // console.log('edit item', response)
            dispatch(get_item_list());
            callback();
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in editing item.')
            console.log(error);
        });
}


const delete_item = (item_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.delete(item + "/" + item_id, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            // console.log('delete item', response)
            dispatch(get_item_list());
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in deleting item.')
            console.log(error);
        });
}

export {
    get_item_list,
    add_item,
    edit_item,
    delete_item
}