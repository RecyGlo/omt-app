import { LOG_IN, SIGN_UP, LOG_OUT, USER_INF0 } from './actionType';
import axios from 'axios';
import { log_in, log_in_by_social, log_in_by_phone_verification, user, refresh_token } from '../../api/endPoints';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import jwtDecode from 'jwt-decode';


const login = (account_type, data, callback) => dispatch => {

  let url;
  if (account_type == 'facebook' || account_type == 'google' || account_type == 'apple')
    url = log_in_by_social;
  else if (account_type == 'phone_auth')
    url = log_in_by_phone_verification;
  else
    url = log_in;

  axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function (response) {
      dispatch({
        type: LOG_IN,
        payload: response.data,
      });

    })
    .catch(function (error) {
      if (account_type == 'facebook' || account_type == 'google' || account_type == 'apple') {
        Alert.alert('Login Fail!', 'Error in Social Login.');
      } else if (account_type == 'phone_auth') {
        callback();
      } else {
        Alert.alert('Login Fail!', 'Email or Password is incorrect.');
      }
      console.log(error);

    });
}


const log_out = () => dispatch => {
  dispatch({
    type: LOG_OUT,
    // payload: response.data,
  });
}


const sign_up = (data) => dispatch => {

  axios.post(user, data, {
    header: {
      'Content-Type': 'multipart/form-data',
    }
  })
    .then(response => {
      console.log(response);
      // AsyncStorage.setItem('access_token',response.data.token);
      dispatch({
        type: SIGN_UP,
        payload: response.data,

      })
    })
    .catch(function (error) {
      console.log(error);
      if (error.message && error.message === 'Request failed with status code 409') {
        Alert.alert('Sign Up Fail!', 'Looks like email or phone number already exist.');
      } else {
        Alert.alert('Sign Up Fail!', "Error in creating user account.Try Again.");
      }
    });
}

const get_user_info = (user_id) => async dispatch => {

  const token = await AsyncStorage.getItem('access_token');
  axios.get(`${user}/${user_id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }).then(function (response) {
      // console.log(response.data.data);
      dispatch({
        type: USER_INF0,
        payload: response.data,
      });

    })
    .catch(function (error) {
      console.log(error);
      Alert.alert('Access Expired!', ' Log In Again !');
      dispatch({
        type: USER_INF0,
        payload: null,
      });
    });

}


const update_access_token = () => async dispatch => {

  const current_refresh_token = await AsyncStorage.getItem('refresh_token');
  const user_id = await AsyncStorage.getItem('user_id');
  const data = {
    refreshToken: current_refresh_token
  };

  if (check_refresh_token_expire(current_refresh_token)) {
    console.log('refresh_token', 'expired');
    Alert.alert('Access Expired!', 'Log In Again');
    dispatch({
      type: USER_INF0,
      payload: null,
    });
  } else {
    axios.post(refresh_token, data, {
      header: {
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Credentials': true,
      }
    })
      .then(response => {
        // console.log(response);
        const access_token = response.data.token;
        AsyncStorage.setItem('access_token', access_token);
        dispatch(get_user_info(user_id, access_token));
      })
      .catch((error) => {
        console.log('refresh_token', error);
        Alert.alert('Access Expired!', 'Log In Again');
        dispatch({
          type: USER_INF0,
          payload: null,
        });
      });
  }
}

const check_refresh_token_expire = (refresh_token) => {
  const { exp } = jwtDecode(refresh_token);
  if (exp > new Date().getTime() / 1000) {
    return false;
  }
  return true;
}


const edit_profile = (user_id, data, callback) => async dispatch => {

  const token = await AsyncStorage.getItem('access_token');
  axios.patch(`${user}/${user_id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      // 'Content-Type': 'application/json',
      // 'Access-Control-Allow-Credentials': true,
      'Authorization': `Bearer ${token}`
    },
  })
    .then(response => {
      // console.log('edit profile', response)
      dispatch(get_user_info(user_id));
      callback();
    })
    .catch(error => {
      Alert.alert('Fail!', 'Error in editing profile.')
      console.log(error);
    });
}

export {
  login,
  sign_up,
  log_out,
  get_user_info,
  edit_profile,
  update_access_token
}