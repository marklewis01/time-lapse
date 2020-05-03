import React from "react";
import { Animated } from "react-native";

export default () => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 50
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        opacity: fadeAnim,
        flex: 1,
        backgroundColor: "white"
      }}
    />
  );
};
