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
  renderContent: (onSwipe: boolean) => any;
  visibleHeight: number;
  onClose?: () => void;
}

interface IState {
  lastSnap: number;
  isVisible: boolean;
  onSwipe: boolean;
  _lastScrollY: Animated.Value;
  _lastScrollYValue: number;
}

const windowHeight = Dimensions.get("window").height;

export default class BottomSheet extends Component<IProps, IState> {
  private SNAP_POINTS_FROM_TOP: number[];
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
      isVisible: false,
      onSwipe: false,
      _lastScrollY: new Animated.Value(0),
      _lastScrollYValue: 0,
    };
    // this._backgroundOpacity = new Animated.Value(
    //   windowHeight - this.props.visibleHeight,
    // );

    this.state._lastScrollY.addListener(({ value }) => {
      this.setState({
        _lastScrollYValue: value,
      });
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
      this.state._lastScrollY
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

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  private _onHeaderHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.oldState === State.BEGAN) {
      this.setState({
        onSwipe: true,
      });
      // this.props.onSwipeStart && this.props.onSwipeStart();
      this.state._lastScrollY.setValue(0);
    } else if (nativeEvent.state === 5) {
      this.setState({
        onSwipe: false,
      });
      // this.props.onSwipeEnd && this.props.onSwipeEnd();
    }
    this._onHandlerStateChange({ nativeEvent });
  };
  private _onHandlerStateChange = ({ nativeEvent }: any) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let { velocityY, translationY } = nativeEvent;
      translationY -= this.state._lastScrollYValue;
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
          this.setState({
            isVisible: false,
          });
          this.props.onClose && this.props.onClose();
        }
      });
    }
  };

  public open = (visibleHeight?: number, callback?: any) => {
    this._translateYOffset.setValue(windowHeight);
    this.setState(
      {
        isVisible: true,
      },
      () =>
        Animated.spring(this._translateYOffset, {
          velocity: 0.01,
          tension: 68,
          friction: 12,
          toValue:
            windowHeight - (visibleHeight || this.props.visibleHeight + 1),
          useNativeDriver: true,
        }).start(callback && callback())
    );
  };

  public close = () => {
    Animated.timing(this._translateYOffset, {
      toValue: windowHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        isVisible: false,
      });
      this.props.onClose && this.props.onClose();
    });
  };

  render() {
    return (
      <Modal
        visible={this.state.isVisible}
        transparent={true}
        style={{ flex: 1 }}
      >
        <TapGestureHandler>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1 }}
            onPress={() => this.close()}
          >
            <Animated.View
              style={{
                flex: 1,
                backgroundColor: "#000000",
                opacity: this._translateY.interpolate({
                  inputRange: [
                    windowHeight - this.props.visibleHeight,
                    windowHeight,
                  ],
                  outputRange: [0.5, 0],
                  extrapolate: "clamp",
                }),
              }}
              pointerEvents="box-none"
            />
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
                    {this.props.renderContent(this.state.onSwipe)}
                  </Animated.View>
                </PanGestureHandler>
              </Animated.View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </TapGestureHandler>
      </Modal>
    );
  }
}
