import {createContext, useReducer} from "react";
import Cookies from "js-cookie";

export const Store = createContext()
const initialState = {
  darkMode : false,
	cart: {
		cartItems: [],
		shippingAddress: {}
	},
	userInfo: null
}

function reducer(state, action){
  switch (action.type){
    case 'DARK_MODE_ON':
      return {...state, darkMode: true}
    case 'DARK_MODE_OFF':
      return {...state, darkMode: false}
		case 'CART_FIRST':{
			const first = action.payload
			return {...state, cart: {...state.cart, cartItems: first}}
		}
		case 'CART_ADD_ITEM':{
			const newItem = action.payload
			const exitsItem = state.cart.cartItems.find((item)=> item._id === newItem._id)
			const cartItems = exitsItem ?
				state.cart.cartItems.map((item)=> item.name === exitsItem.name ? newItem : item) :
				[...state.cart.cartItems, newItem]
			Cookies.set('cartItems', JSON.stringify(cartItems))
			return {...state, cart:{...state.cart, cartItems}}
		}
		case 'REMOVE_ITEM':{
			const cartItems = state.cart.cartItems.filter(item => item._id !== action.payload._id)
			Cookies.set('cartItems', JSON.stringify(cartItems))
			return {...state, cart:{...state.cart, cartItems}}
		}
		case 'CART_CLEAR':{
			return {...state, cart: {...state.cart, cartItems: []}}
		}
		case 'SAVE_SHIPPING_ADDRESS':{
			return {...state, cart:{...state.cart, shippingAddress: action.payload}}
		}
		case 'SAVE_PAYMENT_METHOD':{
			return {...state, cart:{...state.cart, paymentMethod: action.payload}}
		}
		case 'USER_LOGIN':{
			return {...state, userInfo: action.payload}
		}
		case 'USER_LOGOUT':{
			Cookies.remove('userInfo')
			Cookies.remove('cartItems')
			Cookies.remove('shippingAddress')
			Cookies.remove('paymentMethod')
			return {...state, userInfo: null, cart: {cartItems: [], shippingAddress: {} , paymentMethod: ''}}
		}
    default:
      return state
  }
}

export function StoreProvider(props){
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = {state, dispatch}
  return <Store.Provider value={value} >{props.children}</Store.Provider>
}

