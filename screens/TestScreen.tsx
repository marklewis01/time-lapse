import React from "react";
import { Text, View, ImageBackground } from "react-native";
import Constants from "expo-constants";
import { IconButton, Colors } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// import VerticalSlider from "../components/VerticalSlider";
import { BottomToolbar, TopToolbar } from "../components/Camera/Toolbar";

const ICON_SIZE = 30;

export default ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      {/* <View>
        <Text>Testing Page</Text>
        <Text>Device: {Constants.deviceName}</Text>
        <Text>Year: {Constants.deviceYearClass}</Text>
        <Text>System: {Constants.systemVersion}</Text>
      </View> */}

      <ImageBackground
        source={require("../assets/greenwall-section-4.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.optionsOverlayRoot}>
          <View style={styles.optionsOverlayBg} />

          <View style={{ flex: 1, flexDirection: "row", marginHorizontal: 10 }}>
            <View style={[styles.options.buttonRoot, { flex: 2 }]}>
              <IconButton
                onPress={() => console.log("pressed 1")}
                icon={() => (
                  <MaterialIcons
                    name="filter-b-and-w"
                    style={{ transform: [{ rotate: "90deg" }] }}
                    size={ICON_SIZE}
                    color="white"
                  />
                )}
              />
            </View>
            <View style={styles.options.buttonRoot}>
              <IconButton
                onPress={() => console.log("pressed 3")}
                icon={() => (
                  <MaterialIcons
                    name="hdr-on"
                    style={{ transform: [{ rotate: "90deg" }] }}
                    size={ICON_SIZE}
                    color="white"
                  />
                )}
              />
            </View>
            <View style={styles.options.buttonRoot}>
              <IconButton
                onPress={() => console.log("pressed 4")}
                icon={() => (
                  <MaterialIcons
                    name="flash-auto"
                    style={{ transform: [{ rotate: "90deg" }] }}
                    size={ICON_SIZE}
                    color="white"
                  />
                )}
              />
            </View>
            <View style={styles.options.buttonRoot}>
              <IconButton
                onPress={() => console.log("pressed 5")}
                icon={() => (
                  <Ionicons
                    name="ios-reverse-camera"
                    style={{ transform: [{ rotate: "90deg" }] }}
                    size={ICON_SIZE}
                    color="white"
                  />
                )}
              />
            </View>
          </View>
        </View>
        <View style={styles.cameraViewport}></View>
        <View style={styles.actionsOverlay}></View>
      </ImageBackground>
    </View>
  );
};

const rel: "relative" = "relative";
const abs: "absolute" = "absolute";
const center: "center" = "center";

const styles = {
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: "#e0e0e0"
  },
  backgroundImage: {
    flex: 1
  },
  actionsOverlay: {
    height: 100
  },
  cameraViewport: {
    flex: 1
  },
  optionsOverlayRoot: {
    position: rel,
    height: 70
  },
  optionsOverlayBg: {
    position: abs,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#000",
    opacity: 0.4
  },
  options: {
    buttonRoot: {
      flex: 1,
      justifyContent: center,
      alignItems: center
    }
  }
};

// ================================

/* Device Stats

  <View>
    <Text>Testing Page</Text>
    <Text>Device: {Constants.deviceName}</Text>
    <Text>Year: {Constants.deviceYearClass}</Text>
    <Text>System: {Constants.systemVersion}</Text>
  </View>

*/

/* Vertical Slider Testing
  
  <VerticalSlider
    value={1}
    disabled={false}
    min={0}
    max={100}
    onChange={(value: number) => {
      console.log("CHANGE", value);
    }}
    width={50}
    height={300}
    step={1}
    borderRadius={5}
    minimumTrackTintColor={"gray"}
    maximumTrackTintColor={"tomato"}
  /> 

*/
