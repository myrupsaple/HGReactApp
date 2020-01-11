import users from '../api/users';

import {
    SIGN_IN,
    SIGN_OUT,
    FETCH_USERS,
    FETCH_USER
} from './types';

export const signIn = (userEmail) => async (dispatch) => {
    console.log('Actions: Sign in initiated');
    // Multiple sign in requests received upon sign in
    setTimeout(() => { return null }, 500);
    var response = null;

    // Helper function prevents immediate return of signIn function upon error
    await users.get(`/user/${userEmail}`)
        .then(res => {
            response = res;
            console.log('Email validation: response received');
        })
        .catch(err =>{
            console.log(err);
        });

    var authorized = false;
    var id = null;
    var first_name = null;
    var last_name = null;
    var email = null;
    var permissions = null;

    // If no response (likely CORS error), we will send null values to the reducer
    if(response){
        // If we receive a response, set the email so that we can identify the user
        // by their email, even if their account is not linked to the database
        email = userEmail;
        const data = response.data[0];
        if(data){
            console.log('Email validation: email authenticated');
            authorized = true;
            id = data.id;
            first_name = data.first_name;
            last_name = data.last_name;
            permissions = data.permissions;
        }
    }

    dispatch ({
        type: SIGN_IN,
        payload: {
            authorized,
            id,
            first_name,
            last_name,
            email,
            permissions
        }
    });
};

export const signOut = () => (dispatch) => {
    console.log('Actions: Sign out initiated');
    setTimeout(() => { return null }, 500);
    dispatch ({
        type: SIGN_OUT
    });
};

export const fetchUsers = () => async (dispatch) => {
    console.log('Actions: Fetching users list');
    var response = null;
    await users.get(`/users`)
        .then(res => {
        response = res;
        console.log('Successfully retrieved users list');
        })
        .catch(err => {
            console.log(err);
        });

    if(response.data){
        dispatch ({ type: FETCH_USERS, payload: response.data });
    }
};

export const fetchUser = () => (dispatch) => {
    console.log('Actions: Fetch user initiated');
    dispatch ({
        type: FETCH_USER
    });
};