import React from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

// Comps
import { BottomToolbar, TopToolbar } from "./Toolbar";
import Gallery from "./Gallery";
import { Overlay } from "./Overlay";

// styles
import { styles } from "./styles";

const projectDirectory = FileSystem.documentDirectory + "Camera/";

export default () => {
  const camera = React.createRef<Camera | null>();

  const [cameraPermission, setCameraPermission] = React.useState<boolean>();

  const [capturing, setCapturing] = React.useState(false);
  const [overlay, setOverlay] = React.useState<string | null>(null);

  const handleTakePhoto = async () => {
    if (camera.current instanceof Camera) {
      try {
        setCapturing(true);
        const { uri } = await camera.current.takePictureAsync();
        setCapturing(false);

        // // save to filesystem
        // await FileSystem.copyAsync({
        //   from: image.uri,
        //   to: projectDirectory! + "first_project/test.jpg"
        // });

        // save to device media library
        const asset = await MediaLibrary.createAssetAsync(uri);

        await MediaLibrary.createAlbumAsync("aa_TimeShift", asset, false);
      } catch (error) {
        console.log("err", error);
      }
    }
  };

  const handleSelectOverlay = async () => {
    // pause camera
    camera.current?.pausePreview();

    // display media library
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // on click, if selected, set state
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      setOverlay(result.uri);
    }
    // resume camera
    camera.current?.resumePreview();
  };

  React.useEffect(() => {
    // Check / Obtain permissions on mount
    (async () => {
      console.log("mounting");

      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      // const {
      //   status: mediaStatus
      // } = await MediaLibrary.requestPermissionsAsync();

      setCameraPermission(cameraStatus === "granted");
    })();
  }, []);

  if (cameraPermission === undefined) {
    return <View />;
  } else if (cameraPermission === false) {
    return <Text>Access to camera has been denied.</Text>;
  }

  console.log({ overlay });
  return (
    <React.Fragment>
      <View>
        <Camera
          type={Camera.Constants.Type.back}
          flashMode={Camera.Constants.FlashMode.off}
          style={styles.preview}
          ref={(ref) => (camera.current = ref)}
        >
          {overlay && (
            <ImageBackground
              source={{ uri: overlay }}
              style={{
                flex: 1,
                justifyContent: "center",
                opacity: 0.25
              }}
              imageStyle={{
                resizeMode: "contain"
              }}
            />
          )}
        </Camera>
      </View>
      <TopToolbar
        capturing={capturing}
        // flashMode={flashMode}
        // cameraType={cameraType}
        // setFlashMode={this.setFlashMode}
        // setCameraType={this.setCameraType}
        // onCaptureIn={this.handleCaptureIn}
        // onCaptureOut={this.handleCaptureOut}
        // onLongCapture={this.handleLongCapture}
        onShortCapture={handleTakePhoto}
      />
      {/* {captures.length > 0 && <Gallery captures={captures} />} */}

      <BottomToolbar
        capturing={capturing}
        handleOverlay={handleSelectOverlay}
        onShortCapture={handleTakePhoto}
      />
    </React.Fragment>
  );
};
