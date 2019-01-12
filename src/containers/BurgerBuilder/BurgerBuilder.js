import React, { Component } from 'react';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICE = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount = async () => {
    try {
      const res= await axios.get('https://react-burgerbuilder-80bd3.firebaseio.com/ingredients.json');
      this.setState({ingredients: res.data})
    }
    catch(e) {
      this.setState({error: true})
    }
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients).map(key => {
      return ingredients[key];
    }).reduce((sum, el) => {
      return sum + el;
    }, 0)
    this.setState({purchasable: sum > 0})
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice =  oldPrice + priceAddition;
    this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
    this.updatePurchaseState(updatedIngredients)
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <=0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    }
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICE[type];
    const oldPrice = this.state.totalPrice;
    const newPrice =  oldPrice - priceDeduction;
    this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
    this.updatePurchaseState(updatedIngredients)
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = async () => {
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Max Max',
        address: {
          street: 'Test 1',
          zipCode: '43210',
          country: 'Germany',
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    };
    try {
      await axios.post('/orders.json', order);
      this.setState({loading: false, purchasing: false});
    }
    catch (error) {
      this.setState({loading: false, purchasing: false});
    }
  }

  render () {
    const disabledInfo = {
      ...this.state.ingredients
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0 
    }
    let orderSummary = null;
    let burger = this.state.error? <p>The ingredients can not be loaded</p> : <Spinner />
    if(this.state.ingredients) {
      burger = (
        <>
        <Burger ingredients={this.state.ingredients}/>
        <BuildControls 
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disabledInfo}
          ordered={this.purchaseHandler}
          purchasable={this.state.purchasable}
          price={this.state.totalPrice} />
        </>);
        orderSummary = <OrderSummary ingredients={this.state.ingredients} purchaseCancelled={this.purchaseCancelHandler} purchaseContinued={this.purchaseContinueHandler} price={this.state.totalPrice}/>
    };
    if(this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);