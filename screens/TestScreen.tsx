import React from "react";
import { Text, View, ImageBackground, useWindowDimensions } from "react-native";
import Constants from "expo-constants";
import { IconButton, Colors } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import ReactCompareImage from "react-compare-image";
import ComparisonSlider from "react-native-comparison-slider";

export default () => {
  const { height, width } = useWindowDimensions();
  return (
    <View style={styles.container}>
      <Text>Testing Slider</Text>
      <ComparisonSlider
        imageWidth={width}
        imageHeight={height}
        initialPosition={50}
        leftImage={require("../assets/greenwall-section-4.jpg")}
        rightImage={require("../assets/greenwall-section-4-b.jpg")}
      />
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
