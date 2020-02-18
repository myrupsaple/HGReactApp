import { FETCH_GLOBAL_EVENT } from '../actions/types';

export default (state = {}, action) => {
    switch(action.type){
        case FETCH_GLOBAL_EVENT:
            const globalEvent = action.payload;
            if(!globalEvent){
                return {};
            }
            return {
                id: globalEvent.id,
                type: globalEvent.type,
                name: globalEvent.name,
                description: globalEvent.description,
                message: globalEvent.message,
                notification_time: globalEvent.notification_time,
                event_end_time: globalEvent.event_end_time,
                start_action_code: globalEvent.start_action_code,
                end_action_code: globalEvent.end_action_code,
                status: globalEvent.status
            };
        default:
            return state;
    }
};