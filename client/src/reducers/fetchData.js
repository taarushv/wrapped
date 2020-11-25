import { FETCH_DATA_REQUEST, FETCH_DATA_SUCCESS, FETCH_DATA_FAILURE } from '../actions/fetchData';

export default function fetchDataReducer(state = {
    isFetching: true,
    errorMessage: '',
    data:''
}, action) {
    switch (action.type) {
        case FETCH_DATA_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case FETCH_DATA_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.payload,
            });
        case FETCH_DATA_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                errorMessage: action.payload,
            });
        default:
            return state; 
    }
}
