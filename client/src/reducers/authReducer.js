import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
    loaded: false,
    authorized: false,
    isSignedIn: false,
    userId: null,
    userFirstName: null,
    userLastName: null,
    userEmail: null,
    userPerms: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGN_IN:
            console.log('AuthReducer: Sign in change state');
            return {
                ...state, 
                loaded: true,
                authorized: action.payload.authorized,
                isSignedIn: true,
                userId: action.payload.id,
                userFirstName: action.payload.first_name,
                userLastName: action.payload.last_name,
                userEmail: action.payload.email,
                userPerms: action.payload.permissions
            };
        case SIGN_OUT:
            console.log('AuthReducer: Sign out change state');
            return {
                ...state, 
                loaded: true,
                authorized: false,
                isSignedIn: false, 
                userId: null,
                userFirstName: null,
                userLastName: null,
                userEmail: null,
                userPerms: null
            };
        default:
            return state;
    }
};