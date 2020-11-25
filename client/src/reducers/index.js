import { combineReducers } from 'redux';
import auth from './auth';
import navigation from './navigation';
import alerts from './alerts';
import register from './register';
import fetchDataReducer from './fetchData'
export default combineReducers({
  alerts,
  auth,
  navigation,
  register,
  fetchDataReducer
});
