import { StyleSheet, Dimensions } from "react-native";
import { getScaledDimension } from "../../utils/helpers";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MARGIN = getScaledDimension(20, "width");
const BLOCKS_IN_ONE_ROW = 10;
const SPACE_BETWEEN_BLOCKS = getScaledDimension(2, "width");
const SIZE_OF_ONE_BLOCK =
  (SCREEN_WIDTH - 2 * MARGIN - (BLOCKS_IN_ONE_ROW - 1) * SPACE_BETWEEN_BLOCKS) /
  BLOCKS_IN_ONE_ROW;

const styles = StyleSheet.create({
  block: {
    width: SIZE_OF_ONE_BLOCK,
    height: SIZE_OF_ONE_BLOCK,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
});

export default styles;
