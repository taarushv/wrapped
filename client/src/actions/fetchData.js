import axios from 'axios'

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

const APIEndpoint = "http://wrapped-api.ngrok.io/v1"

const fetchDataRequest = () => {
    return {
        type: FETCH_DATA_REQUEST
    }
}
const fetchDataSuccess = data => {
    return {
        type: FETCH_DATA_SUCCESS,
        payload: data
    }
}
const fetchDataError = errorMsg => {
    return {
        type: FETCH_DATA_FAILURE,
        payload: errorMsg
    }
}
export const fetchData = () => {
    return (dispatch) => {
        dispatch(fetchDataRequest)
        console.log('making a GET req')
        axios.get(APIEndpoint).then(res => {
            const data = res.data
            console.log('Received')
            dispatch(fetchDataSuccess(data))
        }).catch(error => {
            const errorMsg = error.message
            dispatch(fetchDataError(errorMsg))
        })
    }
}