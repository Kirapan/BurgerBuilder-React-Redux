import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const purchaseBurgerSuccess = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id, 
        orderData: orderData
    }
}

export const purchaseBurgerFail = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    }
}

const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
}

export const purchaseBurger = (orderData) => {
    return async (dispatch) => {
        dispatch(purchaseBurgerStart());
        try {
            const res =  await axios.post('/orders.json', orderData);
            dispatch(purchaseBurgerSuccess(res.data.name, orderData))
        }
        catch (e) {
            dispatch(purchaseBurgerFail(e))
        }
    }
}

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    }
}

export const fetchOrdersSuccess = (orders) => {
    return {
        type: actionTypes.FETCH_ORDERS_SUCCESS,
        orders: orders
    }
}

export const fetchOrdersFail = (error) => {
    return {
        type: actionTypes.FETCH_ORDERS_FAIL,
        error: error
    }
}

export const fetchOrdersStart = () => {
    return {
        type: actionTypes.FETCH_ORDERS_START,
    }
}

export const fetchOrders = () => {
    return async dispatch => {
        dispatch(fetchOrdersStart());
        try {
            const res = await axios.get('/orders.json');
            const fetchedOrders = [];
            for(let key in res.data) {
                fetchedOrders.push({
                    ...res.data[key],
                    id: key
                });
            };
            dispatch(fetchOrdersSuccess(fetchedOrders))
        } catch(e) {
            dispatch(fetchOrdersFail(e))
        };
    }
}

