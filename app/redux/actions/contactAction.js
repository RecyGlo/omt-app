import { GET_CONTACT } from './actionType';
import axios from 'axios';
import { contact } from '../../api/endPoints';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const get_contact_list = () => async dispatch => {

    const token = await AsyncStorage.getItem('access_token');
    axios.get(contact,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(function (response) {
            dispatch({
                type: GET_CONTACT,
                payload: response.data,
            });

        })
        .catch(function (error) {
            console.log(error);
            Alert.alert('Fail!', 'Error in getting contact list.');
        });

}


export {
    get_contact_list
}