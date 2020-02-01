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
    FETCH_ALL_PURCHASES,
    FETCH_GAMESTATE
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
};

export const fetchUsers = (type, query) => async (dispatch) => {
    console.log(`Actions: Fetch users initiated: ${type} containing '${query}'`);
    var response = null;
    await app.get(`/users/get/${type}/${query}`)
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
    await app.get(`/users/get`)
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
    await app.put(`/user/put/${user.id}/${user.first_name}/${user.last_name}/${user.email}/${user.permissions}`)
        .then(res => {
            console.log(`Successfully updated user ${user.email}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const createUser = user => async dispatch => {
    console.log('Actions: Create user initiated');
    await app.post(`/user/post/${user.first_name}/${user.last_name}/${user.email}/${user.permissions}`)
        .then(res => {
            console.log(`Successfully created user ${user.email}`);
        })
        .catch(err => {
            console.log(err);
        })
}

export const deleteUser = id => async dispatch => {
    console.log(`Actions: DELETE user initiated with id ${id}`);
    await app.delete(`/user/delete/${id}`)
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
    await app.get(`/tribute/info/get/${email}`)
        .then(res => {
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
}

export const fetchTributes = () => async dispatch => {
    console.log(`Actions: Fetch all tributes initiated`);
    var response = null;
    await app.get(`/tributes/info/get`)
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
    await app.post(`/tribute/info/post/${tribute.first_name}/${tribute.last_name}/${tribute.email}/${tribute.district}/${tribute.districtPartner}/${tribute.area}/${tribute.mentor}/${tribute.paidRegistration}`)
        .then(res => {
            console.log(`Successfully created tribute ${tribute.email}`);
        })
        .catch(err => {
            console.log(err);
        })
}

export const updateTribute = tribute => async dispatch => {
    console.log('Actions: Update tribute initiated');
    await app.put(`/tribute/info/put/${tribute.id}/${tribute.first_name}/${tribute.last_name}/${tribute.email}/${tribute.district}/${tribute.districtPartner}/${tribute.area}/${tribute.mentor}/${tribute.paidRegistration}`)
        .then(res => {
            console.log(`Successfully updated tribute ${tribute.email}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const deleteTribute = id => async dispatch => {
    console.log(`Actions: DELETE tribute initiated with id ${id}`);
    await app.delete(`/tribute/info/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted tribute');
        })
        .catch(err => {
            console.log(err);
        })
}

//######################### (3) DONATION MANAGEMENT ##########################//

export const fetchDonation = id => async (dispatch) => {
    console.log('Actions: Fetch donation initiated');
    var response = null;
    await app.get(`/donation/get/${id}`)
        .then(res => {
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
};

export const fetchDonations = (type, query) => async (dispatch) => {
    console.log(`Actions: Fetch donations initiated: ${type} containing '${query}'`);
    var response = null;
    await app.get(`/donations/get/${type}/${query}`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for donations');
        dispatch ({ type: FETCH_DONATIONS, payload: response.data });
    }
};

export const fetchDonationsRange = (type, query1, query2) => async (dispatch) => {
    console.log(`Actions: Fetch donations range initiated: ${type} between ${query1} and ${query2}`);
    var response = null;
    await app.get(`/donations/get/range/${type}/${query1}/${query2}`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for donations range');
        dispatch ({ type: FETCH_DONATIONS, payload: response.data });
    }
};

export const fetchAllDonations = () => async (dispatch) => {
    console.log('Actions: Fetch all donations initiated');
    var response = null;
    await app.get(`/donations/get/all`)
        .then(res => {
        response = res;
    })
    .catch(err => {
        console.log(err);
    });
    
    if(response && response.data){
        console.log('Successfully retrieved donations list');
        dispatch ({ type: FETCH_ALL_DONATIONS, payload: response.data });
    }
};

export const createDonation = donation => async dispatch => {
    console.log('Actions: Create donation initiated');
    await app.post(`/donations/post/${donation.email}/${donation.donor}/${donation.method}/${donation.date}/${donation.amount}/${donation.tags}`)
        .then(res => {
            console.log(`Successfully created donation of ${donation.amount}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const updateDonation = donation => async dispatch => {
    console.log('Actions: Update donation initiated');
    await app.put(`/donations/put/${donation.id}/${donation.email}/${donation.donor}/${donation.method}/${donation.date}/${donation.amount}/${donation.tags}`)
        .then(res => {
            console.log(`Successfully updated donation ${donation.id}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const deleteDonation = id => async dispatch => {
    console.log(`Actions: DELETE donation initiated with id ${id}`);
    await app.delete(`/donations/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted donation');
        })
        .catch(err => {
            console.log(err);
        });
}

export const clearDonationsList = () => async dispatch => {
    dispatch({ type: CLEAR_DONATIONS_QUEUE });
}

//############################ (4a) Resource List ############################//
export const fetchResourceListItem = id => async (dispatch) => {
    console.log('Actions: Fetch resource list item initiated');
    var response = null;
    await app.get(`/resource/list/get/single/${id}`)
        .then(res => {
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
};

export const fetchResourceListItems = (type, query) => async (dispatch) => {
    console.log(`Actions: Fetch resource list items initiated: ${type} containing '${query}'`);
    var response = null;
    await app.get(`/resource/list/get/list/${type}/${query}`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for resource list items');
        dispatch ({ type: FETCH_RESOURCE_LIST_ITEMS, payload: response.data });
    }
};

export const fetchResourceListItemRange = (type, query1, query2) => async (dispatch) => {
    console.log(`Actions: Fetch resource list items range initiated: ${type} between ${query1} and ${query2}`);
    var response = null;
    await app.get(`/resource/list/get/range/${type}/${query1}/${query2}`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for resource list items range');
        dispatch ({ type: FETCH_RESOURCE_LIST_ITEMS, payload: response.data });
    }
};

export const fetchAllResourceListItems = () => async (dispatch) => {
    console.log('Actions: Fetch all resource list items initiated');
    var response = null;
    await app.get(`/resource/list/get/all`)
        .then(res => {
        response = res;
    })
    .catch(err => {
        console.log(err);
    });
    
    if(response && response.data){
        console.log('Successfully retrieved resource list');
        dispatch ({ type: FETCH_ALL_RESOURCE_LIST_ITEMS, payload: response.data });
    }
};

export const createResourceListItem = item => async dispatch => {
    console.log('Actions: Create resource list item initiated');
    await app.post(`/resource/list/post/${item.code}/${item.type}/${item.timesUsed}/${item.maxUses}/${item.usedBy}/${item.notes}`)
        .then(res => {
            console.log(`Successfully created resource list item of type ${item.type} via ${item.method}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const updateResourceListItem = item => async dispatch => {
    console.log('Actions: Update resource list item initiated');
    await app.put(`/resource/list/put/${item.id}/${item.code}/${item.type}/${item.timesUsed}/${item.maxUses}/${item.usedBy}/${item.notes}`)
        .then(res => {
            console.log(`Successfully updated resource list item ${item.id}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const deleteResourceListItem = id => async dispatch => {
    console.log(`Actions: DELETE resource list item initiated with id ${id}`);
    await app.delete(`/resource/list/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted resource list item');
        })
        .catch(err => {
            console.log(err);
        });
}

export const clearResourceList = () => async dispatch => {
    dispatch({ type: CLEAR_RESOURCE_LIST_QUEUE });
}

//########################### (4b) Resource Events ###########################//
export const fetchResourceEvent = id => async (dispatch) => {
    console.log('Actions: Fetch resource event initiated');
    var response = null;
    await app.get(`/resource/events/get/single/${id}`)
        .then(res => {
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
};

export const fetchResourceEvents = (type, query) => async (dispatch) => {
    console.log(`Actions: Fetch resource event initiated: ${type} containing '${query}'`);
    var response = null;
    await app.get(`/resource/events/get/list/${type}/${query}`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for resource event');
        dispatch ({ type: FETCH_RESOURCE_EVENTS, payload: response.data });
    }
};

export const fetchResourceEventsRange = (type, query1, query2) => async (dispatch) => {
    console.log(`Actions: Fetch resource events range initiated: ${type} between ${query1} and ${query2}`);
    var response = null;
    await app.get(`/resource/events/get/range/${type}/${query1}/${query2}`)
        .then(res => {
            response = res;
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        console.log('Successfully searched for resource event range');
        dispatch ({ type: FETCH_RESOURCE_EVENTS, payload: response.data });
    }
};

export const fetchAllResourceEvents = () => async (dispatch) => {
    console.log('Actions: Fetch all resource events initiated');
    var response = null;
    await app.get(`/resource/events/get/all`)
        .then(res => {
        response = res;
    })
    .catch(err => {
        console.log(err);
    });
    
    if(response && response.data){
        console.log('Successfully retrieved all resource events');
        dispatch ({ type: FETCH_ALL_RESOURCE_EVENTS, payload: response.data });
    }
};

export const createResourceEvent = item => async dispatch => {
    console.log('Actions: Create resource event initiated');
    await app.post(`/resource/events/post/${item.email}/${item.type}/${item.method}/${item.time}/${item.notes}`)
        .then(res => {
            console.log(`Successfully created resource event of ${item.type} via ${item.method}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const updateResourceEvent = item => async dispatch => {
    console.log('Actions: Update resource event initiated');
    await app.put(`/resource/events/put/${item.id}/${item.email}/${item.type}/${item.method}/${item.time}/${item.notes}`)
        .then(res => {
            console.log(`Successfully updated resource event ${item.id}`);
        })
        .catch(err => {
            console.log(err);
        });
}

export const deleteResourceEvent = id => async dispatch => {
    console.log(`Actions: DELETE resource event initiated with id ${id}`);
    await app.delete(`/resource/events/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted resource event');
        })
        .catch(err => {
            console.log(err);
        });
}

export const clearResourceEvents = () => async dispatch => {
    dispatch({ type: CLEAR_RESOURCE_EVENT_QUEUE });
}

//########################### (5) Life Management ############################//

export const fetchLifeEvent = id => async dispatch => {
    console.log(`Actions: Get Life Event initiated with id ${id}`);
    var response = null;
    await app.get(`/life-events/get/single/${id}`)
        .then(res => {
            response = res;
            console.log('Successfully Fetched Life Event');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_LIFE_EVENT, payload: response.data[0] });
    }
}

export const fetchLifeEvents = (type, query) => async dispatch => {
    console.log(`Actions: Get Life Event List initiated: ${type} with query ${query}`);
    var response = null;
    await app.get(`/life-events/get/list/${type}/${query}`)
        .then(res => {
            response = res;
            console.log('Successfully Fetched Life Events');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_LIFE_EVENTS, payload: response.data });
    }
}

export const fetchLifeEventsRange = (type, queryLower, queryUpper) => async dispatch => {
    console.log(`Actions: Get Life Event Range: ${type} from ${queryLower} to ${queryUpper}`);
    var response = null;
    await app.get(`/life-events/get/range/${type}/${queryLower}/${queryUpper}`)
        .then(res => {
            response = res;
            console.log('Successfully Fetched Life Event Range');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_LIFE_EVENTS, payload: response.data });
    }
}

export const fetchAllLifeEvents = () => async dispatch => {
    console.log(`Actions: Get All Life Events`);
    var response = null;
    await app.get(`/life-events/get/all`)
        .then(res => {
            response = res;
            console.log('Successfully Fetched All Life Events');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ALL_LIFE_EVENTS, payload: response.data });
    }
}

export const createLifeEvent = (lifeEvent) => async dispatch => {
    console.log(`Actions: Create Life Event`);
    await app.post(`/life-events/post/${lifeEvent.email}/${lifeEvent.type}/${lifeEvent.method}/${lifeEvent.time}/${lifeEvent.notes}`)
        .then(res => {
            console.log('Successfully Created Life Event');
        })
        .catch(err => {
            console.log(err);
        });
}

export const updateLifeEvent = (lifeEvent) => async dispatch => {
    console.log(`Actions: Update Life Event`);
    await app.put(`/life-events/put/${lifeEvent.id}/${lifeEvent.email}/${lifeEvent.type}/${lifeEvent.method}/${lifeEvent.time}/${lifeEvent.notes}`)
        .then(res => {
            console.log('Successfully Updated Life Event');
        })
        .catch(err => {
            console.log(err);
        });
}

export const deleteLifeEvent = (id) => async dispatch => {
    console.log(`Actions: DELETE Life Event with id ${id}`);
    await app.delete(`/life-events/delete/${id}`)
        .then(res => {
            console.log('Successfully Deleted Life Event');
        })
        .catch(err => {
            console.log(err);
        });
}

export const clearLifeEventsList = () => async dispatch => {
    dispatch({ type: CLEAR_LIFE_EVENTS_QUEUE });
}

//############################## (6) Item List ###############################//

export const fetchItem = id => async dispatch => {
    console.log(`Actions: Get Item initiated with id ${id}`);
    var response = null;
    await app.get(`/item-list/get/single/${id}`)
        .then(res => {
            response = res;
            console.log('Successfully Fetched Item');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ITEM, payload: response.data[0] });
    }
}

export const fetchItems = (type, query) => async dispatch => {
    console.log(`Actions: Get Item List initiated: ${type} with query ${query}`);
    var response = null;
    await app.get(`/item-list/get/list/${type}/${query}`)
        .then(res => {
            response = res;
            console.log('Successfully Fetched Items');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ITEMS, payload: response.data });
    }
}

export const fetchAllItems = () => async dispatch => {
    console.log(`Actions: Get All Items`);
    var response = null;
    await app.get(`/item-list/get/all`)
        .then(res => {
            response = res;
            console.log('Successfully Fetched All Items');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ALL_ITEMS, payload: response.data });
    }
}

export const createItem = (item) => async dispatch => {
    console.log(`Actions: Create Item`);
    await app.post(`/item-list/post/${item.name}/${item.description}/${item.quantity}/${item.tier1_cost}/${item.tier2_cost}/${item.tier3_cost}/${item.tier4_cost}`)
        .then(res => {
            console.log('Successfully Created Item');
        })
        .catch(err => {
            console.log(err);
        });
}

export const updateItem = (item) => async dispatch => {
    console.log(`Actions: Update Item`);
    await app.put(`/item-list/put/${item.id}/${item.name}/${item.description}/${item.quantity}/${item.tier1_cost}/${item.tier2_cost}/${item.tier3_cost}/${item.tier4_cost}`)
        .then(res => {
            console.log('Successfully Updated Item');
        })
        .catch(err => {
            console.log(err);
        });
}

export const deleteItem = (id) => async dispatch => {
    console.log(`Actions: DELETE Item with id ${id}`);
    await app.delete(`/item-list/delete/${id}`)
        .then(res => {
            console.log('Successfully Deleted Item');
        })
        .catch(err => {
            console.log(err);
        });
}

//############################## (7) Purchases ###############################//

export const fetchMentors = () => async dispatch => {
    console.log(`Actions: Fetch mentors list`);
    var response = null;
    await app.get(`/purchases/get/mentors`)
        .then(res => {
            response = res;
            console.log('Successfully fetched mentors');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_ALL_MENTORS, payload: response.data });
    }
}

export const fetchPurchaseRequest = (id) => async dispatch => {
    console.log(`Actions: Fetch purchase request with id ${id}`);
    var response = null;
    await app.get(`/purchases/get/single/${id}`)
        .then(res => {
            response = res;
            console.log('Successfully fetched purchase request');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_PURCHASE, payload: response.data[0] });
    }
}

export const fetchAllPurchaseRequests = () => async dispatch => {
    console.log(`Actions: Fetch all purchase requests`);
    var response = null;
    await app.get(`/purchases/get/all`)
        .then(res => {
            response = res;
            console.log('Successfully fetched all purchase requests');
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        dispatch ({ type: FETCH_ALL_PURCHASES, payload: response.data });
    }
}

export const createPurchaseRequest = (purchase) => async dispatch => {
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
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        dispatch ({ type: FETCH_ALL_PURCHASES, payload: response.data });
    }
}

export const updatePurchaseRequest = (purchase) => async dispatch => {
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
        quantity
    } = purchase;
    await app.put(`/purchases/put/${id}/${time}/${status}/${mentor_email}/${payer_email}/${receiver_email}/${category}/${item_name}/${item_id}/${cost}/${quantity}`)
        .then(res => {
            console.log('Successfully updated purchase request');
        })
        .catch(err => {
            console.log(err);
        });

    if(response && response.data){
        dispatch ({ type: FETCH_ALL_PURCHASES, payload: response.data });
    }
}

export const purchaseUpdateStatus = (id, status) => async dispatch => {
    console.log(`Actions: Update purchase request status`);
    await app.put(`/purchases/status/put/${id}/${status}`)
        .then(res => {
            console.log('Successfully updated purchase request status');
        })
        .catch(err => {
            console.log(err);
        });
}

export const deletePurchaseRequest = (id) => async dispatch => {
    console.log(`Actions: DELETE purchase request with id ${id}`);
    await app.delete(`/purchases/delete/${id}`)
        .then(res => {
            console.log('Successfully deleted purchase request');
        })
        .catch(err => {
            console.log(err);
        });
}

export const purchaseCheckFunds = email => async dispatch => {
    console.log(`Actions: Purchases: Check Funds`);
    await app.get(`/purchases/tribute-stats/check-funds/get/${email}`)
        .then(res => {
            console.log('Successfully checked funds');
        })
        .catch(err => {
            console.log(err);
        });
}

export const purchaseUpdateFunds = (email, amount) => async dispatch => {
    console.log(`Actions: Purchases: Update Funds`);
    await app.put(`/purchases/tribute-stats/update-funds/put/${email}/${amount}`)
        .then(res => {
            console.log('Successfully updated funds');
        })
        .catch(err => {
            console.log(err);
        });
}

export const purchaseUpdateItemQuantity = (id, quantity) => async dispatch => {
    console.log(`Actions: Purchases: Update Item Quantity`);
    await app.put(`/purchases/items/put/${id}/${quantity}`)
        .then(res => {
            console.log('Successfully updated item quantity');
        })
        .catch(err => {
            console.log(err);
        });
}

export const purchaseCreateLifeEvent = (email, time, notes) => async dispatch => {
    console.log(`Actions: Purchases: Create Life Event`);
    const type = 'gained';
    const method = 'purchased';
    await app.post(`/purchases/life-events/post/${email}/${type}/${method}/${time}/${notes}`)
        .then(res => {
            console.log('Successfully created life event');
        })
        .catch(err => {
            console.log(err);
        });
}

export const purchaseUpdateTributeLives = (email) => async dispatch => {
    console.log(`Actions: Purchases: Update Tribute Life Count`);
    await app.put(`/purchases/tribute-stats/lives/put/${email}`)
        .then(res => {
            console.log('Successfully updated tribute life count');
        })
        .catch(err => {
            console.log(err);
        });
}

export const purchaseCreateResourceEvent = (email, type, time, notes) => async dispatch => {
    console.log(`Actions: Purchases: Create resource event`);

    await app.post(`/purchases/resources/post/${email}/${type}/${time}/${notes}`)
        .then(res => {
            console.log('Successfully created resource event');
        })
        .catch(err => {
            console.log(err);
        });
}

export const purchaseUpdateTributeResources = (email, formattedType) => async dispatch => {
    console.log(`Actions: Purchases: Update tribute resource count`);
    await app.put(`/purchases/tribute-stats/resources/put/${email}/${formattedType}`)
        .then(res => {
            console.log('Successfully updated tribute resource count');
        })
        .catch(err => {
            console.log(err);
        });
}

export const purchaseGiveImmunity = email => async dispatch => {
    console.log(`Actions: Purchases: Give tribute immunity`);
    await app.put(`/purchases/tribute-stats/immunity/put/${email}`)
        .then(res => {
            console.log('Successfully gave tribute immunity');
        })
        .catch(err => {
            console.log(err);
        });
}

export const transferFunds = (emailFrom, emailTo, amount) => async dispatch => {
    console.log(`Actions: Purchases: Transfer tribute balance`);
    await app.put(`/purchases/tribute-stats/funds-transfer/put/${emailFrom}/${emailTo}/${amount}`)
        .then(res => {
            console.log('Successfully transferred tribute balance');
        })
        .catch(err => {
            console.log(err);
        });
}

//######################## (8) Game State Management #########################//

export const getGameState = () => async dispatch => {
    console.log(`Actions: Get Game State initiated`);
    var response = null;
    await app.get(`/game-state/get`)
        .then(res => {
            response = res;
            console.log('Successfully Fetched Game State');
        })
        .catch(err => {
            console.log(err);
        });
    
    if(response && response.data){
        dispatch ({ type: FETCH_GAMESTATE, payload: response.data });
    }
}

export const setGameStartTime = time => async dispatch => {
    console.log(`Actions: Set Game Time initiated with value ${time}`);
    await app.put(`/game-state/put/game-time/${time}`)
        .then(res => {
            console.log(`Successfully game start time`);
        })
        .catch(err => {
            console.log(err);
        });
}