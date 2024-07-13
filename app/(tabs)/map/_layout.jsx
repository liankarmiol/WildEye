import { Stack } from "expo-router";
import { primary, tintColorLight } from "@/constants/ThemeVariables";

export default function mapLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: primary,
        },
        headerTintColor: tintColorLight,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundcolor: primary,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Map" }} />
    </Stack>
  );
}
