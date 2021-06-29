import { combineReducers } from 'redux';
import userReducer from './userReducer';
import newsReducer from './newsReducer';
import itemReducer from './itemReducer';
import junkShopReducer from './junkShopReducer';
import contactReducer from './contactReducer';
import marketReducer from './marketPlaceReducer';
import walletReducer from './walletReducer';
// import { reducer as formReducer } from 'redux-form';

export default combineReducers({
    // form: formReducer,
    user: userReducer,
    news: newsReducer,
    item: itemReducer,
    junk_shop: junkShopReducer,
    contact: contactReducer,
    market_place: marketReducer,
    wallet: walletReducer,
})