import { combineReducers } from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import tributeReducer from './tributeReducer';
import tributesReducer from './tributesReducer';
import donationReducer from './donationReducer';
import donationsReducer from './donationsReducer';

export default combineReducers({
    auth: authReducer,
    selectedUser: userReducer,
    users: usersReducer,
    selectedTribute: tributeReducer,
    tributes: tributesReducer,
    selectedDonation: donationReducer,
    donations: donationsReducer
});