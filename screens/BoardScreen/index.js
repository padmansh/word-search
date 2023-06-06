import { Text, Dimensions, View } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { getScaledDimension } from "../../utils/helpers";
import styles from "./styles";
import { useCallback, useEffect, useRef, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

const words = [
  "ABBA",
  "JASOOS",
  "SATYAM",
  "ANIKET",
  "KANISHK",
  "PRIYAN",
  "TEMARY",
  "LAUGHING",
  "TOMATO",
];
const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const SCREEN_WIDTH = Dimensions.get("window").width;
const MARGIN = getScaledDimension(20, "width");
const BLOCKS_IN_ONE_ROW = 10;
const SPACE_BETWEEN_BLOCKS = getScaledDimension(2, "width");
const FONT_SIZE = getScaledDimension(20, "font");
const SIZE_OF_ONE_BLOCK =
  (SCREEN_WIDTH - 2 * MARGIN - (BLOCKS_IN_ONE_ROW - 1) * SPACE_BETWEEN_BLOCKS) /
  BLOCKS_IN_ONE_ROW;
const BLOCK_WIDTH = SIZE_OF_ONE_BLOCK + SPACE_BETWEEN_BLOCKS;
const directionsConfig = [
  "RIGHT_LEFT",
  "LEFT_RIGHT",
  "TOP_BOTTOM",
  "BOTTOM_TOP",
  "LEFT_RIGHT_UP",
  "LEFT_RIGHT_DOWN",
  "RIGHT_LEFT_UP",
  "RIGHT_LEFT_DOWN",
];

const BoardScreen = () => {
  const boardRef = useRef(null);

  const [boardConfig, setBoardConfig] = useState([
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  ]);
  const xFromTopLeft = useSharedValue(0);
  const yFromTopLeft = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const xCount = useSharedValue(0);
  const yCount = useSharedValue(0);
  const tapStart = useSharedValue(false);

  const makeInitialBoard = useCallback(() => {
    boardRef.current = [];
    for (let i = 0; i < BLOCKS_IN_ONE_ROW; i++) {
      let row = [];
      for (let j = 0; j < BLOCKS_IN_ONE_ROW; j++) {
        row.push({ value: "", strike: false, strikeDirection: [] });
      }
      boardRef?.current.push(row);
    }
  }, []);

  const findRandomBlockIndex = useCallback(() => {
    return {
      i: Math.floor(Math.random() * BLOCKS_IN_ONE_ROW),
      j: Math.floor(Math.random() * BLOCKS_IN_ONE_ROW),
    };
  }, []);

  const findRandomDirection = useCallback(() => {
    return directionsConfig?.[
      Math.floor(Math.random() * directionsConfig.length)
    ];
  }, []);

  const checkAndFillWord = useCallback((word, blockId, direction) => {
    if (direction === "LEFT_RIGHT") {
      if (blockId?.j + word.length - 1 < BLOCKS_IN_ONE_ROW) {
        let flag = 0;
        for (let j = blockId?.j; j < blockId?.j + word.length; j++) {
          if (
            boardRef?.current[blockId?.i][j]?.value === "" ||
            boardRef?.current[blockId?.i][j]?.value === word[j - blockId?.j]
          ) {
            flag++;
          }
        }

        if (flag === word.length) {
          for (let j = blockId?.j; j < blockId?.j + word.length; j++) {
            boardRef.current[blockId?.i][j].value = word?.[j - blockId?.j];
          }
        } else {
          fillWordInGrid(word);
        }
      } else {
        fillWordInGrid(word);
      }
    }
    if (direction === "RIGHT_LEFT") {
      if (blockId?.j - word.length + 1 >= 0) {
        let flag = 0;
        for (let j = blockId?.j; j >= blockId?.j - word.length + 1; j--) {
          if (
            boardRef?.current[blockId?.i][j]?.value === "" ||
            boardRef?.current[blockId?.i][j]?.value === word[blockId?.j - j]
          ) {
            flag++;
          }
        }

        if (flag === word.length) {
          for (let j = blockId?.j; j >= blockId?.j - word.length + 1; j--) {
            boardRef.current[blockId?.i][j].value = word?.[blockId?.j - j];
          }
        } else {
          fillWordInGrid(word);
        }
      } else {
        fillWordInGrid(word);
      }
    }
    if (direction === "TOP_BOTTOM") {
      if (blockId?.i + word.length - 1 < BLOCKS_IN_ONE_ROW) {
        let flag = 0;
        for (let i = blockId?.i; i < blockId?.i + word.length; i++) {
          if (
            boardRef?.current[i][blockId?.j]?.value === "" ||
            boardRef?.current[i][blockId?.j]?.value === word[i - blockId?.i]
          ) {
            flag++;
          }
        }

        if (flag === word.length) {
          for (let i = blockId?.i; i < blockId?.i + word.length; i++) {
            boardRef.current[i][blockId?.j].value = word?.[i - blockId?.i];
          }
        } else {
          fillWordInGrid(word);
        }
      } else {
        fillWordInGrid(word);
      }
    }
    if (direction === "BOTTOM_TOP") {
      if (blockId?.i - word.length + 1 >= 0) {
        let flag = 0;
        for (let i = blockId?.i; i >= blockId?.i - word.length + 1; i--) {
          if (
            boardRef?.current[i][blockId?.j]?.value === "" ||
            boardRef?.current[i][blockId?.j]?.value === word[blockId?.i - i]
          ) {
            flag++;
          }
        }

        if (flag === word.length) {
          for (let i = blockId?.i; i >= blockId?.i - word.length + 1; i--) {
            boardRef.current[i][blockId?.j].value = word?.[blockId?.i - i];
          }
        } else {
          fillWordInGrid(word);
        }
      } else {
        fillWordInGrid(word);
      }
    }
    if (direction === "LEFT_RIGHT_DOWN") {
      let flag = 0;
      if (
        blockId?.j + word.length - 1 < BLOCKS_IN_ONE_ROW &&
        blockId?.i + word.length - 1 < BLOCKS_IN_ONE_ROW
      ) {
        for (
          let j = blockId?.j, i = blockId?.i;
          j < blockId?.j + word.length, i < blockId?.i + word.length;
          j++, i++
        ) {
          if (
            boardRef?.current[i][j]?.value === "" ||
            boardRef?.current[i][j]?.value === word[i - blockId?.i]
          ) {
            flag++;
          }
        }
        if (flag === word.length) {
          for (
            let j = blockId?.j, i = blockId?.i;
            j < blockId?.j + word.length, i < blockId?.i + word.length;
            j++, i++
          ) {
            boardRef.current[i][j].value = word?.[i - blockId?.i];
          }
        } else {
          fillWordInGrid(word);
        }
      } else {
        fillWordInGrid(word);
      }
    }
    if (direction === "LEFT_RIGHT_UP") {
      let flag = 0;
      if (
        blockId?.j + word.length - 1 < BLOCKS_IN_ONE_ROW &&
        blockId?.i - word.length + 1 >= 0
      ) {
        for (
          let j = blockId?.j, i = blockId?.i;
          j < blockId?.j + word.length, i >= blockId?.i - word.length + 1;
          j++, i--
        ) {
          if (
            boardRef?.current[i][j]?.value === "" ||
            boardRef?.current[i][j]?.value === word[j - blockId?.j]
          ) {
            flag++;
          }
        }
        if (flag === word.length) {
          for (
            let j = blockId?.j, i = blockId?.i;
            j < blockId?.j + word.length, i >= blockId?.i - word.length + 1;
            j++, i--
          ) {
            boardRef.current[i][j].value = word?.[j - blockId?.j];
          }
        } else {
          fillWordInGrid(word);
        }
      } else {
        fillWordInGrid(word);
      }
    }
    if (direction === "RIGHT_LEFT_DOWN") {
      let flag = 0;
      if (
        blockId?.j - word.length + 1 >= 0 &&
        blockId?.i + word.length - 1 < BLOCKS_IN_ONE_ROW
      ) {
        for (
          let j = blockId?.j, i = blockId?.i;
          j >= blockId?.j - word.length + 1, i < blockId?.i + word.length;
          j--, i++
        ) {
          if (
            boardRef?.current[i][j]?.value === "" ||
            boardRef?.current[i][j]?.value === word[i - blockId?.i]
          ) {
            flag++;
          }
        }
        if (flag === word.length) {
          for (
            let j = blockId?.j, i = blockId?.i;
            j >= blockId?.j - word.length + 1, i < blockId?.i + word.length;
            j--, i++
          ) {
            boardRef.current[i][j].value = word?.[i - blockId?.i];
          }
        } else {
          fillWordInGrid(word);
        }
      } else {
        fillWordInGrid(word);
      }
    }
    if (direction === "RIGHT_LEFT_UP") {
      let flag = 0;
      if (
        blockId?.j - word.length + 1 >= 0 &&
        blockId?.i - word.length + 1 >= 0
      ) {
        for (
          let j = blockId?.j, i = blockId?.i;
          j >= blockId?.j - word.length + 1, i >= blockId?.i - word.length + 1;
          j--, i--
        ) {
          if (
            boardRef?.current[i][j]?.value === "" ||
            boardRef?.current[i][j]?.value === word[blockId?.j - j]
          ) {
            flag++;
          }
        }
        if (flag === word.length) {
          for (
            let j = blockId?.j, i = blockId?.i;
            j >= blockId?.j - word.length + 1,
              i >= blockId?.i - word.length + 1;
            j--, i--
          ) {
            boardRef.current[i][j].value = word?.[blockId?.j - j];
          }
        } else {
          fillWordInGrid(word);
        }
      } else {
        fillWordInGrid(word);
      }
    }
  }, []);

  const fillWordInGrid = useCallback((word) => {
    const blockId = findRandomBlockIndex();
    const direction = findRandomDirection();

    checkAndFillWord(word, blockId, direction);
  }, []);

  const fillEmptyBlocks = useCallback(() => {
    for (let i = 0; i < BLOCKS_IN_ONE_ROW; i++) {
      for (let j = 0; j < BLOCKS_IN_ONE_ROW; j++) {
        if (boardRef?.current[i][j]?.value === "") {
          boardRef.current[i][j].value =
            alphabets?.[Math.floor(Math.random() * alphabets.length)];
        }
      }
    }
  }, []);

  const setCoordX = useCallback((x) => {
    startX.value = Math.floor(x / BLOCK_WIDTH);
  }, []);

  const setCoordY = useCallback((y) => {
    startY.value = Math.floor(y / BLOCK_WIDTH);
  }, []);

  const calcWord = useCallback(
    (x, y) => {
      let result = "";
      const endX = Math.floor(x / BLOCK_WIDTH);
      const endY = Math.floor(y / BLOCK_WIDTH);

      if (Math.abs(endX - startX.value) > Math.abs(endY - startY.value)) {
        if (endX > startX.value) {
          for (let i = startX.value; i <= endX; i++) {
            result += boardConfig[startY.value][i]?.value;
          }

          if (words?.includes(result)) {
            for (let i = startX.value; i <= endX; i++) {
              boardRef.current[startY.value][i].strike = true;
              boardRef.current[startY.value][i].strikeDirection.push("H");
            }

            setBoardConfig(JSON.parse(JSON.stringify(boardRef?.current)));
          }
        } else {
          for (let i = startX.value; i >= endX; i--) {
            result += boardConfig[startY.value][i]?.value;
          }

          if (words?.includes(result)) {
            for (let i = startX.value; i >= endX; i--) {
              boardRef.current[startY.value][i].strike = true;
              boardRef.current[startY.value][i].strikeDirection.push("H");
            }

            setBoardConfig(JSON.parse(JSON.stringify(boardRef?.current)));
          }
        }
      } else if (
        Math.abs(endX - startX.value) < Math.abs(endY - startY.value)
      ) {
        if (endY > startY.value) {
          for (let i = startY.value; i <= endY; i++) {
            result += boardConfig[i][startX.value]?.value;
          }

          if (words?.includes(result)) {
            for (let i = startY.value; i <= endY; i++) {
              boardRef.current[i][startX.value].strike = true;
              boardRef.current[i][startX.value].strikeDirection.push("V");
            }

            setBoardConfig(JSON.parse(JSON.stringify(boardRef?.current)));
          }
        } else {
          for (let i = startY.value; i >= endY; i--) {
            result += boardConfig[i][startX.value]?.value;
          }

          if (words?.includes(result)) {
            for (let i = startY.value; i >= endY; i--) {
              boardRef.current[i][startX.value].strike = true;
              boardRef.current[i][startX.value].strikeDirection.push("V");
            }

            setBoardConfig(JSON.parse(JSON.stringify(boardRef?.current)));
          }
        }
      } else {
        if (endX > startX.value && endY < startY.value) {
          for (
            let i = startX.value, j = startY.value;
            i <= endX, j >= endY;
            i++, j--
          ) {
            result += boardConfig[j][i]?.value;
          }

          if (words?.includes(result)) {
            for (
              let i = startX.value, j = startY.value;
              i <= endX, j >= endY;
              i++, j--
            ) {
              boardRef.current[j][i].strike = true;
              boardRef.current[j][i].strikeDirection.push("DU");
            }

            setBoardConfig(JSON.parse(JSON.stringify(boardRef?.current)));
          }
        } else if (endX > startX.value && endY > startY.value) {
          for (
            let i = startX.value, j = startY.value;
            i <= endX, j <= endY;
            i++, j++
          ) {
            result += boardConfig[j][i]?.value;
          }

          if (words?.includes(result)) {
            for (
              let i = startX.value, j = startY.value;
              i <= endX, j <= endY;
              i++, j++
            ) {
              boardRef.current[j][i].strike = true;
              boardRef.current[j][i].strikeDirection.push("DD");
            }

            setBoardConfig(JSON.parse(JSON.stringify(boardRef?.current)));
          }
        } else if (endX < startX.value && endY < startY.value) {
          for (
            let i = startX.value, j = startY.value;
            i >= endX, j >= endY;
            i--, j--
          ) {
            result += boardConfig[j][i]?.value;
          }

          if (words?.includes(result)) {
            for (
              let i = startX.value, j = startY.value;
              i >= endX, j >= endY;
              i--, j--
            ) {
              boardRef.current[j][i].strike = true;
              boardRef.current[j][i].strikeDirection.push("DD");
            }

            setBoardConfig(JSON.parse(JSON.stringify(boardRef?.current)));
          }
        } else {
          for (
            let i = startX.value, j = startY.value;
            i >= endX, j <= endY;
            i--, j++
          ) {
            result += boardConfig[j][i]?.value;
          }

          if (words?.includes(result)) {
            for (
              let i = startX.value, j = startY.value;
              i >= endX, j <= endY;
              i--, j++
            ) {
              boardRef.current[j][i].strike = true;
              boardRef.current[j][i].strikeDirection.push("DU");
            }

            setBoardConfig(JSON.parse(JSON.stringify(boardRef?.current)));
          }
        }
      }
    },
    [boardConfig]
  );

  const calcXCount = useCallback((x) => {
    const presentCoord = Math.floor(x / BLOCK_WIDTH);
    xCount.value = Math.abs(startX.value - presentCoord) + 1;
  }, []);

  const calcYCount = useCallback((y) => {
    const presentCoord = Math.floor(y / BLOCK_WIDTH);
    yCount.value = Math.abs(startY.value - presentCoord) + 1;
  }, []);

  const gestureEventHandler = useAnimatedGestureHandler({
    onStart: (event) => {
      runOnJS(setCoordX)(event.x);
      runOnJS(setCoordY)(event.y);
      xFromTopLeft.value = event.x;
      yFromTopLeft.value = event.y;
    },
    onActive: (event) => {
      if (!tapStart.value) {
        tapStart.value = true;
      }
      xFromTopLeft.value = event.x;
      yFromTopLeft.value = event.y;
      runOnJS(calcXCount)(event.x);
      runOnJS(calcYCount)(event.y);
    },
    onEnd: (event) => {
      tapStart.value = false;
      runOnJS(calcWord)(event.x, event.y);
      xFromTopLeft.value = 0;
      yFromTopLeft.value = 0;
    },
  });

  const strikeMap = useCallback(
    (direction, idx) => (
      <View
        key={idx}
        style={{
          position: "absolute",
          height: 2,
          width:
            direction === "DU" || direction === "DD"
              ? Math.sqrt(2) * SIZE_OF_ONE_BLOCK
              : SIZE_OF_ONE_BLOCK,
          backgroundColor: "black",
          transform: [
            {
              rotate:
                direction === "V"
                  ? "90deg"
                  : direction === "DU"
                  ? "-45deg"
                  : direction === "DD"
                  ? "45deg"
                  : "0deg",
            },
          ],
        }}
      />
    ),
    []
  );

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
        <Text style={{ fontSize: FONT_SIZE }}>{col?.value}</Text>
        {col?.strike ? col?.strikeDirection?.map(strikeMap) : null}
      </Animated.View>
    ),
    [boardConfig]
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
    [boardConfig]
  );

  useEffect(() => {
    makeInitialBoard();

    words.forEach((word) => {
      fillWordInGrid(word);
    });

    fillEmptyBlocks();

    setBoardConfig(boardRef?.current);
  }, []);

  return (
    <ScreenWrapper>
      <PanGestureHandler onGestureEvent={gestureEventHandler}>
        <Animated.View>{boardConfig?.map(rowMap)}</Animated.View>
      </PanGestureHandler>
    </ScreenWrapper>
  );
};

export default BoardScreen;
