import { combineReducers } from 'redux';
import configReducer from './configReducer'
import authReducer from './authReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';
import tributeReducer from './tributeReducer';
import tributesReducer from './tributesReducer';
import donationReducer from './donationReducer';
import donationsReducer from './donationsReducer';
import resourceListItemReducer from './resourceListItemReducer';
import resourceListItemsReducer from './resourceListItemsReducer';
import resourceEventReducer from './resourceEventReducer';
import resourceEventsReducer from './resourceEventsReducer';
import lifeEventReducer from './lifeEventReducer';
import lifeEventsReducer from './lifeEventsReducer';
import gameStateReducer from './gameStateReducer';

export default combineReducers({
    config: configReducer,
    auth: authReducer,
    selectedUser: userReducer,
    users: usersReducer,
    selectedTribute: tributeReducer,
    tributes: tributesReducer,
    selectedDonation: donationReducer,
    donations: donationsReducer,
    selectedResourceListItem: resourceListItemReducer,
    resourceListItems: resourceListItemsReducer,
    selectedResourceEvent: resourceEventReducer,
    resourceEvent: resourceEventsReducer,
    selectedLifeEvent: lifeEventReducer,
    lifeEvents: lifeEventsReducer,
    gameState: gameStateReducer
});