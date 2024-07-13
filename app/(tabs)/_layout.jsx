import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, router } from "expo-router";
import { Pressable, Button, StyleSheet, Image, View } from "react-native";
import {
  primary,
  secondary,
  tintColorLight,
  tintColorDark,
  borderRadius,
  borderWidth,
  labelFontSize,
} from "@/constants/ThemeVariables";
import { Platform } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

function TabBarIcon(props) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      style={styles.tabBar}
      screenOptions={{
        tabBarActiveTintColor: primary,
        tabBarActiveBackgroundColor: secondary,
        tabBarInactiveTintColor: secondary,
        tabBarInactiveBackgroundColor: primary,
        headerStyle: {
          backgroundColor: primary,
        },
        headerTintColor: secondary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundColor: secondary,
          height: Platform.OS === "ios" ? 90 : 58,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          headerShown: false,
          tabBarLabel: "",

          tabBarIcon: ({ focused }) => {
            return (
              <View style={styles.imageWrapper}>
                <Image
                  style={styles.image}
                  source={{
                    uri: focused
                      ? "https://i.imgur.com/YeJW64V.jpg"
                      : "https://i.imgur.com/2qWQlXn.jpeg",
                  }}
                />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarItemStyle: {
            zIndex: -9,
          },
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "#fff",
    zIndex: 9999,
  },
  image: {
    height: 155,
    width: 155,
    borderRadius: 100,
  },
  imageWrapper: {
    zIndex: 9999,
    position: "relative",
    bottom: 0,
    left: 0,
  },
});
