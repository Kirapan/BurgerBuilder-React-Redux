import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-burgerbuilder-80bd3.firebaseio.com/'
})

export default instance;