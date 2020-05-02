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
import VerticalSlider from "../VerticalSlider";

// styles
import { styles } from "./styles";

// TS
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

export const Overlay = ({
  opacity,
  overlay
}: {
  opacity: number;
  overlay: ImageInfo;
}) => {
  const { height, width } = Dimensions.get("window");
  // const maskRowHeight = Math.round((AppStore.height - 300) / 20);
  const maskColWidth = (width - 300) / 2;

  return (
    <View style={styles.overlayMaskOuter}>
      <ImageBackground
        source={{ uri: overlay.uri }}
        style={[
          styles.preview,
          {
            opacity
          }
        ]}
      />

      {/* <VerticalSlider
          value={1}
          disabled={false}
          min={10}
          max={90}
          onChange={(value: number) => setOpacity(value / 100)}
          width={20}
          height={250}
          step={1}
          borderRadius={5}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#111"
          trackOpacity={true}
        /> */}
    </View>
  );
};
