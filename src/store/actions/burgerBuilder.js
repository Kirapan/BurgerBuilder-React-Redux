import * as actionTypes from '../actions/actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    }
}

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    }
}

export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        ingredients : ingredients
    }
}

export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
}

export const initIngredients = () => {
    return async (dispatch) => {
        try {
            const res = await axios.get('https://react-burgerbuilder-80bd3.firebaseio.com/ingredients.json');
            dispatch(setIngredients(res.data))
        } catch (e) {
            dispatch(fetchIngredientsFailed())
        }
    }
}