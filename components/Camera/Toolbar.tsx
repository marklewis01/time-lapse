import React from "react";
import {
  ImageBackground,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity
} from "react-native";
import { IconButton } from "react-native-paper";
import { Col, Row, Grid } from "react-native-easy-grid";

import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";

// Styles
import { styles } from "./styles";

// Types
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;

interface Props {
  capturing?: boolean | null;
  cameraType?: any;
  flashMode?: typeof CameraFlashModes;
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
  flashMode,
  setFlashMode,
  // setCameraType,
  onShortCapture
}: Props) => (
  <Grid style={styles.topToolbar}>
    <Row>
      <Col style={styles.alignCenter}>
        <Ionicons name="md-reverse-camera" color="white" size={30} />
      </Col>
      <Col style={styles.alignCenter}>
        <IconButton
          onPress={setFlashMode}
          icon={
            flashMode === Camera.Constants.FlashMode.on
              ? "flash"
              : flashMode === Camera.Constants.FlashMode.auto
              ? "flash-auto"
              : "flash-off"
          }
          size={20}
          color="white"
        />
      </Col>
    </Row>
  </Grid>
);

export const BottomToolbar = ({
  capturing = false,
  handleOverlay,
  handleClearOverlay,
  onShortCapture,
  overlay
}: {
  capturing: boolean | null;
  handleOverlay: () => Promise<void>;
  handleClearOverlay: () => void;
  onShortCapture: () => Promise<void>;
  overlay: ImageInfo | null;
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
      <Col style={{ alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            position: "relative",
            flexDirection: "row",
            alignItems: "flex-start"
          }}
        >
          <TouchableOpacity onPress={handleOverlay}>
            {overlay ? (
              <ImageBackground
                source={{ uri: overlay.uri }}
                style={{
                  width: 60,
                  height: 60
                }}
                imageStyle={{ borderRadius: 30 }}
              />
            ) : (
              <Ionicons name="ios-image" color="white" size={50} />
            )}
          </TouchableOpacity>
          {overlay ? (
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity onPress={handleClearOverlay}>
                <Ionicons name="ios-remove-circle" color="red" size={30} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Col>
    </Row>
  </Grid>
);
