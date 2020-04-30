/**
 * Code copied from rn-vertical-slider (to make required TS changes)
 */

import React, { Component } from "react";
import { View, Animated, PanResponder, StyleSheet, Easing } from "react-native";

type Props = {
  value: number;
  disabled: boolean;
  min: number;
  max: number;
  onChange: (value: number) => void;
  width: number;
  height: number;
  borderRadius: number;
  maximumTrackTintColor: string;
  minimumTrackTintColor: string;
  step?: number;
  animationDuration?: number;
  trackOpacity?: boolean;
};

type State = {
  value: number;
  preValue: number;
  sliderHeight: any;
  ballHeight: any;
  panResponder: any;
};

export default class VerticalSlider extends Component<Props, State> {
  _moveStartValue: number | null = null;

  constructor(props: Props) {
    super(props);

    let panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (this.props.disabled) {
          return;
        }
        const value = this._fetchNewValueFromGesture(gestureState);
        this._changeState(value);
        if (this.props.onChange) {
          this.props.onChange(value);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (this.props.disabled) {
          return;
        }
        const value = this._fetchNewValueFromGesture(gestureState);
        this._changeState(value);
      },

      onPanResponderGrant: () => {
        this._moveStartValue = this.state.value;
      }
    });

    this.state = {
      value: props.value,
      preValue: props.value,
      sliderHeight: new Animated.Value(0),
      ballHeight: new Animated.Value(0),
      panResponder
    };
  }

  _fetchNewValueFromGesture(gestureState: any): number {
    if (this._moveStartValue) {
      const { min, max, step, height } = this.props;
      const ratio = -gestureState.dy / height;
      const diff = max - min;
      if (step) {
        return Math.max(
          min,
          Math.min(
            max,
            this._moveStartValue + Math.round((ratio * diff) / step) * step
          )
        );
      }
      let value = Math.max(min, this._moveStartValue + ratio * diff);
      return Math.floor(value * 100) / 100;
    } else {
      return 1;
    }
  }

  _getSliderHeight(value: number): number {
    const { min, max, height } = this.props;
    return ((value - min) * height) / (max - min);
  }

  _changeState(value: number): void {
    const { animationDuration } = this.props;
    const sliderHeight = this._getSliderHeight(value);
    let ballPosition = sliderHeight;

    Animated.parallel([
      Animated.timing(this.state.sliderHeight, {
        toValue: sliderHeight,
        easing: Easing.linear,
        duration: animationDuration || 0
      }),
      Animated.timing(this.state.ballHeight, {
        toValue: ballPosition,
        easing: Easing.linear,
        duration: animationDuration || 0
      })
    ]).start();
    this.setState({ value });
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this._changeState(value);
    }
  }

  render() {
    const {
      width,
      height,
      borderRadius,
      maximumTrackTintColor,
      minimumTrackTintColor,
      trackOpacity
    } = this.props;
    return (
      <View style={[{ height, width, borderRadius }]}>
        <View
          style={[
            styles.container,
            styles.shadow,
            {
              height,
              width,
              borderRadius,
              backgroundColor: maximumTrackTintColor
                ? maximumTrackTintColor
                : "#ECECEC",
              opacity: trackOpacity ? 0.3 : 1
            }
          ]}
          {...this.state.panResponder.panHandlers}
        >
          <Animated.View
            style={[
              styles.slider,
              {
                height: this.state.sliderHeight,
                width,
                backgroundColor: minimumTrackTintColor
                  ? minimumTrackTintColor
                  : "#ECECEC"
              }
            ]}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  ball: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center"
  },
  ballText: {
    fontWeight: "900"
  },
  container: {
    overflow: "hidden"
  },
  slider: {
    position: "absolute",
    bottom: 0
  }
});
