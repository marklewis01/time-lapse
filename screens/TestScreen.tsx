import React from "react";
import { Text, View } from "react-native";
import Constants from "expo-constants";

import VerticalSlider from "../components/VerticalSlider";

export default ({ navigation }: any) => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: "#e0e0e0"
      }}
    >
      <Text>Testing Page</Text>
      <Text>Device: {Constants.deviceName}</Text>
      <Text>Year: {Constants.deviceYearClass}</Text>
      <Text>System: {Constants.systemVersion}</Text>
      <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            borderColor: "grey",
            borderWidth: 1
          }}
        >
          <VerticalSlider
            value={1}
            disabled={false}
            min={0}
            max={100}
            onChange={(value: number) => {
              console.log("CHANGE", value);
            }}
            // onComplete={(value: number) => {
            //   console.log("COMPLETE", value);
            // }}
            width={50}
            height={300}
            step={1}
            borderRadius={5}
            minimumTrackTintColor={"gray"}
            maximumTrackTintColor={"tomato"}
          />
        </View>
      </View>
    </View>
  );
};
