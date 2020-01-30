import PRODUCTS from '../../data/dummy-data';
import Product from "../../models/productModel";
import { DELETE_PRODUCT, CREATE_PRODUCT, UPDATE_PRODUCT, SET_PRODUCTS } from '../actions/productsAction';

const initialState = {
  availableProducts: [],
  userProducts: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
      return {
        availableProducts: action.payload.loadedProducts,
        userProducts: action.payload.userProducts
      }

    case CREATE_PRODUCT:
      const newProduct = new Product(
        action.payload.id,
        action.payload.ownerId,
        action.payload.title,
        action.payload.imageUrl,
        action.payload.description,
        action.payload.price
      );
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      }

    case UPDATE_PRODUCT:
      const userProductIndex = state.userProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[userProductIndex].ownerId,
        action.payload.title,
        action.payload.imageUrl,
        action.payload.description,
        state.userProducts[userProductIndex].price
      );
      const updatedUserProducts = [...state.userProducts];
      updatedUserProducts[userProductIndex] = updatedProduct;

      const availableProductIndex = state.availableProducts.findIndex(
        prod => prod.id === action.pid
      );
      const updatedAvailableProduct = [...state.availableProducts];
      updatedAvailableProduct[availableProductIndex] = updatedProduct;

      return {
        ...state,
        availableProducts: updatedAvailableProduct,
        userProducts: updatedUserProducts
      }

    case DELETE_PRODUCT:
      return {
        ...state,
        availableProducts: state.availableProducts.filter(
          product => product.id !== action.payload
        ),
        userProducts: state.userProducts.filter(
          product => product.id !== action.payload
        )
      }
      
    default:
      return state;
  }
  
}