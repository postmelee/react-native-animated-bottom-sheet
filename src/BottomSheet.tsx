import React, { Component } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
} from "react-native";
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";

interface IProps {
  closeBottomSheet: boolean;
  setCloseBottomSheet: (value: boolean) => void;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  renderContent: (disabled: boolean) => any;
  visibleHeight: number;
}

interface IState {
  lastSnap: number;
  disabled: boolean;
}

const windowHeight = Dimensions.get("window").height;

// boolean 값 하나로 가능 (renderContent에 setBoolean 넘기고 modal visible은 내부 state로 애니매이션 후 설정)
export default class BottomSheet extends Component<IProps, IState> {
  private SNAP_POINTS_FROM_TOP: number[];
  private _backgroundOpacity: Animated.Value;
  private _lastScrollYValue: number;
  private _lastScrollY: Animated.Value;
  private _dragY: Animated.Value;
  private _onGestureEvent: (...args: any[]) => void;
  private _reverseLastScrollY: Animated.AnimatedMultiplication;
  private _translateYOffset: Animated.Value;
  private _translateY: any;

  constructor(props: IProps) {
    super(props);

    this.SNAP_POINTS_FROM_TOP = [
      windowHeight - this.props.visibleHeight,
      windowHeight,
    ];

    const START = this.SNAP_POINTS_FROM_TOP[0];
    const END = this.SNAP_POINTS_FROM_TOP[this.SNAP_POINTS_FROM_TOP.length - 1];

    this.state = {
      lastSnap: START,
      disabled: false,
    };
    this._backgroundOpacity = new Animated.Value(0);

    this._lastScrollYValue = 0;
    this._lastScrollY = new Animated.Value(0);
    this._lastScrollY.addListener(({ value }) => {
      this._lastScrollYValue = value;
    });

    this._dragY = new Animated.Value(0);
    this._onGestureEvent = Animated.event(
      [{ nativeEvent: { translationY: this._dragY } }],
      {
        useNativeDriver: true,
      }
    );

    this._reverseLastScrollY = Animated.multiply(
      new Animated.Value(-1),
      this._lastScrollY
    );

    this._translateYOffset = new Animated.Value(END);

    this._translateY = Animated.add(
      this._translateYOffset,
      Animated.add(this._dragY, this._reverseLastScrollY)
    ).interpolate({
      inputRange: [0, START, END],
      outputRange: [START / 1.2, START, END],
      extrapolate: "clamp",
    });
    this._translateY.addListener(({ value }: any) => {
      this._backgroundOpacity.setValue(value);
    });
  }

  _onHeaderHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.oldState === State.BEGAN) {
      this.setState({
        disabled: true,
      });
      this._lastScrollY.setValue(0);
    } else if (nativeEvent.state === 5) {
      this.setState({
        disabled: false,
      });
    }
    this._onHandlerStateChange({ nativeEvent });
  };
  _onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let { velocityY, translationY } = nativeEvent;
      translationY -= this._lastScrollYValue;
      const dragToss = 0.05;
      const endOffsetY =
        this.state.lastSnap + translationY + dragToss * velocityY * 2;
      let destSnapPoint = this.SNAP_POINTS_FROM_TOP[0];
      for (let i = 0; i < this.SNAP_POINTS_FROM_TOP.length; i++) {
        const snapPoint = this.SNAP_POINTS_FROM_TOP[i];
        const distFromSnap = Math.abs(snapPoint - endOffsetY);
        if (distFromSnap < Math.abs(destSnapPoint - endOffsetY)) {
          destSnapPoint = snapPoint;
        }
      }
      this._translateYOffset.extractOffset();
      this._translateYOffset.setValue(translationY);
      this._translateYOffset.flattenOffset();
      this._dragY.setValue(0);
      Animated.spring(this._translateYOffset, {
        velocity: velocityY,
        tension: 68,
        friction: 12,
        toValue: destSnapPoint,
        useNativeDriver: true,
      }).start(() => {
        if (destSnapPoint === windowHeight) {
          this.props.setIsModalVisible(false);
        }
      });
    }
  };

  componentDidUpdate(prevState: IProps) {
    if (!prevState.isModalVisible && this.props.isModalVisible) {
      this._translateYOffset.setValue(windowHeight);
      Animated.spring(this._translateYOffset, {
        velocity: 0.01,
        tension: 68,
        friction: 12,
        toValue: windowHeight - this.props.visibleHeight + 1,
        useNativeDriver: true,
      }).start();
    }
    if (this.props.closeBottomSheet) {
      Animated.spring(this._translateYOffset, {
        velocity: 40,
        tension: 138,
        friction: 12,
        toValue: windowHeight,
        useNativeDriver: true,
      }).start(() => {
        this.props.setCloseBottomSheet(false);
        this.props.setIsModalVisible(false);
      });
    }
  }
  render() {
    return (
      <Modal
        visible={this.props.isModalVisible}
        transparent={true}
        style={{ flex: 1 }}
      >
        <TapGestureHandler>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPress={() => {
              Animated.timing(this._translateYOffset, {
                toValue: windowHeight,
                duration: 200,
                useNativeDriver: true,
              }).start(() => {
                this.props.setIsModalVisible(false);
              });
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: this._backgroundOpacity.interpolate({
                  inputRange: [
                    windowHeight - this.props.visibleHeight,
                    windowHeight,
                  ],
                  outputRange: ["#00000099", "#00000000"],
                  extrapolate: "clamp",
                }),
              }}
              pointerEvents="box-none"
            >
              <TouchableWithoutFeedback>
                <Animated.View
                  style={[
                    StyleSheet.absoluteFillObject,
                    {
                      transform: [{ translateY: this._translateY }],
                    },
                  ]}
                >
                  <PanGestureHandler
                    shouldCancelWhenOutside={false}
                    onGestureEvent={this._onGestureEvent}
                    onHandlerStateChange={this._onHeaderHandlerStateChange}
                  >
                    <Animated.View style={{ flex: 1 }}>
                      {this.props.renderContent(this.state.disabled)}
                    </Animated.View>
                  </PanGestureHandler>
                </Animated.View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </TouchableOpacity>
        </TapGestureHandler>
      </Modal>
    );
  }
}
