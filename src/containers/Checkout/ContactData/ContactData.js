import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = async (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
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
            this.setState({ loading: false });
            this.props.history.push('/');
        }
        catch (e) {
            console.log('i am error')
            this.setState({ loading: false  });
        }
        console.log('i am cool')
    }

    render() {
        let form = (
            <form>
                <input className='Input' type='text' name='name' placeholder='Your name' />
                <input className='Input' type='email' name='email' placeholder='Your email' />
                <input className='Input' type='text' name='street' placeholder='Street' />
                <input className='Input' type='text' name='postalcode' placeholder='Your Postal Code' />
                <Button btnType='Success' clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if(this.state.loading) {
            form = <Spinner />
        };
        return (
            <div className='ContactData'>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;