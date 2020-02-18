import app from '../api/app';

import {
    SET_NAVBAR,
    SIGN_IN,
    SIGN_OUT,
    DEV_SIGN_IN,
    FETCH_USER,
    FETCH_USERS,
    FETCH_ALL_USERS,
    FETCH_TRIBUTE,
    FETCH_ALL_TRIBUTES,
    FETCH_DONATION,
    FETCH_DONATIONS,
    FETCH_ALL_DONATIONS,
    CLEAR_DONATIONS_QUEUE,
    FETCH_RESOURCE_LIST_ITEM,
    FETCH_RESOURCE_LIST_ITEMS,
    FETCH_ALL_RESOURCE_LIST_ITEMS,
    CLEAR_RESOURCE_LIST_QUEUE,
    FETCH_RESOURCE_EVENT,
    FETCH_RESOURCE_EVENTS,
    FETCH_ALL_RESOURCE_EVENTS,
    CLEAR_RESOURCE_EVENT_QUEUE,
    FETCH_LIFE_EVENT,
    FETCH_LIFE_EVENTS,
    FETCH_ALL_LIFE_EVENTS,
    CLEAR_LIFE_EVENTS_QUEUE,
    FETCH_ITEM,
    FETCH_ITEMS,
    FETCH_ALL_ITEMS,
    FETCH_ALL_MENTORS,
    FETCH_PURCHASE,
    FETCH_PURCHASES,
    FETCH_ALL_PURCHASES,
    CLEAR_PURCHASES_QUEUE,
    FETCH_GAMESTATE,
    FETCH_TRIBUTE_STAT,
    FETCH_TRIBUTE_STATS,
    FETCH_ALL_TRIBUTE_STATS,
    FETCH_GLOBAL_EVENT,
    FETCH_GLOBAL_EVENTS
} from './types';

//############################# (Misc. Settings) #############################//

export const setNavBar = (type) => async (dispatch) => {
    console.log(`Navbar set to: ${type}`)
    dispatch({
        type: SET_NAVBAR,
        payload:{
            id: 'navType',
            value: type
        }
    })
};

//############################ (0) GOOGLE O-AUTH #############################//

export const signIn = (userEmail) => async (dispatch) => {
    console.log('Actions: Sign in initiated');
    // Multiple sign in requests received upon sign in
    setTimeout(() => { return null }, 500);
    var response = null;

    // Helper function prevents immediate return of signIn function upon error
    await app.get(`/user/get/${userEmail}`)
        .then(res => {
            console.log('Email validation: response received');
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

    return response;
};

export const signOut = () => (dispatch) => {
    console.log('Actions: Sign out initiated');
    setTimeout(() => { return null }, 500);
    dispatch ({
        type: SIGN_OUT
    });
};

export const devSignIn = (email, userPerms) => async (dispatch) => {
    console.log('Actions: Dev sign in initiated');
    dispatch({
        type: DEV_SIGN_IN,
        payload: {
            email,
            userPerms
        }
    })
}

//########################### (1) USER MANAGEMENT ############################//

export const fetchUser = (email) => async (dispatch) => {
    console.log('Actions: Fetch user initiated');
    var response = null;
    await app.get(`/user/get/${email}`)
        .then(res => {
            console.log(`Successfully fetched user ${email}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log(`Successfully retrieved user ${email}`);
        dispatch ({ type: FETCH_USER, payload: { 
            response: response.data[0]
        }});
    }
    return response;
};

export const fetchUsers = (type, query) => async (dispatch) => {
    console.log(`Actions: Fetch users initiated: ${type} containing '${query}'`);
    var response = null;
    await app.get(`/users/get/${type}/${query}`)
        .then(res => {
            console.log(`Successfully fetch users`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for users');
        dispatch ({ type: FETCH_USERS, payload: response.data });
    }
    return response;
};

export const fetchAllUsers = () => async (dispatch) => {
    console.log('Actions: Fetch all users initiated');
    var response = null;
    await app.get(`/users/get`)
        .then(res => {
            console.log(`Successfully fetched all users`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        console.log('Successfully retrieved users list');
        dispatch ({ type: FETCH_ALL_USERS, payload: response.data });
    }
    return response;
};

export const updateUser = user => async () => {
    console.log('Actions: Update user initiated');
    var response = null;
    await app.put(`/user/put/${user.id}/${user.first_name}/${user.last_name}/${user.email}/${user.permissions}`)
        .then(res => {
            console.log(`Successfully updated user ${user.email}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const createUser = user => async () => {
    console.log('Actions: Create user initiated');
    var response = null;
    await app.post(`/user/post/${user.first_name}/${user.last_name}/${user.email}/${user.permissions}`)
        .then(res => {
            console.log(`Successfully created user ${user.email}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        })
    return response;
}

export const deleteUser = id => async () => {
    console.log(`Actions: DELETE user initiated with id ${id}`);
    var response = null;
    await app.delete(`/user/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted user');
            response = res;
        })
        .catch(err => {
            console.log(err);
        })
    return response;
}

//######################### (2) TRIBUTE MANAGEMENT ###########################//

export const fetchTribute = (email, id) => async (dispatch) => {
    console.log(`Actions: Fetch tribute initiated with email ${email}`);
    var response = null;
    await app.get(`/tribute/info/get/${email}`)
        .then(res => {
            console.log(`Successfully fetched tribute ${email}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        })
    if(response && response.data){
        console.log(`Successfully fetched tribute ${email}`);
        dispatch({ type: FETCH_TRIBUTE, payload: {
            response: response.data[0]
        }});
    }
    return response;
}

export const fetchTributes = () => async (dispatch) => {
    console.log(`Actions: Fetch all tributes initiated`);
    var response = null;
    await app.get(`/tributes/info/get`)
        .then(res => {
            console.log(`Successfully fetched tributes`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        })
    if(response && response.data){
        console.log('Successfully fetched tributes');
        dispatch({ type: FETCH_ALL_TRIBUTES, payload: response.data });
    }
    return response;
}

export const createTribute = tribute => async () => {
    console.log('Actions: Create tribute initiated');
    var response = null;
    await app.post(`/tribute/info/post/${tribute.first_name}/${tribute.last_name}/${tribute.email}/${tribute.phone}/${tribute.district}/${tribute.districtPartner}/${tribute.area}/${tribute.mentor}/${tribute.paidRegistration}`)
        .then(res => {
            console.log(`Successfully created tribute ${tribute.email}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        })
    return response;
}

export const updateTribute = tribute => async () => {
    console.log('Actions: Update tribute initiated');
    var response = null;
    await app.put(`/tribute/info/put/${tribute.id}/${tribute.first_name}/${tribute.last_name}/${tribute.email}/${tribute.phone}/${tribute.district}/${tribute.districtPartner}/${tribute.area}/${tribute.mentor}/${tribute.paidRegistration}`)
        .then(res => {
            console.log(`Successfully updated tribute ${tribute.email}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const deleteTribute = id => async () => {
    console.log(`Actions: DELETE tribute initiated with id ${id}`);
    var response = null;
    await app.delete(`/tribute/info/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted tribute');
            response = res;
        })
        .catch(err => {
            console.log(err);
        })
    return response;
}

export const deleteTributeDeleteStats = email => async () => {
    console.log(`Actions: DELETE tribute stats account initiated with email ${email}`);
    var response = null;
    await app.delete(`/tribute/info/tribute-stats/delete/${email}`)
        .then(res => {
            console.log('Successfully deleted tribute stats account');
            response = res;
        })
        .catch(err => {
            console.log(err);
        })
    return response;
}

//######################### (3) DONATION MANAGEMENT ##########################//

export const fetchDonation = id => async (dispatch) => {
    console.log('Actions: Fetch donation initiated');
    var response = null;
    await app.get(`/donation/get/${id}`)
        .then(res => {
            console.log(`Successfully donation`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log(`Successfully retrieved donation ${id}`);
        dispatch ({ type: FETCH_DONATION, payload: { 
            response: response.data[0]
        }});
    }
    return response;
};

export const fetchDonations = (type, query) => async (dispatch) => {
    console.log(`Actions: Fetch donations initiated: ${type} containing '${query}'`);
    var response = null;
    await app.get(`/donations/get/${type}/${query}`)
        .then(res => {
            console.log(`Successfully fetched donations`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for donations');
        dispatch ({ type: FETCH_DONATIONS, payload: response.data });
    }
    return response;
};

export const fetchDonationsRange = (type, query1, query2) => async (dispatch) => {
    console.log(`Actions: Fetch donations range initiated: ${type} between ${query1} and ${query2}`);
    var response = null;
    await app.get(`/donations/get/range/${type}/${query1}/${query2}`)
        .then(res => {
            console.log(`Successfully fetched donations`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for donations range');
        dispatch ({ type: FETCH_DONATIONS, payload: response.data });
    }
    return response;
};

export const fetchAllDonations = () => async (dispatch) => {
    console.log('Actions: Fetch all donations initiated');
    var response = null;
    await app.get(`/donations/get/all`)
        .then(res => {
            console.log(`Successfully fetched all donations`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        console.log('Successfully retrieved donations list');
        dispatch ({ type: FETCH_ALL_DONATIONS, payload: response.data });
    }
    return response;
};

export const createDonation = donation => async () => {
    console.log('Actions: Create donation initiated');
    var response = null;
    await app.post(`/donations/post/${donation.email}/${donation.donor}/${donation.method}/${donation.date}/${donation.amount}/${donation.tags}`)
        .then(res => {
            console.log(`Successfully created donation of ${donation.amount}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const updateDonation = donation => async () => {
    console.log('Actions: Update donation initiated');
    var response = null;
    await app.put(`/donations/put/${donation.id}/${donation.email}/${donation.donor}/${donation.method}/${donation.date}/${donation.amount}/${donation.tags}`)
        .then(res => {
            console.log(`Successfully updated donation ${donation.id}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const deleteDonation = id => async () => {
    console.log(`Actions: DELETE donation initiated with id ${id}`);
    var response = null;
    await app.delete(`/donations/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted donation');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const clearDonationsList = () => async (dispatch) => {
    dispatch({ type: CLEAR_DONATIONS_QUEUE });
}

export const donationUpdateTributeStats = (email, amount) => async () => {
    console.log('Actions: Donations: Update tribute stats for donations');
    var response = null;
    await app.put(`/tribute-stats/donations/put/${email}/${amount}`)
        .then(res => {
            console.log(`Successfully updated tribute stats with donation`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

//############################ (4a) Resource List ############################//
export const fetchResourceListItem = id => async (dispatch) => {
    console.log('Actions: Fetch resource list item initiated');
    var response = null;
    await app.get(`/resource/list/get/single/${id}`)
        .then(res => {
            console.log(`Successfully fetched resource list item`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    if(response && response.data){
        console.log(`Successfully retrieved resource list item ${id}`);
        dispatch ({ type: FETCH_RESOURCE_LIST_ITEM, payload: { 
            response: response.data[0]
        }});
    }
    return response;
};

export const fetchResourceListItemByCode = (code) => async (dispatch) => {
    console.log(`Actions: Fetch resource list item with code ${code}`);
    var response = null;
    await app.get(`/resource/list/get/singleByCode/${code}`)
        .then(res => {
            console.log(`Successfully fetched resource list item`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log(`Successfully retrieved resource list item ${code}`);
        dispatch ({ type: FETCH_RESOURCE_LIST_ITEM, payload: { 
            response: response.data[0]
        }});
    }
    return response;
};

export const fetchResourceListItems = (type, query) => async (dispatch) => {
    console.log(`Actions: Fetch resource list items initiated: ${type} containing '${query}'`);
    var response = null;
    await app.get(`/resource/list/get/list/${type}/${query}`)
        .then(res => {
            console.log(`Successfully fetched resource list items`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for resource list items');
        dispatch ({ type: FETCH_RESOURCE_LIST_ITEMS, payload: response.data });
    }
    return response;
};


export const fetchAllResourceListItems = () => async (dispatch) => {
    console.log('Actions: Fetch all resource list items initiated');
    var response = null;
    await app.get(`/resource/list/get/all`)
        .then(res => {
            console.log(`Successfully fetched all resource list items`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        console.log('Successfully retrieved resource list');
        dispatch ({ type: FETCH_ALL_RESOURCE_LIST_ITEMS, payload: response.data });
    }
    return response;
};

export const createResourceListItem = item => async () => {
    console.log('Actions: Create resource list item initiated');
    var response = null;
    await app.post(`/resource/list/post/${item.code}/${item.type}/${item.timesUsed}/${item.maxUses}/${item.usedBy}/${item.notes}`)
        .then(res => {
            console.log(`Successfully created resource list item of type ${item.type} via ${item.method}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const updateResourceListItem = item => async () => {
    console.log('Actions: Update resource list item initiated');
    var response = null;
    await app.put(`/resource/list/put/${item.id}/${item.code}/${item.type}/${item.timesUsed}/${item.maxUses}/${item.usedBy}/${item.notes}`)
        .then(res => {
            console.log(`Successfully updated resource list item ${item.id}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const deleteResourceListItem = id => async () => {
    console.log(`Actions: DELETE resource list item initiated with id ${id}`);
    var response = null;
    await app.delete(`/resource/list/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted resource list item');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const clearResourceList = () => async (dispatch) => {
    dispatch({ type: CLEAR_RESOURCE_LIST_QUEUE });
}

//########################### (4b) Resource Events ###########################//
export const fetchResourceEvent = id => async (dispatch) => {
    console.log('Actions: Fetch resource event initiated');
    var response = null;
    await app.get(`/resource/events/get/single/${id}`)
        .then(res => {
            console.log(`Successfully fetched resource event`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log(`Successfully retrieved resource event ${id}`);
        dispatch ({ type: FETCH_RESOURCE_EVENT, payload: { 
            response: response.data[0]
        }});
    }
    return response;
};

export const fetchResourceEvents = (type, query) => async (dispatch) => {
    console.log(`Actions: Fetch resource event initiated: ${type} containing '${query}'`);
    var response = null;
    await app.get(`/resource/events/get/list/${type}/${query}`)
        .then(res => {
            console.log(`Successfully fetched resource events`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for resource event');
        dispatch ({ type: FETCH_RESOURCE_EVENTS, payload: response.data });
    }
    return response;
};

export const fetchResourceEventsRange = (type, query1, query2) => async (dispatch) => {
    console.log(`Actions: Fetch resource events range initiated: ${type} between ${query1} and ${query2}`);
    var response = null;
    await app.get(`/resource/events/get/range/${type}/${query1}/${query2}`)
        .then(res => {
            console.log(`Successfully fetched resource events`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for resource event range');
        dispatch ({ type: FETCH_RESOURCE_EVENTS, payload: response.data });
    }
    return response;
};

export const fetchAllResourceEvents = () => async (dispatch) => {
    console.log('Actions: Fetch all resource events initiated');
    var response = null;
    await app.get(`/resource/events/get/all`)
        .then(res => {
            console.log(`Successfully fetched all resource events`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        console.log('Successfully retrieved all resource events');
        dispatch ({ type: FETCH_ALL_RESOURCE_EVENTS, payload: response.data });
    }
    return response;
};

export const createResourceEvent = item => async () => {
    console.log('Actions: Create resource event initiated');
    var response = null;
    await app.post(`/resource/events/post/${item.email}/${item.type}/${item.method}/${item.time}/${item.notes}`)
        .then(res => {
            console.log(`Successfully created resource event of ${item.type} via ${item.method}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const updateResourceEvent = item => async () => {
    console.log('Actions: Update resource event initiated');
    var response = null;
    await app.put(`/resource/events/put/${item.id}/${item.email}/${item.type}/${item.method}/${item.time}/${item.notes}`)
        .then(res => {
            console.log(`Successfully updated resource event ${item.id}`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const deleteResourceEvent = id => async () => {
    console.log(`Actions: DELETE resource event initiated with id ${id}`);
    var response = null;
    await app.delete(`/resource/events/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted resource event');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const clearResourceEvents = () => async (dispatch) => {
    dispatch({ type: CLEAR_RESOURCE_EVENT_QUEUE });
}

export const resourceEventUpdateTributeStats = (email, type, mode) => async () => {
    console.log(`Actions: Update tribute stats with ${type} resource`);
    var response = null;
    await app.put(`/tribute-stats/resource-events/put/${email}/${type}/${mode}`)
        .then(res => {
            console.log(`Successfully updated tribute stats with ${type} resource`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const resourceEventCreateLifeEvent = (email, time, notes) => async () => {
    console.log(`Actions: Create life events with life resource`);
    var response = null;
    await app.post(`/resource-events/life-events/post/${email}/${time}/${notes}`)
        .then(res => {
            console.log(`Successfully created life events with life resource`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const resourceEventUpdateLifeEvent = (email1, email2, time, notes) => async () => {
    console.log(`Actions: Update life events with life resource`);
    var response = null;
    await app.put(`/resource-events/life-events/put/${email1}/${email2}/${time}/${notes}`)
        .then(res => {
            console.log(`Successfully updated life events with life resource`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const resourceEventDeleteLifeEvent = (email, time, notes) => async () => {
    console.log(`Actions: Delete life events with life resource`);
    var response = null;
    await app.delete(`/resource-events/life-events/delete/${email}/${time}/${notes}`)
        .then(res => {
            console.log(`Successfully updated life events with life resource`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const resourceEventUpdateResourceList = (name, code, mode) => async () => {
    console.log(`Actions: Update resource list with resource event`);
    var response = null;
    await app.put(`/resource-events/resource-list/put/${name}/${code}/${mode}`)
        .then(res => {
            console.log(`Successfully updated resource list with resource event`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

//########################### (5) Life Management ############################//

export const fetchLifeEvent = id => async (dispatch) => {
    console.log(`Actions: Get Life Event initiated with id ${id}`);
    var response = null;
    await app.get(`/life-events/get/single/${id}`)
        .then(res => {
            console.log('Successfully Fetched Life Event');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_LIFE_EVENT, payload: response.data[0] });
    }
    return response;
}

export const fetchLifeEventByTerms = (email, time, notes) => async (dispatch) => {
    console.log(`Actions: Get Life Event by terms initiated with email ${email} and time ${time}`);
    var response = null;
    await app.get(`/life-events/get/single/terms/${email}/${time}/${notes}`)
        .then(res => {
            console.log('Successfully Fetched Life Event');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_LIFE_EVENT, payload: response.data[0] });
    }
    return response;
}

export const fetchLifeEvents = (type, query) => async (dispatch) => {
    console.log(`Actions: Get Life Event List initiated: ${type} with query ${query}`);
    var response = null;
    await app.get(`/life-events/get/list/${type}/${query}`)
        .then(res => {
            console.log('Successfully Fetched Life Events');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_LIFE_EVENTS, payload: response.data });
    }
    return response;
}

export const fetchLifeEventsRange = (type, queryLower, queryUpper) => async (dispatch) => {
    console.log(`Actions: Get Life Event Range: ${type} from ${queryLower} to ${queryUpper}`);
    var response = null;
    await app.get(`/life-events/get/range/${type}/${queryLower}/${queryUpper}`)
        .then(res => {
            console.log('Successfully Fetched Life Event Range');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_LIFE_EVENTS, payload: response.data });
    }
    return response;
}

export const fetchAllLifeEvents = () => async (dispatch) => {
    console.log(`Actions: Get All Life Events`);
    var response = null;
    await app.get(`/life-events/get/all`)
        .then(res => {
            console.log('Successfully Fetched All Life Events');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ALL_LIFE_EVENTS, payload: response.data });
    }
    return response;
}

export const createLifeEvent = (lifeEvent) => async () => {
    console.log(`Actions: Create Life Event`);
    var response = null;
    await app.post(`/life-events/post/${lifeEvent.email}/${lifeEvent.type}/${lifeEvent.method}/${lifeEvent.time}/${lifeEvent.notes}`)
        .then(res => {
            console.log('Successfully Created Life Event');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const updateLifeEvent = (lifeEvent) => async () => {
    console.log(`Actions: Update Life Event`);
    var response = null;
    await app.put(`/life-events/put/${lifeEvent.id}/${lifeEvent.email}/${lifeEvent.type}/${lifeEvent.method}/${lifeEvent.time}/${lifeEvent.notes}`)
        .then(res => {
            console.log('Successfully Updated Life Event');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const deleteLifeEvent = (id) => async () => {
    console.log(`Actions: DELETE Life Event with id ${id}`);
    var response = null;
    await app.delete(`/life-events/delete/${id}`)
        .then(res => {
            console.log('Successfully Deleted Life Event');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const clearLifeEventsList = () => async (dispatch) => {
    dispatch({ type: CLEAR_LIFE_EVENTS_QUEUE });
}

export const lifeEventUpdateTributeStatsLives = (email, type, method, mode) => async () => {
    console.log('Actions: Donations: Update tribute stats for life events');
    var response = null;
    await app.put(`/tribute-stats/life-events/lives/put/${email}/${type}/${method}/${mode}`)
        .then(res => {
            console.log(`Successfully updated tribute stats with life event`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const lifeEventUpdateTributeStatsKills = (email, mode) => async () => {
    console.log('Actions: Donations: Update tribute stats for kill count');
    var response = null;
    await app.put(`/tribute-stats/life-events/kills/put/${email}/${mode}`)
        .then(res => {
            console.log(`Successfully updated tribute stats with kill count`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

//############################## (6) Item List ###############################//

export const fetchItem = id => async (dispatch) => {
    console.log(`Actions: Get Item initiated with id ${id}`);
    var response = null;
    await app.get(`/item-list/get/single/${id}`)
        .then(res => {
            console.log('Successfully Fetched Item');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ITEM, payload: response.data[0] });
    }
    return response;
}

export const fetchItems = (query) => async (dispatch) => {
    console.log(`Actions: Get Item List initiatedwith query ${query}`);
    var response = null;
    await app.get(`/item-list/get/list/${query}`)
        .then(res => {
            console.log('Successfully Fetched Items');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ITEMS, payload: response.data });
    }
    return response;
}

export const fetchAllItems = () => async (dispatch) => {
    console.log(`Actions: Get All Items`);
    var response = null;
    await app.get(`/item-list/get/all`)
        .then(res => {
            console.log('Successfully Fetched All Items');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ALL_ITEMS, payload: response.data });
    }
    return response;
}

export const createItem = (item) => async () => {
    console.log(`Actions: Create Item`);
    var response = null;
    await app.post(`/item-list/post/${item.name}/${item.description}/${item.quantity}/${item.tier1_cost}/${item.tier2_cost}/${item.tier3_cost}/${item.tier4_cost}`)
        .then(res => {
            console.log('Successfully Created Item');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const updateItem = (item) => async () => {
    console.log(`Actions: Update Item`);
    var response = null;
    await app.put(`/item-list/put/${item.id}/${item.name}/${item.description}/${item.quantity}/${item.tier1_cost}/${item.tier2_cost}/${item.tier3_cost}/${item.tier4_cost}`)
        .then(res => {
            console.log('Successfully Updated Item');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const deleteItem = (id) => async () => {
    console.log(`Actions: DELETE Item with id ${id}`);
    var response = null;
    await app.delete(`/item-list/delete/${id}`)
        .then(res => {
            console.log('Successfully Deleted Item');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

//############################## (7) Purchases ###############################//

export const fetchMentors = () => async (dispatch) => {
    console.log(`Actions: Fetch mentors list`);
    var response = null;
    await app.get(`/purchases/get/mentors`)
        .then(res => {
            console.log('Successfully fetched mentors');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ALL_MENTORS, payload: response.data });
    }
    return response;
}

export const fetchPurchaseRequest = (id) => async (dispatch) => {
    console.log(`Actions: Fetch purchase request with id ${id}`);
    var response = null;
    await app.get(`/purchases/get/single/${id}`)
        .then(res => {
            console.log('Successfully fetched purchase request');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_PURCHASE, payload: response.data[0] });
    }
    return response;
}

export const fetchPurchaseRequests = (email) => async (dispatch) => {
    console.log(`Actions: Fetch purchase requests with status 'pending' from ${email}`);
    var response = null;
    await app.get(`/purchases/get/list/${email}`)
        .then(res => {
            console.log('Successfully fetched purchase requests');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_PURCHASES, payload: response.data });
    }
    return response;
}

export const fetchAllPurchaseRequests = () => async (dispatch) => {
    console.log(`Actions: Fetch all purchase requests`);
    var response = null;
    await app.get(`/purchases/get/all`)
        .then(res => {
            console.log('Successfully fetched all purchase requests');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        dispatch ({ type: FETCH_ALL_PURCHASES, payload: response.data });
    }
    return response;
}

export const createPurchaseRequest = (purchase) => async (dispatch) => {
    console.log(`Actions: Create purchase request`);
    var response = null;
    const { 
        time, 
        status, 
        mentor_email, 
        payer_email, 
        receiver_email, 
        category, 
        item_name,
        item_id, 
        cost, 
        quantity
    } = purchase;
    await app.post(`/purchases/post/${time}/${status}/${mentor_email}/${payer_email}/${receiver_email}/${category}/${item_name}/${item_id}/${cost}/${quantity}`)
        .then(res => {
            console.log('Successfully created purchase request');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        dispatch ({ type: FETCH_ALL_PURCHASES, payload: response.data });
    }
    return response;
}

export const updatePurchaseRequest = (purchase) => async (dispatch) => {
    console.log(`Actions: Update purchase request`);
    var response = null;
    const { 
        id,
        time, 
        status, 
        mentor_email, 
        payer_email, 
        receiver_email, 
        category, 
        item_name,
        item_id, 
        cost, 
        quantity,
        notes
    } = purchase;
    await app.put(`/purchases/put/${id}/${time}/${status}/${mentor_email}/${payer_email}/${receiver_email}/${category}/${item_name}/${item_id}/${cost}/${quantity}/${notes}`)
        .then(res => {
            console.log('Successfully updated purchase request');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        dispatch ({ type: FETCH_ALL_PURCHASES, payload: response.data });
    }
    return response;
}

export const purchaseUpdateStatus = (id, status, notes) => async () => {
    console.log(`Actions: Update purchase request status`);
    var response = null;
    await app.put(`/purchases/status/put/${id}/${status}/${notes}`)
        .then(res => {
            console.log('Successfully updated purchase request status');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const deletePurchaseRequest = (id) => async () => {
    console.log(`Actions: DELETE purchase request with id ${id}`);
    var response = null;
    await app.delete(`/purchases/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted purchase request');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const clearPurchasesList = () => async (dispatch) => {
    dispatch({ type: CLEAR_PURCHASES_QUEUE });
}

export const purchaseCheckFunds = email => async () => {
    console.log(`Actions: Purchases: Check Funds`);
    var response = null;
    await app.get(`/purchases/tribute-stats/check-funds/get/${email}`)
        .then(res => {
            console.log('Successfully checked funds');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const purchaseUpdateFunds = (email, amount) => async () => {
    console.log(`Actions: Purchases: Update Funds`);
    var response = null;
    await app.put(`/purchases/tribute-stats/update-funds/put/${email}/${amount}`)
        .then(res => {
            console.log('Successfully updated funds');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const purchaseUpdateItemQuantity = (id, quantity) => async () => {
    console.log(`Actions: Purchases: Update Item Quantity`);
    var response = null;
    await app.put(`/purchases/items/put/${id}/${quantity}`)
        .then(res => {
            console.log('Successfully updated item quantity');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const purchaseCreateLifeEvent = (email, time) => async () => {
    console.log(`Actions: Purchases: Create Life Event`);
    var response = null;
    await app.post(`/purchases/life-events/post/${email}/${time}`)
        .then(res => {
            console.log('Successfully created life event');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const purchaseUpdateTributeLives = (email) => async () => {
    console.log(`Actions: Purchases: Update Tribute Life Count`);
    var response = null;
    await app.put(`/purchases/tribute-stats/lives/put/${email}`)
        .then(res => {
            console.log('Successfully updated tribute life count');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const purchaseCreateResourceEvent = (email, type, time) => async () => {
    console.log(`Actions: Purchases: Create resource event`);
    var response = null;
    await app.post(`/purchases/resources/post/${email}/${type}/${time}`)
        .then(res => {
            console.log('Successfully created resource event');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const purchaseUpdateTributeResources = (email, formattedType) => async () => {
    console.log(`Actions: Purchases: Update tribute resource count`);
    var response = null;
    await app.put(`/purchases/tribute-stats/resources/put/${email}/${formattedType}`)
        .then(res => {
            console.log('Successfully updated tribute resource count');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const purchaseGiveImmunity = email => async () => {
    console.log(`Actions: Purchases: Give tribute immunity`);
    var response = null;
    await app.put(`/purchases/tribute-stats/immunity/put/${email}`)
        .then(res => {
            console.log('Successfully gave tribute immunity');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const transferFunds = (emailFrom, emailTo, amount) => async () => {
    console.log(`Actions: Purchases: Transfer tribute balance`);
    var response = null;
    await app.put(`/purchases/tribute-stats/funds-transfer/put/${emailFrom}/${emailTo}/${amount}`)
        .then(res => {
            console.log('Successfully transferred tribute balance');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

//######################## (8) Game State Management #########################//

export const fetchServerTime = () => async (dispatch) => {
    console.log(`Actions: Get Server Time Initiated`);
    var response = null;
    await app.get(`/game-state/get/server-time`)
        .then(res => {
            console.log('Successfully fetched server time');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    if(response && response.data && response.data[0]){
        return response.data[0].CURRENT_TIMESTAMP;
    } else {
        return null;
    }
}

export const fetchGameState = () => async (dispatch) => {
    console.log(`Actions: Fetch Game State initiated`);
    var response = null;
    await app.get(`/game-state/get`)
        .then(res => {
            console.log('Successfully Fetched Game State');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_GAMESTATE, payload: response.data });
    }
    return response;
}

export const fetchGameStatePriceTier = () => async () => {
    console.log(`Actions: Fetch price tier`);
    var response = null;
    await app.get(`/game-state/get/price-tier`)
        .then(res => {
            console.log('Successfully fetched price tier');
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    
    return response.data[0].current_price_tier;
}

export const updateGameStartTime = time => async () => {
    console.log(`Actions: Set Game Time initiated with value ${time}`);
    var response = null;
    await app.put(`/game-state/put/game-time/${time}`)
        .then(res => {
            console.log(`Successfully game start time`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

export const updateGameState = (maxDistricts, areas) => async () => {
    console.log(`Actions: Set Max Districts initiated: ${maxDistricts} districts and areas: ${areas}`);
    var response = null;
    await app.put(`/game-state/put/${maxDistricts}/${areas}`)
        .then(res => {
            console.log(`Successfully updated game state`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

//##################### (9) Tribute Stats and Dashboard ######################//

export const fetchTributeStats = email => async (dispatch) => {
    console.log(`Actions: Fetch tribute stats for ${email}`);
    var response = null;
    await app.get(`/tribute-stats/get/${email}`)
        .then(res => {
            console.log(`Successfully fetched tribute stats`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    if(response && response.data){
        dispatch ({ type: FETCH_TRIBUTE_STAT, payload: response.data[0] });
    }
    return response;
}

//############################ (10) Global Events ############################//

// FETCH_GLOBAL_EVENT
export const fetchGlobalEvent = id => async (dispatch) => {
    console.log(`Actions: Fetch global event with id ${id}`);
    var response = null;
    await app.get(`/global-events/get/single/${id}`)
        .then(res => {
            console.log(`Successfully fetched global event`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    if(response && response.data){
        dispatch ({ type: FETCH_GLOBAL_EVENT, payload: response.data[0] });
    }
    return response;
}

// FETCH_GLOBAL_EVENTS (All)
export const fetchGlobalEvents = () => async (dispatch) => {
    console.log(`Actions: Fetch all global events`);
    var response = null;
    await app.get(`/global-events/get/all`)
        .then(res => {
            console.log(`Successfully fetched global events`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    if(response && response.data){
        dispatch ({ type: FETCH_GLOBAL_EVENTS, payload: response.data });
    }
    return response;
}

// CREATE_GLOBAL_EVENT
export const createGlobalEvent = (event) => async () => {
    console.log(`Actions: Create global event`);
    var response = null;
    await app.post(`/global-events/post/${event.type}/${event.description}/${event.message}/${event.notification_time}/${event.event_end_time}/${event.start_action_code}/${event.end_action_code}`)
        .then(res => {
            console.log(`Successfully created global event`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

// UPDATE_GLOBAL_EVENT
export const updateGlobalEvent = (event) => async () => {
    console.log(`Actions: Update global event`);
    var response = null;
    await app.put(`/global-events/put/${event.id}/${event.type}/${event.description}/${event.message}/${event.notification_time}/${event.event_end_time}/${event.start_action_code}/${event.end_action_code}/${event.status}`)
        .then(res => {
            console.log(`Successfully updated global event`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}

// DELETE_GLOBAL_EVENT
export const deleteGlobalEvent = id => async () => {
    console.log(`Actions: Delete global event with id ${id}`);
    var response = null;
    await app.delete(`/global-events/delete/${id}`)
        .then(res => {
            console.log(`Successfully deleted global event`);
            response = res;
        })
        .catch(err => {
            console.log(err);
        });
    return response;
}