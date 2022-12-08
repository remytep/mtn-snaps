import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../../assets/images/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = () => {
  const navigation = useNavigation();
  const [animating, setAnimating] = useState(true);
  useEffect(() => {
    setTimeout(async () => {
      setAnimating(false);
      let email = await AsyncStorage.getItem("email");
      //console.warn(email);
      if (email === null) {
        navigation.navigate("Auth");
      } else {
        navigation.navigate("User");
      }
    }, 1500);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={Logo}
        style={{ width: "90%", resizeMode: "contain", margin: 30 }}
      />
      <ActivityIndicator
        animating={animating}
        color="#FFFFFF"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: "70%",
    maxWidth: 100,
    maxHeight: 100,
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
});

export default SplashScreen;
