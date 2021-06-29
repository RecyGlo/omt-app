import { GET_NEWS } from './actionType';
import axios from 'axios';
import { news } from '../../api/endPoints';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const get_news_list = () => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.get(news,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            dispatch({
                type: GET_NEWS,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting news list.');
        });

}

const add_news = (data, callback) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.post(news, data,
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
            Alert.alert('Success!', 'News is added successfully.');
            dispatch(get_news_list());
            callback();
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in adding news.')
            console.log(error);
        });
}

const edit_news = (news_id, data, callback) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.patch(`${news}/${news_id}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            // console.log('edit news', response)
            dispatch(get_news_list());
            callback();
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in editing news.')
            console.log(error);
        });
}


const delete_news = (news_id) => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.delete(news + "/" + news_id, {
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/json',
            // 'Access-Control-Allow-Credentials': true,
            'Authorization': `Bearer ${token}`
        },
    })
        .then(response => {
            // console.log('delete news', response)
            dispatch(get_news_list());
        })
        .catch(error => {
            Alert.alert('Fail!', 'Error in deleting news.')
            console.log(error);
        });
}


export {
    get_news_list,
    add_news,
    edit_news,
    delete_news
}