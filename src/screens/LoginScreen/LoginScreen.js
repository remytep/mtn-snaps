import React, { useState } from "react";
import axios from "axios";
import {
  Text,
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Logo from "../../../assets/images/logo.png";
import CustomInput from "../../components/customInput/CustomInput";
import CustomButton from "../../components/customButton/CustomButton";
import Loader from "../../components/loader";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { control, handleSubmit } = useForm();
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn(value);
    }
  };
  const onLoginPressed = (data) => {
    //console.warn(data);
    setLoading(true);
    axios({
      method: "post",
      url: "http://snapi.epitech.eu:8000/connection",
      headers: { "Content-Type": "application/json" },
      data: { email: data.email, password: data.password },
    }).then(async (response) => {
      /*       console.warn(response.data.data.email);
      console.warn(response.data.data.token); */

      storeData("email", response.data.data.email);
      storeData("token", response.data.data.token);
      setSuccess(true);
      /*       let found = await AsyncStorage.getItem("token"); */
      /*       console.warn(found); */
      setLoading(false);
      setTimeout(() => {
        navigation.navigate("User");
      }, 1000);
    });
  };
  const onRegisterPressed = () => {
    navigation.navigate("RegisterScreen");
  };
  return (
    <View style={styles.root}>
      <Loader loading={loading} />
      <Image
        source={Logo}
        style={(styles.logo, { height: height * 0.15, marginBottom: 20 })}
        resizeMode="contain"
      />
      <CustomInput
        name="email"
        placeholder="Email"
        control={control}
        success={success}
        rules={{
          required: "Email is required",
          pattern: {
            value:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "Please enter a valid email",
          },
        }}
      />
      <CustomInput
        name="password"
        placeholder="Password"
        control={control}
        success={success}
        secureTextEntry
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long",
          },
        }}
      />
      {success === true ? (
        <Text style={styles.error}>Login successful</Text>
      ) : null}
      <CustomButton text="Log in" onPress={handleSubmit(onLoginPressed)} />
      <CustomButton
        text="Don't have an account? Create one."
        onPress={onRegisterPressed}
        type="TERTIARY"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
    paddingTop: 100,
  },
  logo: {
    width: "70%",
    maxWidth: 100,
    maxHeight: 100,
  },
  error: {
    color: "green",
  },
});
