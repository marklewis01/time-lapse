import React from "react";
import { Camera } from "expo-camera";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";

// Comps
import OpacitySlider from "./OpacitySlider";

export const Overlay = () => {
  const [type, setType] = React.useState(Camera.Constants.Type.back);

  const { height, width } = Dimensions.get("window");
  // const maskRowHeight = Math.round((AppStore.height - 300) / 20);
  const maskColWidth = (width - 300) / 2;

  return (
    <View style={styles.maskOutter}>
      <View style={[{ flex: 10 }, styles.maskRow, styles.maskFrame]} />
      <View style={[{ flex: 30 }, styles.maskCenter]} />

      <OpacitySlider />

      <View style={[{ flex: 10 }, styles.maskRow, styles.maskFrame]} />
    </View>
  );
};

const styles = StyleSheet.create({
  maskOutter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  },
  maskInner: {
    width: 300,
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1
  },
  maskFrame: {
    backgroundColor: "rgba(1,1,1,0.6)"
  },
  maskRow: {
    width: "100%"
  },
  maskCenter: { flexDirection: "row" }
});
