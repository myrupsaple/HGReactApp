import users from '../api/users';

import {
    SIGN_IN,
    SIGN_OUT,
    FETCH_USER
} from './types';

export const signIn = (userEmail) => async (dispatch) => {
    var response = null;
    // Helper function prevents immediate return of signIn function upon error
    await users.get(`/user/${userEmail}`)
        .then(res => {
            response = res;
        })
        .catch(err =>{
            console.log(err);
        });
    
    var id = null;
    var first_name = null;
    var last_name = null;
    var email = null;
    var permissions = null;

    // If no response (likely CORS error), we will send null values to the reducer
    if(response){
        const data = response.data[0];
        id = data.id;
        first_name = data.first_name;
        last_name = data.last_name;
        email = data.email;
        permissions = data.permissions;
    }

    dispatch ({
        type: SIGN_IN,
        payload: {
            id,
            first_name,
            last_name,
            email,
            permissions
        }
    });
};

export const signOut = () => (dispatch) => {
    dispatch ({
        type: SIGN_OUT
    });
};

export const fetchUser = () => (dispatch) => {
    dispatch ({
        type: FETCH_USER
    });
}