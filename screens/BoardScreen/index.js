import { Text, Dimensions } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { getScaledDimension } from "../../utils/helpers";
import styles from "./styles";
import { useCallback, useMemo } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MARGIN = getScaledDimension(20, "width");
const BLOCKS_IN_ONE_ROW = 10;
const SPACE_BETWEEN_BLOCKS = getScaledDimension(2, "width");
const FONT_SIZE = getScaledDimension(20, "font");
const SIZE_OF_ONE_BLOCK =
  (SCREEN_WIDTH - 2 * MARGIN - (BLOCKS_IN_ONE_ROW - 1) * SPACE_BETWEEN_BLOCKS) /
  BLOCKS_IN_ONE_ROW;
const BLOCK_WIDTH = SIZE_OF_ONE_BLOCK + SPACE_BETWEEN_BLOCKS;

const BoardScreen = () => {
  const boardConfig = useMemo(
    () => new Array(10).fill(new Array(10).fill("A")),
    []
  );
  const xFromTopLeft = useSharedValue(0);
  const yFromTopLeft = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const xCount = useSharedValue(0);
  const yCount = useSharedValue(0);
  const tapStart = useSharedValue(false);

  const setCoordX = useCallback((x) => {
    startX.value = Math.floor(x / BLOCK_WIDTH);
    tapStart.value = true;
  }, []);

  const setCoordY = useCallback((y) => {
    startY.value = Math.floor(y / BLOCK_WIDTH);
    tapStart.value = true;
  }, []);

  const calcWord = useCallback((x, y) => {
    let str = "";
    const endX = Math.floor(x / BLOCK_WIDTH);
    const endY = Math.floor(y / BLOCK_WIDTH);

    if (Math.abs(endX - startX.value) > Math.abs(endY - startY.value)) {
      if (endX > startX.value) {
        for (let i = startX.value; i <= endX; i++) {
          str += boardConfig[startY.value][i];
        }
      } else {
        for (let i = startX.value; i >= endX; i--) {
          str += boardConfig[startY.value][i];
        }
      }
    } else if (Math.abs(endX - startX.value) < Math.abs(endY - startY.value)) {
      if (endY > startY.value) {
        for (let i = startY.value; i <= endY; i++) {
          str += boardConfig[i][startX.value];
        }
      } else {
        for (let i = startY.value; i >= endY; i--) {
          str += boardConfig[i][startX.value];
        }
      }
    } else {
      if (endX > startX.value && endY < startY.value) {
        for (
          let i = startX.value, j = startY.value;
          i <= endX, j >= endY;
          i++, j--
        ) {
          str += boardConfig[i][j];
        }
      } else if (endX > startX.value && endY > startY.value) {
        for (
          let i = startX.value, j = startY.value;
          i <= endX, j <= endY;
          i++, j++
        ) {
          str += boardConfig[i][j];
        }
      } else if (endX < startX.value && endY < startY.value) {
        for (
          let i = startX.value, j = startY.value;
          i >= endX, j >= endY;
          i--, j--
        ) {
          str += boardConfig[i][j];
        }
      } else {
        for (
          let i = startX.value, j = startY.value;
          i >= endX, j <= endY;
          i--, j++
        ) {
          str += boardConfig[i][j];
        }
      }
    }

    console.log(str);
  }, []);

  const calcXCount = useCallback((x) => {
    const presentCoord = Math.floor(x / BLOCK_WIDTH);
    xCount.value = Math.abs(startX.value - presentCoord) + 1;
  }, []);

  const calcYCount = useCallback((y) => {
    const presentCoord = Math.floor(y / BLOCK_WIDTH);
    yCount.value = Math.abs(startY.value - presentCoord) + 1;
  }, []);

  const gestureEventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      runOnJS(setCoordX)(event.x);
      runOnJS(setCoordY)(event.y);
      xFromTopLeft.value = event.x;
      yFromTopLeft.value = event.y;
    },
    onActive: (event, ctx) => {
      xFromTopLeft.value = event.x;
      yFromTopLeft.value = event.y;
      runOnJS(calcXCount)(event.x);
      runOnJS(calcYCount)(event.y);
    },
    onEnd: (event, ctx) => {
      tapStart.value = false;
      runOnJS(calcWord)(event.x, event.y);
      xFromTopLeft.value = 0;
      yFromTopLeft.value = 0;
    },
  });

  const colMap = useCallback(
    (rId, col, cId) => (
      <Animated.View
        key={`${rId}${cId}`}
        style={[
          styles.block,
          useAnimatedStyle(() => {
            return {
              backgroundColor:
                tapStart.value &&
                (xCount.value === yCount.value
                  ? (cId * BLOCK_WIDTH >= startX.value * BLOCK_WIDTH &&
                      cId * BLOCK_WIDTH < xFromTopLeft.value &&
                      rId * BLOCK_WIDTH >= startY.value * BLOCK_WIDTH &&
                      rId * BLOCK_WIDTH < yFromTopLeft.value &&
                      cId - rId === startX.value - startY.value) ||
                    (cId * BLOCK_WIDTH >= startX.value * BLOCK_WIDTH &&
                      cId * BLOCK_WIDTH < xFromTopLeft.value &&
                      rId * BLOCK_WIDTH <
                        startY.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK &&
                      rId * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK >=
                        yFromTopLeft.value &&
                      rId + cId === startX.value + startY.value) ||
                    (cId * BLOCK_WIDTH <
                      startX.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK &&
                      cId * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK >=
                        xFromTopLeft.value &&
                      rId * BLOCK_WIDTH <
                        startY.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK &&
                      rId * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK >=
                        yFromTopLeft.value &&
                      cId - rId === startX.value - startY.value) ||
                    (cId * BLOCK_WIDTH <
                      startX.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK &&
                      cId * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK >=
                        xFromTopLeft.value &&
                      rId * BLOCK_WIDTH >= startY.value * BLOCK_WIDTH &&
                      rId * BLOCK_WIDTH < yFromTopLeft.value &&
                      cId + rId === startX.value + startY.value)
                  : xCount.value > yCount.value
                  ? (cId * BLOCK_WIDTH >= startX.value * BLOCK_WIDTH &&
                      cId * BLOCK_WIDTH < xFromTopLeft.value &&
                      rId * BLOCK_WIDTH >= startY.value * BLOCK_WIDTH &&
                      rId * BLOCK_WIDTH <
                        startY.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK) ||
                    (cId * BLOCK_WIDTH <
                      startX.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK &&
                      cId * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK >=
                        xFromTopLeft.value &&
                      rId * BLOCK_WIDTH >= startY.value * BLOCK_WIDTH &&
                      rId * BLOCK_WIDTH <
                        startY.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK)
                  : (rId * BLOCK_WIDTH >= startY.value * BLOCK_WIDTH &&
                      rId * BLOCK_WIDTH < yFromTopLeft.value &&
                      cId * BLOCK_WIDTH >= startX.value * BLOCK_WIDTH &&
                      cId * BLOCK_WIDTH <
                        startX.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK) ||
                    (rId * BLOCK_WIDTH <
                      startY.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK &&
                      rId * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK >=
                        yFromTopLeft.value &&
                      cId * BLOCK_WIDTH >= startX.value * BLOCK_WIDTH &&
                      cId * BLOCK_WIDTH <
                        startX.value * BLOCK_WIDTH + SIZE_OF_ONE_BLOCK))
                  ? "red"
                  : "green",
            };
          }, []),
          {
            marginRight:
              cId !== BLOCKS_IN_ONE_ROW - 1 ? SPACE_BETWEEN_BLOCKS : 0,
          },
        ]}
      >
        <Text style={{ fontSize: FONT_SIZE }}>{col}</Text>
      </Animated.View>
    ),
    []
  );

  const rowMap = useCallback(
    (row, rId) => (
      <Animated.View
        key={rId}
        style={{
          flexDirection: "row",
          marginTop: rId > 0 ? getScaledDimension(2, "width") : 0,
        }}
      >
        {row.map((...args) => colMap(rId, ...args))}
      </Animated.View>
    ),
    []
  );

  return (
    <ScreenWrapper>
      <PanGestureHandler onGestureEvent={gestureEventHandler}>
        <Animated.View>{boardConfig.map(rowMap)}</Animated.View>
      </PanGestureHandler>
    </ScreenWrapper>
  );
};

export default BoardScreen;
