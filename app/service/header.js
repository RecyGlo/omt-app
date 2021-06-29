import AsyncStorage from '@react-native-community/async-storage';

export const token = async () => await AsyncStorage.getItem('token');