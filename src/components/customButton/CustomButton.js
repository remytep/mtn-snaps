import { View, Text, StyleSheet, Pressable } from "react-native";
import CustomInput from "../../components/customInput/CustomInput";
import React from "react";

const CustomButton = ({ onPress, text, type = "PRIMARY" }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, styles[`container_${type}`]]}
    >
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  container_PRIMARY: { backgroundColor: "orange" },
  container_TERTIARY: {},
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  text_TERTIARY: {
    color: "gray",
    fontSize: 15,
  },
});

export default CustomButton;
