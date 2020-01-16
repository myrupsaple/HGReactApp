import React from 'react';
import { useSelector } from 'react-redux';

import Wait from '../../../components/Wait';

const CheckAuth = async (allowedGroups) => {
    var payload = null

    const authLoaded = useSelector(state => state.auth.loaded);
    const isSignedIn = useSelector(state => state.auth.isSignedIn);

    var timeoutCounter = 0;
    while(!authLoaded){
        await Wait(500);
        timeoutCounter ++;
        console.log('waiting on authLoaded')
        if (timeoutCounter > 10){
            payload = <h3>Error. Could not load Google OAuth.</h3>;
        }
    }

    timeoutCounter = 0;
    if(payload === null){
        while(!isSignedIn){
            await Wait(500);
            timeoutCounter ++;
            console.log('waiting on isSignedIn');
            if (timeoutCounter > 10){
                payload = <h3>You must be signed in to view this content.</h3>;
            }
        }
    }

    const userPerms = useSelector(state => state.auth.userPerms);
    if(payload === null){
        for (let group of allowedGroups){
            if(userPerms === group){
                return payload;
            }
        }
    } else {
        return payload;
    }

    payload = <h3>You are not authorized to view this content.</h3>;
    return payload;
}

export default CheckAuth;