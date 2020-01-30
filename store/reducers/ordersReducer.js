import { ADD_ORDER, SET_ORDERS } from "../actions/ordersAction";
import Order from "../../models/orderModel";

const initialState = {
  orders: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      const newOrder = new Order(
        action.payload.id,
        action.payload.items,
        action.payload.amount,
        action.payload.date
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder)
      };
    case SET_ORDERS:
      return {
        orders: action.payload
      }
    default:
      return state;
  }
};
