import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "../../screens/RegisterScreen";
import LoginScreen from "../../screens/LoginScreen";

const Stack = createNativeStackNavigator();
const Auth = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      style={styles.container}
      initialRouteName="LoginScreen"
    >
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          gestureDirection: "vertical",
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          gestureDirection: "vertical",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Auth;
