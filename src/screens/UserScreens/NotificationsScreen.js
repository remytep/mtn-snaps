import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, Pressable, StyleSheet, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ViewSnap from "../../components/ViewSnap";
import axios from "axios";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function NotificationsScreen({}) {
  const navigation = useNavigation();
  const [time, setTime] = useState(Date.now());
  const [image, setImage] = useState(false);
  const [token, setToken] = useState("");
  const [snapId, setSnapId] = useState(0);
  const [snapList, setSnapList] = useState([]);
  const [duration, setDuration] = useState(10);
  const loadList = async () => {
    const tok = await AsyncStorage.getItem("token");
    setToken(tok);
    await axios({
      method: "GET",
      url: "http://snapi.epitech.eu:8000/snaps",
      headers: {
        token: tok,
      },
    })
      .then(async (response) => {
        await setSnapList(
          response.data.data.sort(function (a, b) {
            return b.snap_id - a.snap_id;
          })
        );
        console.log(snapList);
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  useEffect(() => {
    loadList();
  }, []);
  const viewSnap = async (id, duration) => {
    navigation.setOptions({ headerShown: false });
    await setDuration(duration);
    await setSnapId(id);
    await setImage(true);
    setTimeout(() => {
      setImage(false);
      setSnapList([]);
      navigation.setOptions({ headerShown: true });
    }, 1000 * duration);
  };

  return (
    <View style={styles.container}>
      <View style={styles.snap}>
        {image ? null : (
          <Pressable
            onPress={() => {
              loadList();
            }}
            style={styles.reload}
          >
            <Text>Reload</Text>
          </Pressable>
        )}
        {image ? (
          <ViewSnap id={snapId} token={token} duration={duration} />
        ) : (
          snapList.map((snap) => (
            <Pressable
              onPress={() => viewSnap(snap.snap_id, snap.duration)}
              style={styles.button}
              key={snap.snap_id}
            >
              <Text>De {snap.from}</Text>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "relative" },
  button: {
    width: "100%",
    backgroundColor: "lightgray",
    padding: 15,
    margin: 2,
    borderRadius: 5,
    alignItems: "flex-start",
  },
  snapList: {},
  snap: {
    height: windowHeight,
    widht: windowWidth,
  },
  reload: {
    width: "100%",
    alignContent: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#4278f5",
  },
});
