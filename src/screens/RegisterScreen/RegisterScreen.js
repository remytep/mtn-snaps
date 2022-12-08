import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import axios from "axios";
import CustomInput from "../../components/customInput/CustomInput";
import CustomButton from "../../components/customButton/CustomButton";
import Loader from "../../components/loader";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { control, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const password = watch("password");
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      //console.warn(value);
    }
  };
  const onRegisterPressed = (data) => {
    /*     console.warn("Register"); */
    setLoading(true);
    axios({
      method: "post",
      url: "http://snapi.epitech.eu:8000/inscription",
      headers: { "Content-Type": "application/json" },
      data: { email: data.email, password: data.password },
    })
      .then(async (response) => {
        /*         console.warn(response.data.data); */
        await axios({
          method: "post",
          url: "http://snapi.epitech.eu:8000/connection",
          headers: { "Content-Type": "application/json" },
          data: { email: data.email, password: data.password },
        })
          .then(async (response2) => {
            /*             console.warn(response2.data.data);
            console.warn(response2.data.data.email);
            console.warn(response2.data.data.token); */
            await storeData("email", response2.data.data.email);
            await storeData("token", response2.data.data.token);
            setSuccess(true);
            setLoading(false);
            setTimeout(() => {
              navigation.navigate("User");
            }, 1000);
          })
          .catch((error) => {
            if (error.response) {
              /*               console.warn(error.response); */
            }
          });
      })
      .catch((error) => {
        if (error.response) {
          //console.warn(error.response.data.data.email);
          setErrorMessage("Email " + error.response.data.data.email);
          setLoading(false);
          setSuccess(false);
        }
      });
  };
  const onLoginPressed = () => {
    navigation.navigate("LoginScreen");
  };
  const onTermsOfUsePressed = () => {
    console.warn("ToS");
  };
  const onPrivacyPolicyPressed = () => {
    console.warn("PP");
  };
  return (
    <View style={styles.root}>
      <Loader loading={loading} />
      <Text style={styles.title}>Create an account</Text>
      <CustomInput
        name="email"
        control={control}
        placeholder="Email"
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
        control={control}
        placeholder="Password"
        success={success}
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long",
          },
        }}
        secureTextEntry
      />
      <CustomInput
        name="confirm-password"
        control={control}
        placeholder="Confirm Password"
        success={success}
        rules={{
          required: "Password confirmation is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long",
          },
          validate: (value) => value === password || "Passwords do not match",
        }}
        secureTextEntry
      />
      {success ? (
        <Text style={{ color: "green" }}>Registration successful</Text>
      ) : (
        <Text style={{ color: "red" }}>{errorMessage}</Text>
      )}
      <Text style={styles.text}>
        By registering, you confirm that you accept our{" "}
        <Text style={styles.link} onPress={onTermsOfUsePressed}>
          Terms of Use
        </Text>{" "}
        and{" "}
        <Text style={styles.link} onPress={onPrivacyPolicyPressed}>
          Privacy Policy
        </Text>
      </Text>
      <CustomButton text="Sign up" onPress={handleSubmit(onRegisterPressed)} />
      <CustomButton
        text="Have an account? Click here."
        onPress={onLoginPressed}
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
    paddingTop: 100,
    padding: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: "24",
    color: "orange",
    margin: 10,
  },
  text: { color: "grey", marginVertical: 10 },
  link: {
    color: "#FDB075",
  },
});
