import users from '../api/users';

import {
    SIGN_IN,
    SIGN_OUT,
    FETCH_USER,
    FETCH_USERS,
    FETCH_ALL_USERS,
} from './types';

export const signIn = (userEmail) => async (dispatch) => {
    console.log('Actions: Sign in initiated');
    // Multiple sign in requests received upon sign in
    setTimeout(() => { return null }, 500);
    var response = null;

    // Helper function prevents immediate return of signIn function upon error
    await users.get(`/user/get/${userEmail}`)
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

export const fetchUser = (email, id) => async (dispatch) => {
    console.log('Actions: Fetch user initiated');
    var response = null;
    await users.get(`/user/get/${email}`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for user');
        dispatch ({ type: FETCH_USER, payload: { 
            response: response.data,
            id: id
        }});
    }
};

export const fetchUsers = (type, query) => async (dispatch) => {
    console.log('Actions: Fetch users initiated');
    var response = null;
    await users.get(`/users/get/${type}/${query}`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for users');
        dispatch ({ type: FETCH_USERS, payload: response.data });
    }
};

export const fetchAllUsers = () => async (dispatch) => {
    console.log('Actions: Fetch all users initiated');
    var response = null;
    await users.get(`/users/get`)
        .then(res => {
        response = res;
    })
    .catch(err => {
        console.log(err);
    });
    
    if(response && response.data){
        console.log('Successfully retrieved users list');
        dispatch ({ type: FETCH_ALL_USERS, payload: response.data });
    }
};

export const updateUser = user => async dispatch => {
    console.log('Actions: Update user initiated');
    await users.put(`/user/put/${user.id}/${user.first_name}/${user.last_name}/${user.email}/${user.permissions}`)
        .then(res => {
            console.log('Successfully updated user');
        })
        .catch(err => {
            console.log(err);
        });
}

export const createUser = user => async dispatch => {
    console.log('Actions: Create user initiated');
    await users.post(`/user/post/${user.first_name}/${user.last_name}/${user.email}/${user.permissions}`)
        .then(res => {
            console.log('Successfully updated user');
        })
        .catch(err => {
            console.log(err);
        })
}

export const deleteUser = id => async dispatch => {
    console.log(`Actions: DELETE user initiated with id ${id}`);
    await users.delete(`/user/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted user');
        })
        .catch(err => {
            console.log(err);
        })
}