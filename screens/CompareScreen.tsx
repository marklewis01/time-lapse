import React from "react";
import { SafeAreaView, View, useWindowDimensions } from "react-native";
import { RouteProp } from "@react-navigation/native";
import ComparisonSlider from "react-native-comparison-slider";
import { Button } from "react-native-paper";
import Constants from "expo-constants";

// TS
import { ScreenStackParamList } from "../types";
type CompareScreenRouteProp = RouteProp<ScreenStackParamList, "CompareScreen">;
type Props = {
  navigation: any;
  route: CompareScreenRouteProp;
};

export default ({ navigation, route }: Props) => {
  const { height, width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <ComparisonSlider
        imageWidth={width}
        imageHeight={height}
        initialPosition={50}
        leftImage={{ uri: route.params.images[0] }}
        rightImage={{ uri: route.params.images[1] }}
      ></ComparisonSlider>
      <View style={styles.closeButtonWrapper}>
        <View style={styles.closeButtonInnerWrapper}>
          <View style={styles.closeButtonBg} />
          <Button
            onPress={() => navigation.goBack()}
            color="#FFFFFF"
            icon="close"
          >
            Close
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const rel: "relative" = "relative";
const abs: "absolute" = "absolute";

const styles = {
  container: {
    flex: 1,
    position: rel
  },
  closeButtonWrapper: {
    position: abs,
    top: Constants.statusBarHeight,
    left: 0,
    margin: 10
  },
  closeButtonInnerWrapper: {
    position: rel
  },
  closeButtonBg: {
    backgroundColor: "#000000",
    opacity: 0.5,
    position: abs,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 5
  }
};
