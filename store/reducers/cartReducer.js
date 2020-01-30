import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cartAction";
import CartItem from "../../models/cartItemModel";
import { ADD_ORDER } from "../actions/ordersAction";
import { DELETE_PRODUCT } from "../actions/productsAction";

const initialState = {
  items: {},
  totalAmount: 0
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.payload;
      const productPrice = addedProduct.price;
      const productTitle = addedProduct.title;
      if (state.items[addedProduct.id]) {
        // item already in cart
        const updatedCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[addedProduct.id].sum + productPrice
        );
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: updatedCartItem },
          totalAmount: state.totalAmount + productPrice
        }
      } else {
        const newCartItem = new CartItem(1, productPrice, productTitle, productPrice)
        return {
          ...state,
          items: { ...state.items, [addedProduct.id]: newCartItem },
          totalAmount: state.totalAmount + productPrice
        }
      }
    case REMOVE_FROM_CART:
      const selectedCartItem =  state.items[action.payload]
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        // reduce it, not erase it
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        updatedCartItems = { ...state.items, [action.payload]: updatedCartItem }
        // return {
        //   ...state,
        //   items: { ...state.items, [action.payload]: updatedCartItem },
        //   totalAmount: state.totalAmount - selectedCartItem.productPrice
        // }
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.payload];
        // console.log(updatedCartItems)
      }  
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice
      }
    case ADD_ORDER:
      return initialState
    case DELETE_PRODUCT:
      if (!state.items[action.payload]) {
        return state;
      }
      const updatedItems = {...state.items};
      const itemTotal = state.items[action.payload].sum;
      delete updatedItems[action.payload];
      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - itemTotal
      }
  
    default:
      return state;
  }
}