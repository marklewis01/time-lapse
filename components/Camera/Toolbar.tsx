import React from "react";

import { Camera } from "expo-camera";

import { Ionicons } from "@expo/vector-icons";
import { Col, Row, Grid } from "react-native-easy-grid";
import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";

import { styles } from "./styles";

const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;

interface Props {
  capturing?: boolean | null;
  cameraType?: any;
  flashMode?: any;
  setFlashMode?: any;
  setCameraType?: any;
  onCaptureIn?: any;
  onCaptureOut?: any;
  onLongCapture?: any;
  onShortCapture?: any;
}

export const TopToolbar = ({
  capturing = false,
  // cameraType = CameraTypes.back,
  flashMode = CameraFlashModes.off,
  // setFlashMode,
  // setCameraType,
  // onCaptureIn,
  // onCaptureOut,
  // onLongCapture,
  onShortCapture
}: Props) => (
  <Grid style={styles.topToolbar}>
    <Row>
      <Col style={styles.alignCenter}>
        <Ionicons name="md-reverse-camera" color="white" size={30} />
      </Col>
      <Col style={styles.alignCenter}>
        <Ionicons
          name={flashMode == CameraFlashModes.on ? "md-flash" : "md-flash-off"}
          color="white"
          size={30}
        />
      </Col>
    </Row>
  </Grid>
);

export const BottomToolbar = ({
  capturing = false,
  handleOverlay,
  onShortCapture
}: {
  capturing: boolean | null;
  handleOverlay: () => Promise<void>;
  onShortCapture: () => Promise<void>;
}) => (
  <Grid style={styles.bottomToolbar}>
    <Row style={{ alignItems: "center" }}>
      <Col />
      <Col style={styles.alignCenter}>
        <TouchableWithoutFeedback
          // onPressIn={onCaptureIn}
          // onPressOut={onCaptureOut}
          // onLongPress={onLongCapture}
          onPress={onShortCapture}
        >
          <View
            style={[styles.captureBtn, capturing && styles.captureBtnActive]}
          >
            {capturing && <View style={styles.captureBtnInternal} />}
          </View>
        </TouchableWithoutFeedback>
      </Col>
      <Col>
        <TouchableOpacity onPress={handleOverlay}>
          <Ionicons name="ios-image" color="white" size={30} />
        </TouchableOpacity>
      </Col>
    </Row>
  </Grid>
);
