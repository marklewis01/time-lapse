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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Styles
import { styles } from "./styles";

// Types
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { orientation } from "../../types";

const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;

interface Props {
  cameraType: typeof CameraTypes;
  flashMode: typeof CameraFlashModes;
  orientation: orientation;
  setFlashMode(): void;
  setCameraType(): void;
}

export const TopToolbar = ({
  cameraType,
  flashMode,
  orientation,
  setFlashMode,
  setCameraType
}: Props) => (
  <Grid style={styles.topToolbar}>
    <Row>
      <Col style={styles.alignCenter}>
        <IconButton
          onPress={setCameraType}
          icon={() => (
            <Ionicons
              name="md-reverse-camera"
              color="white"
              size={25}
              style={{
                transform: [
                  {
                    rotate: orientation.startsWith("portrait")
                      ? "0deg"
                      : orientation === "landscape-left"
                      ? "90deg"
                      : "-90deg"
                  },
                  { perspective: 1000 }
                ]
              }}
            />
          )}
        />
      </Col>
      <Col style={styles.alignCenter}>
        {cameraType === Camera.Constants.Type.back ? (
          <IconButton
            onPress={setFlashMode}
            icon={() => (
              <MaterialIcons
                name={
                  flashMode === Camera.Constants.FlashMode.on
                    ? "flash-on"
                    : flashMode === Camera.Constants.FlashMode.auto
                    ? "flash-auto"
                    : "flash-off"
                }
                color="white"
                size={25}
                style={{
                  transform: [
                    {
                      rotate: orientation.startsWith("portrait")
                        ? "0deg"
                        : orientation === "landscape-left"
                        ? "90deg"
                        : "-90deg"
                    },
                    { perspective: 1000 }
                  ]
                }}
              />
            )}
          />
        ) : null}
      </Col>
    </Row>
  </Grid>
);

export const BottomToolbar = ({
  capturing = false,
  handleOverlay,
  handleClearOverlay,
  onShortCapture,
  orientation,
  overlay
}: {
  capturing: boolean | null;
  handleOverlay: () => Promise<void>;
  handleClearOverlay: () => void;
  onShortCapture: () => Promise<void>;
  orientation: orientation;
  overlay: ImageInfo | null;
}) => (
  <Grid style={styles.bottomToolbar}>
    <Row style={{ alignItems: "center" }}>
      <Col />
      <Col style={styles.alignCenter}>
        <TouchableWithoutFeedback onPress={onShortCapture}>
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
            flexDirection: orientation.startsWith("portrait")
              ? "row"
              : "column-reverse",
            alignItems: "center",
            transform: [
              {
                rotate: orientation.startsWith("portrait")
                  ? "0deg"
                  : orientation === "landscape-left"
                  ? "90deg"
                  : "-90deg"
              },
              { perspective: 1000 }
            ]
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
                imageStyle={{
                  borderRadius: 30,
                  transform: [
                    {
                      rotate: orientation.startsWith("portrait")
                        ? "0deg"
                        : orientation === "landscape-left"
                        ? "-90deg"
                        : "90deg"
                    },
                    { perspective: 1000 }
                  ]
                }}
              />
            ) : (
              <Ionicons name="ios-image" color="white" size={50} />
            )}
          </TouchableOpacity>
          {overlay ? (
            <View style={{ padding: 5 }}>
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
