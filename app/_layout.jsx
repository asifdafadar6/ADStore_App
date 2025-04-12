import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { ContextProvider } from "../components/provider/ContextApi";

export default function RootLayout() {
  return (
    <ContextProvider>
      <StatusBar barStyle="dark-content" backgroundColor={"transparent"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" /> 
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen name="(drawer)" />
      </Stack>
    </ContextProvider>
  );
}