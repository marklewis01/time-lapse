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

export default class CameraPage extends React.Component {
  camera = null;

  state = {
    captures: [],
    capturing: null,
    hasCameraPermission: null,
    cameraType: Camera.Constants.Type.back,
    flashMode: Camera.Constants.FlashMode.off,
    screenActive: false
  };

  setFlashMode = (flashMode: any) => this.setState({ flashMode });
  setCameraType = (cameraType: any) => this.setState({ cameraType });
  handleCaptureIn = () => this.setState({ capturing: true });

  handleCaptureOut = () => {
    if (this.state.capturing) this.camera.stopRecording();
  };

  handleShortCapture = async () => {
    const photoData = await this.camera.takePictureAsync();
    this.setState({
      capturing: false,
      captures: [photoData, ...this.state.captures]
    });
  };

  handleLongCapture = async () => {
    const videoData = await this.camera.recordAsync();
    this.setState({
      capturing: false,
      captures: [videoData, ...this.state.captures]
    });
  };

  async componentDidMount() {
    const camera = await Camera.requestPermissionsAsync();
    const hasCameraPermission = camera.status === "granted";

    this.setState({ hasCameraPermission });
    this.setState({ screenActive: true });
  }

  componentWillUnmount() {
    console.log("unmounting");
    this.setState({
      screenActive: false
    });
  }

  render() {
    const {
      hasCameraPermission,
      flashMode,
      cameraType,
      capturing,
      captures
    } = this.state;

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Access to camera has been denied.</Text>;
    }

    return this.state.screenActive ? (
      <React.Fragment>
        <View>
          <Camera
            type={cameraType}
            flashMode={flashMode}
            style={styles.preview}
            ref={(camera) => (this.camera = camera)}
          />
        </View>

        {captures.length > 0 && <Gallery captures={captures} />}

        <Toolbar
          capturing={capturing}
          flashMode={flashMode}
          cameraType={cameraType}
          setFlashMode={this.setFlashMode}
          setCameraType={this.setCameraType}
          onCaptureIn={this.handleCaptureIn}
          onCaptureOut={this.handleCaptureOut}
          onLongCapture={this.handleLongCapture}
          onShortCapture={this.handleShortCapture}
        />
      </React.Fragment>
    ) : (
      <Text>Loading</Text>
    );
  }
}
