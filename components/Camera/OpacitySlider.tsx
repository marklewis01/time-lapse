import React from "react";
// import Slider from "@react-native-community/slider";
import { PanResponder, Text, View } from "react-native";

import VerticalSlider from "../VerticalSlider";

// import opacityIcon from "../../assets/icon_opacity.png";

export default () => {
  return (
    <View>
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
    </View>
  );
};
