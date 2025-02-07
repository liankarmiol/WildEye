import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Alert,
  Animated,
} from "react-native";
import { Stack } from "expo-router";
import StyledButton from "@/components/StyledButton";
import * as Location from "expo-location";
import { useEffect, useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { ActivityIndicator } from "react-native";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-native-uuid";

import {
  primary,
  secondary,
  tintColorLight,
  tintColorDark,
  borderRadius,
  borderWidth,
  labelFontSize,
} from "@/constants/ThemeVariables";
import { push } from "firebase/database";

export default function PostModal() {
  const [location, setLocation] = useState({});
  const [scanImage, setScanImage] = useState("");
  const [loading, setLoading] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    if (id) {
      getPost();
    }
  }, [id]);

  async function getPost() {
    const response = await fetch(
      `https://wildeye-cam-default-rtdb.firebaseio.com/${id}.json`
    );
    const data = await response.json();
    setScanImage(data.scanImage);
  }

  useEffect(() => {
    loadLocation();
  }, []);

  async function requestLocationPermissions() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
  }

  async function requestCameraPermissions() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      console.log("Permissions to access camera was denied");
      return;
    }
  }

  async function loadLocation() {
    await requestLocationPermissions();
    setLocation(await getLocation());
  }
  async function getLocation() {
    const currentLocation = await Location.getCurrentPositionAsync();
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${currentLocation.coords.latitude}+${currentLocation.coords.longitude}&key=0c027f821c5046ad83319671eef0d36a`
    );
    const data = await response.json();
    return {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      city:
        data.results[0].components.city ||
        data.results[0].components.postal_city ||
        data.results[0].components.town,
      country: data.results[0].components.country,
    };
  }

  async function chooseImage(type) {
    let result;
    console.log("Choosing image from", type);
    if (type === "camera") {
      await requestCameraPermissions();
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true,
        quality: 0.3,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true,
        quality: 0.3,
      });
    }

    if (!result.canceled) {
      // Convert image to blob
      const response = await fetch(result.assets[0].uri);

      const blob = await response.blob();

      // Create a reference to the file in Cloud Storage
      const storage = getStorage();
      const storageRef = ref(storage, `images/${uuid.v4()}`);

      // Upload the file to Cloud Storage
      const snapshot = await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      // Save the download URL to React state
      setScanImage(downloadURL);
      console.log("Image uploaded to Cloud Storage:", downloadURL);
      getSerpApiResults(downloadURL);
    }
  }

  function chooseCameraOrLibrary() {
    showActionSheetWithOptions(
      {
        options: ["Take a photo", "Choose from library", "Cancel"],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          chooseImage("camera");
        } else if (buttonIndex === 1) {
          chooseImage("library");
        }
      }
    );
  }

  async function getSerpApiResults(imageUrl) {
    console.log("Getting SERP API results");
    setLoading(true); // Set loading to true before the API call
    const apiKey =
      "f3fe9c578687849a4b80a3d9535202f0f693153f8ba7517e2f58f6b3607ee26f";
    const engine = "google_lens";
    console.log("***IMAGE-URL: ", imageUrl);
    imageUrl = encodeURIComponent(imageUrl);
    // imageUrl = encodeURIComponent(imageUrl);

    const url = `https://serpapi.com/search?api_key=${apiKey}&engine=${engine}&url=${imageUrl}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("SERP API results:", data);
      // Check if knowledge_graph exists and has at least one item
      if (data.knowledge_graph && data.knowledge_graph.length > 0) {
        // Extract the title from the first item
        const title = data.knowledge_graph[0].title;
        const subtitle = data.knowledge_graph[0].subtitle;
        console.log(
          "Title from the first item of knowledge_graph:",
          title,
          ", Subtitle:",
          subtitle
        );

        getWikipediaApiResults(title, imageUrl);
      } else {
        Alert.alert("Couldn't identify animal", "Try a different picture", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch SERP API results:", error);
      // Handle error appropriately
    } finally {
      setLoading(false); // Set loading to false after the API call is complete
    }
  }

  async function getWikipediaApiResults(animalType, scanImage) {
    console.log("Getting Wikipedia API results");
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${animalType}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data) {
      const summary = data.extract;

      const wikiImage =
        data.thumbnail?.source ||
        "https://cederdorff.com/race/images/placeholder-image.webp";

      console.log("Extract from Wikipedia API:", summary);
      router.push({
        pathname: "scan/[id]",
        params: {
          title: animalType,
          summary,
          wikiImage,
          scanImage: scanImage,
        },
      });
    } else {
      Alert.alert("No Wikipedia page", "Try a different picture", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  }

  const LoadingDot = () => {
    const opacity = new Animated.Value(1);
    const opacities = useRef([
      new Animated.Value(0),
      new Animated.Value(0),
      new Animated.Value(0),
    ]).current;
    const timing = (toValue, delay) =>
      Animated.timing(opacities[toValue], {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      });

    const animate = () => {
      Animated.loop(
        Animated.sequence([
          timing(0, 0),
          Animated.timing(opacities[0], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          timing(1, 30),
          Animated.timing(opacities[1], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          timing(2, 60),
          Animated.timing(opacities[2], {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    useEffect(() => {
      animate();
    }, []);

    return (
      <Animated.View style={styles.animated}>
        <Text style={styles.loadingText}>Loading</Text>
        {opacities.map((opacity, index) => (
          <Animated.Text
            key={index}
            style={{ opacity, marginRight: 5, ...styles.loadingDot }}
          >
            .
          </Animated.Text>
        ))}
      </Animated.View>
    );
  };

  return (
    <>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.container}>
          <Stack.Screen
            options={{
              title: "Scan Animal",
            }}
          />
          <TouchableOpacity onPress={chooseCameraOrLibrary}>
            <Image
              style={styles.image}
              source={{
                uri:
                  scanImage ||
                  "https://cederdorff.com/race/images/placeholder-image.webp",
              }}
            />
          </TouchableOpacity>
          <Text style={styles.locationTitle}>Current Location</Text>
          <Text style={styles.location}>
            {location.city ? (
              `${location.city}, ${location.country}`
            ) : (
              <LoadingDot />
            )}
          </Text>
          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: secondary,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  textInput: {
    height: 40,
    width: 400,
    margin: 12,
    padding: 10,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: { primary },
  },
  image: {
    height: 400,
    width: 400,
    margin: 10,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: { primary },
  },
  locationTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  location: {
    fontSize: 20,
    color: primary,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
  },
  loadingDot: {
    fontSize: 20,
    color: "black",
  },
  loadingText: {
    fontSize: 18,
    color: "black",
    marginRight: 10,
  },
  animated: {
    flexDirection: "row",
    alignItems: "center",
  },
});
