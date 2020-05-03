import React from "react";
import { ImageBackground, View } from "react-native";

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
}) => (
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
  </View>
);
