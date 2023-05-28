import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getScaledDimension } from "../utils/helpers";

const SPACE = getScaledDimension(20, "width");

const ScreenWrapper = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ marginTop: insets.top, flex: 1, paddingHorizontal: SPACE }}>
      <StatusBar style="auto" />
      {children}
    </View>
  );
};

export default ScreenWrapper;
