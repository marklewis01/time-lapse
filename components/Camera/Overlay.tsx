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

export const Overlay = ({ image }: { image: any }) => {
  const [type, setType] = React.useState(Camera.Constants.Type.back);

  const { height, width } = Dimensions.get("window");
  // const maskRowHeight = Math.round((AppStore.height - 300) / 20);
  const maskColWidth = (width - 300) / 2;
  return (
    <ImageBackground
      source={image}
      style={{
        flex: 1,
        justifyContent: "center",
        opacity: 0.25
      }}
      imageStyle={{
        resizeMode: "contain"
      }}
    >
      <View style={styles.maskOutter}>
        <View style={[{ flex: 10 }, styles.maskRow, styles.maskFrame]} />
        <View style={[{ flex: 30 }, styles.maskCenter]}>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => {
              console.log("clicked");
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
            <View style={styles.maskInner} />
            <View style={[{ width: maskColWidth }, styles.maskFrame]} />
          </TouchableOpacity>
        </View>
        <View style={[{ flex: 10 }, styles.maskRow, styles.maskFrame]} />
      </View>
    </ImageBackground>
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
