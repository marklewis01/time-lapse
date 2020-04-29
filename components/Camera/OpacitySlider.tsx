import React from "react";
// import Slider from "@react-native-community/slider";
import { Slider } from "react-native";

import opacityIcon from "../../assets/icon_opacity.png";

export default () => {
  return (
    <Slider
      style={styles.root}
      minimumValue={0}
      maximumValue={100}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="lime"
      step={1}
      thumbTintColor="cyan"
    />
  );
};

const styles = {
  root: {
    width: 200,
    height: 40,
    transform: [{ rotateZ: "-90deg" }],
    marginRight: -100,
    marginLeft: -100
  }
};
