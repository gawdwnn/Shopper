import Order from "../../models/orderModel";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const date = new Date();
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://rn-shop-app-858b6.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error("something went wrong");
    }

    const responseData = await response.json();

    dispatch({
      type: ADD_ORDER,
      payload: {
        id: responseData,
        items: cartItems,
        amount: totalAmount,
        date: date
      }
    });
  };
};

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        `https://rn-shop-app-858b6.firebaseio.com/orders/${userId}.json`
      );

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      const responseData = await response.json();
      const loadedOrders = [];
      for (const key in responseData) {
        loadedOrders.push(
          new Order(
            key,
            responseData[key].cartItems,
            responseData[key].totalAmount,
            new Date(responseData[key].date)
          )
        );
      }
      dispatch({
        type: SET_ORDERS,
        payload: loadedOrders
      });
    } catch (error) {
      throw error
    }
  };
};
