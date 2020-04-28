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

import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";

// Comps
import Toolbar from "./Toolbar";
import Gallery from "./Gallery";
import { Overlay } from "./Overlay";

// styles
import { styles } from "./styles";

export default () => {
  const camera = React.createRef();

  const [cameraPermission, setCameraPermission] = React.useState<boolean>();
  const [cameraRollPermission, setCameraRollPermission] = React.useState<
    boolean
  >();
  const [capturing, setCapturing] = React.useState(false);

  const handleTakePhoto = async () => {
    if (camera.current instanceof Camera) {
      setCapturing(true);
      console.log("Taking photo");
      const { uri } = await camera.current.takePictureAsync();

      // save to device media library
      const asset = await MediaLibrary.createAssetAsync(uri);
      MediaLibrary.createAlbumAsync("aa_TimeShift", asset)
        .then(() => {
          console.log("Album created!");
          setCapturing(false);
        })
        .catch((error: any) => {
          console.log("err", error);
          setCapturing(false);
        });
    }
  };

  React.useEffect(() => {
    // Check / Obtain permissions on mount
    (async () => {
      console.log("mounting");

      const { status: cameraStatus } = await Camera.requestPermissionsAsync();
      const {
        status: mediaStatus
      } = await MediaLibrary.requestPermissionsAsync();

      setCameraPermission(cameraStatus === "granted");
      setCameraRollPermission(mediaStatus === "granted");
    })();

    return () => {
      console.log("un-mounting");
    };
  }, []);

  if (cameraPermission === undefined || cameraRollPermission === undefined) {
    return <View />;
  } else if (cameraPermission === false) {
    return <Text>Access to camera has been denied.</Text>;
  } else if (cameraRollPermission === false) {
    return (
      <Text>Permission to save images to your device has been denied.</Text>
    );
  }

  return (
    <React.Fragment>
      <View>
        <Camera
          type={Camera.Constants.Type.back}
          flashMode={Camera.Constants.FlashMode.off}
          style={styles.preview}
          ref={(ref) => (camera.current = ref)}
        />
      </View>

      {/* {captures.length > 0 && <Gallery captures={captures} />} */}

      <Toolbar
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
    </React.Fragment>
  );
};
