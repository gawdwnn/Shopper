import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import * as CartActions from '../../store/actions/cartAction';

const ProductDetailScreen = props => {
  const productId = props.navigation.getParam("productId");
  const selectedProduct = useSelector(state =>
    state.products.availableProducts.find(prod => prod.id === productId)
  );
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title="Add to cart"
          onPress={() => {
            dispatch(CartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam("productTitle")
  };
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: "100%"
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },
  price: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 20
  },
  description: {
    fontFamily: "open-sans-regular",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20
  }
});

export default ProductDetailScreen;
