import React, { useState } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Button,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { secondary, tintColorDark } from "@/constants/ThemeVariables";
import * as Location from "expo-location";
import { auth } from "@/firebaseConfig";
import { getLocation } from "@/components/GetLocation";

export default function AnimalDetails() {
  const [location, setLocation] = useState({});
  const [buttonPressed, setButtonPressed] = useState(false);
  const [loading, setLoading] = useState(false); // New state to track loading

  const { title, summary, wikiImage, scanImage } = useLocalSearchParams();

  async function handleCreatePost() {
    setLoading(true); // Start loading
    try {
      if (!auth.currentUser) {
        console.error("No user logged in");
        setLoading(false); // Stop loading if no user is logged in
        return;
      }
      const loc = await getLocation();
      setLocation(loc);
      console.log("Location:", loc);

      const createdAt = new Date().getTime();
      const post = {
        title,
        summary,
        scanImage,
        wikiImage,
        createdAt,
        location: loc,
        uid: auth?.currentUser?.uid,
      };

      const response = await fetch(
        "https://wildeye-cam-default-rtdb.firebaseio.com/posts.json",
        {
          method: "POST",
          body: JSON.stringify(post),
        }
      );

      setButtonPressed(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Stop loading regardless of the outcome
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer} // Add this line
    >
      <Stack.Screen options={{ title: "Information" }} />
      <Image source={{ uri: wikiImage }} style={styles.image} />
      <Button
        onPress={handleCreatePost}
        title={
          loading
            ? "Saving..."
            : buttonPressed
            ? "Saved to Profile!"
            : "Save to Profile"
        }
        disabled={loading || buttonPressed}
      />
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    // Define the content container styles
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  summary: {
    fontSize: 16,
    textAlign: "center",
    paddingBottom: 100,
  },
});
