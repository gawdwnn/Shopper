import Product from "../../models/productModel";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        "https://rn-shop-app-858b6.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      const responseData = await response.json();
      // console.log(responseData)
      const loadedProducts = [];
      for (const key in responseData) {
        loadedProducts.push(
          new Product(
            key,
            responseData[key].ownerId,
            responseData[key].title,
            responseData[key].imageUrl,
            responseData[key].description,
            responseData[key].price
          )
        );
      }
      // console.log(loadedProducts)
      dispatch({
        type: SET_PRODUCTS,
        payload: {
          loadedProducts,
          userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
        }
      });
    } catch (error) {
      // send to custom analytic server
      throw error;
    }
  };
};

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shop-app-858b6.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("something went wrong");
    }

    dispatch({
      type: DELETE_PRODUCT,
      payload: productId
    });
  };
};

export const createProduct = (title, imageUrl, description, price) => {
  return async (dispatch, getState) => {
    // any async code goes here
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://rn-shop-app-858b6.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId
        })
      }
    );
    const responseData = await response.json();
    // console.log(responseData);
    dispatch({
      type: CREATE_PRODUCT,
      payload: {
        id: responseData.name,
        title,
        imageUrl,
        description,
        price,
        ownerId: userId
      }
    });
  };
};

export const updateProduct = (id, title, imageUrl, description) => {
  return async (dispatch, getState) => {
    // console.log(getState);
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-shop-app-858b6.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      throw new Error("something went wrong");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      payload: {
        title,
        imageUrl,
        description
      }
    });
  };
};
