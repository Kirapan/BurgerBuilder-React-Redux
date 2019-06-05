import {put, delay, call} from 'redux-saga/effects'
import * as actions from '../actions/index'
import axios from 'axios'

export function* logoutSaga (action) {
    yield call([localStorage, 'removeItem'], 'token');
    yield call([localStorage, 'removeItem'], 'expirationDate');
    yield call([localStorage, 'removeItem'], 'userId');
    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeOut(action) {
    yield delay(action.experationTime * 1000)
    yield put(actions.logout)
}

export function* authUserSaga(action) {
    yield put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCCZ-14GwOtpd6WoLCVjSouv8aSipVuM6I';
    if(!action.isSignup) {
        url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCCZ-14GwOtpd6WoLCVjSouv8aSipVuM6I'
    }
    try{
        const res = yield axios.post(url, authData)
        const expirationDate = yield new Date(new Date().getTime() + res.data.expiresIn * 1000);
        yield localStorage.setItem('token', res.data.idToken)
        yield localStorage.setItem('expirationDate', expirationDate)
        yield localStorage.setItem('userId', res.data.localId)
        yield put(actions.authSuccess(res.data.idToken, res.data.localId));
        yield put(actions.checkAuthTimeOut(res.data.expiresIn));
    } catch (e) {
        yield put(actions.authFail(e.response.data.error));
    }
}

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token');
        if (!token) {
            yield put(actions.logout());
        } else {
            const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
            if (expirationDate > new Date()) {
                const userId = yield localStorage.getItem('userId')
                yield put(actions.authSuccess(token, userId));
                yield put(actions.checkAuthTimeOut((expirationDate.getTime() - new Date().getTime()) / 1000));
            } else {
                yield put(actions.logout());
            }
        }
}
