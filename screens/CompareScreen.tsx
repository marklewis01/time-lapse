import React from "react";
import { View, useWindowDimensions } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import ComparisonSlider from "react-native-comparison-slider";

// TS
import { ScreenStackParamList } from "../types";
// type ProjectScreenNavigationProp = StackNavigationProp<
//   ScreenStackParamList,
//   "CompareScreen"
// >;
type CompareScreenRouteProp = RouteProp<ScreenStackParamList, "CompareScreen">;

type Props = {
  // navigation: ProjectScreenNavigationProp;
  route: CompareScreenRouteProp;
};

export default ({ route }: Props) => {
  const { height, width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <ComparisonSlider
        imageWidth={width}
        imageHeight={height}
        initialPosition={50}
        leftImage={{ uri: route.params.images[0] }}
        rightImage={{ uri: route.params.images[1] }}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    backgroundColor: "#e0e0e0"
  }
};
