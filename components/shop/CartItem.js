import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from '../UI/Card';

const CartItem = props => {
  let TouchableComponent = TouchableOpacity;
  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableComponent = TouchableNativeFeedback;
  }

  return (
    <Card style={styles.cardItem}>
      <View style={styles.itemData}>
        <Text style={styles.quantity}>{props.quantity} </Text>
        <Text style={styles.mainText}>{props.title}</Text>
      </View>

      <View style={styles.itemData}>
        <Text style={styles.mainText}>${props.amount.toFixed(2)} </Text>
        {props.deleteAble && (
          <TouchableComponent
            useForeground
            onPress={props.onRemove}
            style={styles.deleteButton}
          >
            <Ionicons
              name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
              size={23}
              color="red"
            />
          </TouchableComponent>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 5,
    // shadowColor: "black",
    // shadowOpacity: 0.26,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 8,
    // elevation: 5,
    // borderRadius: 10,
    // backgroundColor: "white",
  },
  itemData: {
    flexDirection: 'row',
    alignItems: "center"
  },
  mainText: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
  },
  quantity: {
    fontFamily: "open-sans-regular",
    fontSize: 16,
    color: "#888"
  },
  deleteButton: {
    marginLeft: 20
  }
});

export default CartItem;
