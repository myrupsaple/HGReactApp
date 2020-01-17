import users from '../api/users';

import {
    SIGN_IN,
    SIGN_OUT,
    FETCH_USER,
    FETCH_USERS,
    FETCH_ALL_USERS,
    FETCH_TRIBUTE,
    FETCH_ALL_TRIBUTES
} from './types';

//############################ (0) GOOGLE O-AUTH #############################//

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
            console.log('Email validation: Google OAuth response received');
            id = data.id;
            first_name = data.first_name;
            last_name = data.last_name;
            permissions = data.permissions;
        }
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
    console.log('Actions: Sign out initiated');
    setTimeout(() => { return null }, 500);
    dispatch ({
        type: SIGN_OUT
    });
};

//########################### (1) USER MANAGEMENT ############################//

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
        console.log(`Successfully retrieved user ${email}`);
        dispatch ({ type: FETCH_USER, payload: { 
            response: response.data,
            id
        }});
    }
};

export const fetchUsers = (type, query) => async (dispatch) => {
    console.log(`Actions: Fetch users initiated: ${type} containing '${query}'`);
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
            console.log(`Successfully updated user ${user.email}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const createUser = user => async dispatch => {
    console.log('Actions: Create user initiated');
    await users.post(`/user/post/${user.first_name}/${user.last_name}/${user.email}/${user.permissions}`)
        .then(res => {
            console.log(`Successfully updated user ${user.email}`);
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

//######################### (2) TRIBUTE MANAGEMENT ###########################//

export const fetchTribute = (email, id) => async dispatch => {
    console.log(`Actions: Fetch tributes initiated`);
    var response = null;
    await users.get(`/tribute/get/${email}`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        })
    if(response && response.data){
        console.log(`Successfully fetched tribute ${email}`);
        dispatch({ type: FETCH_TRIBUTE, payload: {
            response: response.data,
            id
        }});
    }
}

export const fetchTributes = () => async dispatch => {
    console.log(`Actions: Fetch all tributes initiated`);
    var response = null;
    await users.get(`/tributes/get`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        })
    if(response && response.data){
        console.log('Successfully fetched tributes');
        dispatch({ type: FETCH_ALL_TRIBUTES, payload: response.data });
    }
}

export const createTribute = tribute => async dispatch => {
    console.log('Actions: Create tribute initiated');
    await users.post(`/tribute/post/${tribute.first_name}/${tribute.last_name}/${tribute.email}/${tribute.district}/${tribute.districtPartner}/${tribute.area}/${tribute.mentor}/${tribute.paidRegistration}`)
        .then(res => {
            console.log(`Successfully created tribute ${tribute.email}`);
        })
        .catch(err => {
            console.log(err);
        })
}

export const updateTribute = tribute => async dispatch => {
    console.log('Actions: Update tribute initiated');
    await users.put(`/tribute/put/${tribute.id}/${tribute.first_name}/${tribute.last_name}/${tribute.email}/${tribute.district}/${tribute.districtPartner}/${tribute.area}/${tribute.mentor}/${tribute.paidRegistration}`)
        .then(res => {
            console.log(`Successfully updated tribute ${tribute.email}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const deleteTribute = id => async dispatch => {
    console.log(`Actions: DELETE tribute initiated with id ${id}`);
    await users.delete(`/tribute/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted tribute');
        })
        .catch(err => {
            console.log(err);
        })
}