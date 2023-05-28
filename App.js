import { SafeAreaProvider } from "react-native-safe-area-context";
import BoardScreen from "./screens/BoardScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <BoardScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
