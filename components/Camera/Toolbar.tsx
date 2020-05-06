import React from "react";
import {
  ImageBackground,
  StatusBar,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View
} from "react-native";
import { IconButton } from "react-native-paper";
import { Camera } from "expo-camera";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Slider from "react-native-slider";
import { useNavigation } from "@react-navigation/native";

// Types
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";
import { orientation } from "../../types";

interface OptionsProps {
  cameraType: typeof CameraTypes;
  flashMode: typeof CameraFlashModes;
  orientation: orientation;
  setFlashMode(): void;
  setCameraType(): void;
}

interface ActionsProps {
  capturing: boolean | null;
  handleOverlay(): Promise<void>;
  handleClearOverlay(): void;
  handleOverlayOpacity(value: number): void;
  onShortCapture(): Promise<void>;
  opacity: number;
  orientation: orientation;
  overlay: ImageInfo | null;
}

const { FlashMode: CameraFlashModes, Type: CameraTypes } = Camera.Constants;
const ICON_SIZE = 30;

/*
 * ================================
 * Options Toolbar
 * ================================
 */
export const OptionsToolbar = ({
  cameraType,
  flashMode,
  orientation,
  setFlashMode,
  setCameraType
}: OptionsProps) => {
  const navigation = useNavigation();
  return (
    <View style={styles.options.root}>
      <StatusBar hidden />
      <View style={styles.options.overlayBg} />

      <View
        style={{
          flex: 1,
          flexDirection:
            orientation === "landscape-right" ? "row-reverse" : "row"
        }}
      >
        <View style={[styles.options.buttonRoot, { flex: 2 }]}>
          <IconButton
            onPress={() => console.log("pressed filter")}
            icon={() => (
              <MaterialIcons
                name="filter-b-and-w"
                size={ICON_SIZE}
                color="white"
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
        </View>
        <View style={styles.options.buttonRoot}>
          <IconButton
            onPress={() => console.log("pressed hdr")}
            icon={() => (
              <MaterialIcons
                name="hdr-on"
                size={ICON_SIZE}
                color="white"
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
        </View>
        <View style={styles.options.buttonRoot}>
          {cameraType === Camera.Constants.Type.back && (
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
                  size={ICON_SIZE}
                  color="white"
                />
              )}
            />
          )}
        </View>
        <View style={styles.options.buttonRoot}>
          <IconButton
            onPress={setCameraType}
            icon={() => (
              <Ionicons
                name="ios-reverse-camera"
                size={ICON_SIZE}
                color="white"
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
        </View>
        <View style={styles.options.buttonRoot}>
          <IconButton
            onPress={() => navigation.goBack()}
            icon={() => (
              <Ionicons name="ios-close" size={ICON_SIZE} color="white" />
            )}
          />
        </View>
      </View>
    </View>
  );
};

/*
 * ================================
 * Actions Toolbar
 * ================================
 */

export const ActionsToolbar = ({
  capturing = false,
  handleOverlay,
  handleClearOverlay,
  handleOverlayOpacity,
  onShortCapture,
  orientation,
  opacity,
  overlay
}: ActionsProps) => (
  <View
    style={[
      styles.actions.root,
      {
        flexDirection: orientation === "landscape-right" ? "row-reverse" : "row"
      }
    ]}
  >
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <View>
        {overlay && (
          <Slider
            value={opacity * 100}
            step={1}
            onValueChange={handleOverlayOpacity}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#FFF"
            thumbTouchSize={{ width: 100, height: 100 }}
            trackStyle={{ height: 2 }}
            thumbStyle={{ width: 4, height: 30 }}
            style={{
              width: 80
            }}
          />
        )}
      </View>
    </View>
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10
      }}
    >
      <TouchableWithoutFeedback onPress={onShortCapture}>
        <View
          style={[
            styles.actions.captureBtn,
            capturing && styles.actions.captureBtnActive
          ]}
        >
          <View
            style={[
              styles.actions.captureBtnInternal,
              capturing && styles.actions.captureBtnInternalActive
            ]}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        transform: [
          {
            rotate: orientation.startsWith("portrait")
              ? "0deg"
              : orientation === "landscape-left"
              ? "90deg"
              : "-90deg"
          },
          { perspective: 1000 }
        ],
        position: "relative"
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
              borderRadius: 30
            }}
          />
        ) : (
          <Ionicons name="ios-image" color="white" size={50} />
        )}
      </TouchableOpacity>
      {overlay && (
        <View style={{ position: "absolute", right: 15, top: -15 }}>
          <TouchableOpacity onPress={handleClearOverlay}>
            <Ionicons name="ios-remove-circle" color="red" size={30} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
);

/*
 * ================================
 * Local Styles
 * ================================
 */

const rel: "relative" = "relative";
const abs: "absolute" = "absolute";
const center: "center" = "center";
const spaceBetween: "space-between" = "space-between";
const row: "row" = "row";

const styles = {
  backgroundImage: {
    flex: 1
  },
  actions: {
    root: {
      position: abs,
      bottom: 0,
      flexDirection: row,
      alignItems: center,
      justifyContent: spaceBetween,
      padding: 15
    },
    captureBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 80,
      height: 80,
      borderWidth: 5,
      borderRadius: 40,
      borderColor: "#FFFFFF"
    },
    captureBtnInternal: {
      width: 68,
      height: 68,
      borderWidth: 2,
      borderRadius: 34,
      backgroundColor: "#FFFFFF",
      borderColor: "transparent"
    },
    captureBtnActive: {
      width: 80,
      height: 80
    },
    captureBtnInternalActive: {
      backgroundColor: "red"
    }
  },
  cameraViewport: {
    flex: 1
  },
  options: {
    root: {
      position: rel,
      height: 60
    },
    buttonRoot: {
      flex: 1,
      justifyContent: center,
      alignItems: center
    },
    overlayBg: {
      position: abs,
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      backgroundColor: "#000",
      opacity: 0.4
    }
  }
};
