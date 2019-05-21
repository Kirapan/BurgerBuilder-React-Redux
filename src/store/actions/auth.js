import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeOut = (experationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, experationTime * 1000)
    }
}

export const auth = (email, password, isSignup) => {
    return async dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCCZ-14GwOtpd6WoLCVjSouv8aSipVuM6I';
        if(!isSignup) {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCCZ-14GwOtpd6WoLCVjSouv8aSipVuM6I'
        }
        try{
            const res = await axios.post(url, authData)
            console.log(res);
            dispatch(authSuccess(res.data.idToken, res.data.localId));
            dispatch(checkAuthTimeOut(res.data.expiresIn));
        } catch (e) {
            dispatch(authFail(e.response.data.error));
        }
    }
}
