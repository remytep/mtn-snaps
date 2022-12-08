import {
  StyleSheet,
  Text,
  View,
  Button,
  Input,
  Image,
  TouchableOpacity,
} from "react-native";
import { Menu, TextInput } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import RNPickerSelect from "react-native-picker-select";
/* import { Picker } from "@react-native-picker/picker"; */
import Gallery from "../../../assets/images/gallery.png";
import FlipCamera from "../../../assets/images/flipcamera.png";
import Cross from "../../../assets/images/camera.png";
import Clock from "../../../assets/images/clock.png";
import Send from "../../../assets/images/send.png";
import Save from "../../../assets/images/save.png";
import Autocomplete from "../../components/Autocomplete";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";

export default function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [token, setToken] = useState("");
  const [cameraActive, setCameraActive] = useState(true);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [menuVisible, setMenuVisible] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [sendDuration, setSendDuration] = useState(10);
  const [destinataire, setDestinataire] = useState("");
  useEffect(() => {
    (async () => {
      const tok = await AsyncStorage.getItem("token");
      setToken(tok);
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);
  const ClockIcon = () => {
    return (
      <TouchableOpacity style={styles.topButton}>
        <Image source={Clock} style={styles.icon} />
      </TouchableOpacity>
    );
  };
  const filterData = (text) => {
    return userList.filter((val) => val?.indexOf(text) > -1);
  };
  const takePicture = async () => {
    if (camera) {
      const options = {
        orientation: "portrait",
        forceUpOrientation: true,
        quality: 0.6,
        base64: true,
      };
      const data = await camera.takePictureAsync(options);
      if (type === Camera.Constants.Type.front) {
        const flippedImage = await manipulateAsync(
          data.uri,
          [
            {
              flip: FlipType.Horizontal,
            },
          ],
          { compress: 1, format: SaveFormat.PNG }
        );
        setImage(flippedImage);
      } else {
        setImage(data);
      }
      //console.log(image);
      axios({
        method: "GET",
        url: "http://snapi.epitech.eu:8000/all",
        headers: { token: token },
      })
        .then((response) => {
          const emails = response.data.data.map((user) => user.email);
          //console.log(emails);
          setUserList(emails);
        })
        .catch((error) => {
          console.log(error);
        });
      setCameraActive(false);
    }
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const savePicture = async (uri) => {
    await MediaLibrary.saveToLibraryAsync(uri);
  };
  let openImagePickerAsync = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    setImage(pickerResult);
    /*     console.log(image); */
    if (pickerResult.cancelled) {
      setCameraActive(true);
    } else {
      setCameraActive(false);
    }
    //console.warn(image);
  };
  const sendSnap = async () => {
    console.log(destinataire);
    const token = await AsyncStorage.getItem("token");

    let formData = new FormData();
    formData.append("duration", sendDuration);
    formData.append("to", destinataire);
    let localUri = image.uri;
    let filename = localUri.split("/").pop();
    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append("image", { uri: localUri, name: filename, type });
    //console.log(image);
    //formData.append("image", image);
    /*     console.warn(formData); */
    axios({
      method: "POST",
      url: "http://snapi.epitech.eu:8000/snap",
      headers: { "Content-Type": "multipart/form-data", token: token },
      data: formData,
    })
      .then((response) => {
        console.log(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setCameraActive(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {cameraActive ? (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.fixedRatio}
            type={type}
            ratio={"1:1"}
          />
        ) : (
          <Image source={{ uri: image.uri }} style={styles.image} />
        )}
      </View>
      <View style={styles.buttonContainer}>
        {cameraActive ? (
          <View style={styles.sendContainer}>
            <View style={styles.topButton}>
              <TouchableOpacity onPress={openImagePickerAsync}>
                <Image source={Gallery} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomButton}>
              <TouchableOpacity
                onPress={() => takePicture()}
                style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: "#fff",
                }}
              />
            </View>
            <View style={styles.topButton}>
              <TouchableOpacity
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Image source={FlipCamera} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.sendContainer}>
            <View style={styles.sideBar}>
              <TouchableOpacity
                onPress={() => {
                  setCameraActive(true);
                }}
                style={styles.topButton}
              >
                <Image source={Cross} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomButton}
                onPress={() => {
                  savePicture(image.uri);
                }}
              >
                <Image source={Save} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <View style={[styles.sideBar, { paddingTop: 60 }]}>
              <RNPickerSelect
                placeholder={{}}
                Icon={() => {
                  return (
                    <TouchableOpacity style={styles.topButton}>
                      <Image source={Clock} style={styles.icon} />
                    </TouchableOpacity>
                  );
                }}
                InputAccessoryView={ClockIcon}
                onValueChange={(value) => {
                  /*                   console.log(value); */
                  setSendDuration(value);
                }}
                style={{
                  fontSize: 24,
                  iconContainer: {
                    top: -60,
                    left: 0,
                  },
                }}
                items={[
                  { label: "1", value: 1, inputLabel: " " },
                  { label: "2", value: 2, inputLabel: " " },
                  { label: "3", value: 3, inputLabel: " " },
                  { label: "4", value: 4, inputLabel: " " },
                  { label: "5", value: 5, inputLabel: " " },
                  { label: "6", value: 6, inputLabel: " " },
                  { label: "7", value: 7, inputLabel: " " },
                  { label: "8", value: 8, inputLabel: " " },
                  { label: "9", value: 9, inputLabel: " " },
                  { label: "10", value: 10, inputLabel: " " },
                ]}
              />
              <View style={styles.destinataire}>
                <TextInput
                  onFocus={() => {
                    if (destinataire.length === 0) {
                      setMenuVisible(true);
                    }
                  }}
                  // onBlur={() => setMenuVisible(false)}
                  label="Destinataire"
                  onChangeText={(text) => {
                    setDestinataire(text);
                    if (text && text.length > 0) {
                      setFilteredData(filterData(text));
                    } else if (text && text.length === 0) {
                      setFilteredData(userList);
                    }
                    setMenuVisible(true);
                    setDestinataire(text);
                  }}
                  value={destinataire}
                />
                {menuVisible && filteredData && (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: "white",
                      borderWidth: 2,
                      flexDirection: "column",
                      borderColor: "grey",
                    }}
                  >
                    {filteredData.map((datum, i) => (
                      <Menu.Item
                        key={i}
                        style={[{ width: "100%", backgroundColor: "white" }]}
                        onPress={() => {
                          setMenuVisible(false);
                          setDestinataire(datum);
                        }}
                        title={datum}
                      />
                    ))}
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={styles.bottomButton}
                onPress={() => sendSnap()}
              >
                <Image source={Send} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 0.46,
  },
  buttonContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    flexDirection: "row",
  },
  sendContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  image: {
    height: "auto",
    width: 420,
  },
  topButton: {
    alignSelf: "flex-start",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  bottomButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  takePicture: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
  icon: {
    maxWidth: 50,
    maxHeight: 50,
  },
  sideBar: {
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
  },
  destinataire: {
    width: "100%",
  },
});
