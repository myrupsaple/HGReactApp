import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';

export default combineReducers({
    auth: authReducer,
    selectedUser: userReducer,
    users: usersReducer
});