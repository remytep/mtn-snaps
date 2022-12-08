import { StyleSheet, Text, View, Button, Image} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(true);
  const [type, setType] = useState(Camera.Constants.Type.back);
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);
  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null)
      setImage(data.uri);
      setCameraActive(false)
    }
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  let openImagePickerAsync = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    setImage(pickerResult.uri);
    setCameraActive(false)
    console.warn(pickerResult);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        {(cameraActive ? <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'} /> :
          <Image source={{ uri: image }} style={styles.Image} />)}
      </View>
      <View style={styles.buttoncontainer}>
        {(cameraActive ?
          <Button
            title="Flip Image"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
          </Button>
          : null)}
        {(cameraActive ?
          <Button title="Take Picture" onPress={() => takePicture()} />
          : null
        )}
        {(cameraActive ?
          <Button title="Gallery" onPress={openImagePickerAsync} />
          : null
        )}
        {(cameraActive ? null :
          <Button title="Camera" onPress={() => { setCameraActive(true) }} />
        )}
        {(cameraActive ? null :
          <Button title="send" />)}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 0.5
  },
  buttoncontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20
  },
  Image: {
    height: "auto",
    width: 420
  }
})