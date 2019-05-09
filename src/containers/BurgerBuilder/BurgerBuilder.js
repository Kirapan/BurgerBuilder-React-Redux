import React, { Component } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
// import * as actionTypes from '../../store/actions/actionTypes';
import * as BurgerBuilderActions from '../../store/actions/index';

class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false,
    error: false
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients).map(key => {
      return ingredients[key];
    }).reduce((sum, el) => {
      return sum + el;
    }, 0)
    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = async () => {
    this.props.history.push('/checkout');
  }

  render () {
    const disabledInfo = {
      ...this.props.ings
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0 
    }
    let orderSummary = null;
    let burger = this.state.error? <p>The ingredients can not be loaded</p> : <Spinner />
    if(this.props.ings) {
      burger = (
        <>
        <Burger ingredients={this.props.ings}/>
        <BuildControls 
          ingredientAdded={this.props.onIngredientAdded }
          ingredientRemoved={this.props.onIngredientRemoved}
          disabled={disabledInfo}
          ordered={this.purchaseHandler}
          purchasable={this.updatePurchaseState(this.props.ings)}
          price={this.props.price} />
        </>);
        orderSummary = <OrderSummary ingredients={this.props.ings} purchaseCancelled={this.purchaseCancelHandler} purchaseContinued={this.purchaseContinueHandler} price={this.props.price}/>
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

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(BurgerBuilderActions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) => dispatch(BurgerBuilderActions.removeIngredient(ingName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler( BurgerBuilder, axios ));