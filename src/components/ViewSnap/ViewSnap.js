import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const ViewSnap = ({ id, token, duration }) => {
  const [display, setDisplay] = useState(true);
  const [counter, setCounter] = React.useState(duration);
  const deleteImage = () => {
    axios
      .post(
        "http://snapi.epitech.eu:8000/seen",
        { id: id },
        {
          headers: { "content-type": "application/json", token: token },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((response) => {
        console.log(response);
      });
    setTimeout(() => {
      setDisplay(false);
      axios
        .post(
          "http://snapi.epitech.eu:8000/seen",
          { id: id },
          {
            headers: { "content-type": "application/json", token: token },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((response) => {
          console.log(response);
        });
    }, 1000 * duration);
  };
  const url = "http://snapi.epitech.eu:8000/snap/" + id;
  useEffect(() => {
    if (display) {
      counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }
  }, [counter]);
  return (
    <View style={styles.container}>
      <Text style={styles.countdown}>{counter}</Text>
      {display ? (
        <Image
          source={{
            method: "GET",
            uri: url,
            headers: { token: token },
          }}
          style={styles.image}
          onLoadEnd={() => {
            deleteImage();
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: "100%", width: "100%", position: "relative", zIndex: 5 },
  image: {
    height: windowHeight,
    widht: windowWidth,
    zIndex: 2,
  },
  countdown: {
    position: "absolute",
    right: 0,
    top: 0,
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    paddingTop: 70,
    paddingRight: 20,
    zIndex: 3,
  },
});

export default ViewSnap;
