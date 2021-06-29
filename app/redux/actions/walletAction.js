import { GET_WALLET, GET_WALLET_BY_USERID } from './actionType';
import axios from 'axios';
import { wallet } from '../../api/endPoints';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const get_wallet_list = () => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.get(wallet,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            dispatch({
                type: GET_WALLET,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting news list.');
        });

}

const get_wallet_by_userid = (user_id) => dispatch => {
  axios.get(wallet + '/user/' + user_id,
      {
          headers: {
              'Content-Type': 'application/json',
              'apikey': `37b36461-2312-49fb-a92c-50f34892e4a3`
          }
      }).then(function (response) {
          dispatch({
              type: GET_WALLET_BY_USERID,
              payload: response.data,
          });

      })
      .catch(function (error) {
          console.log(error);
          Alert.alert('Fail!', 'Error in getting the wallet.');
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
    get_wallet_list,
    get_wallet_by_userid,
}