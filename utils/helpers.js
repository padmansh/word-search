import { Dimensions } from "react-native";

const baseHeight = 731;
const baseWidth = 411;

const screenDimensions = Dimensions.get("window");
const { height, width } = screenDimensions;

export const getScaledDimension = (dimension, type) => {
  let ratio = 1;
  switch (type) {
    case "height":
      ratio = height / baseHeight;
      break;
    case "width":
    case "font":
      ratio = width / baseWidth;
      break;
  }

  return ratio * dimension;
};
