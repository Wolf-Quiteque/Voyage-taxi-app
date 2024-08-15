import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserInfo = async (userInfo) => {
  try {
    const jsonValue = JSON.stringify(userInfo);
    
    
    await AsyncStorage.setItem('@user_info', jsonValue);
  } catch (e) {
    console.error('Error saving user info:', e);
  }
};