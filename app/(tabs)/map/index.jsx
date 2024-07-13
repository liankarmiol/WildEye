import { StyleSheet, Text, View, Image, Platform } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import * as Location from "expo-location";

export default function mapTab() {
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    const response = await fetch(
      "https://wildeye-cam-default-rtdb.firebaseio.com/posts.json"
    );
    const data = await response.json();
    const arrayOfPosts = Object.keys(data).map((key) => {
      return {
        id: key,
        ...data[key],
      };
    });
    setPosts(arrayOfPosts);
  }

  useEffect(() => {
    async function requestLocationPermissions() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("permission to access location was denied");
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync();
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.04,
      });
    }
    requestLocationPermissions();
  }, []);
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        region={location}
        showsUserLocation={true}
      >
        {/* <Marker coordinate={location} title="You are Here" pinColor={"blue"} /> */}
        {posts.map((post) => (
          <Marker key={post.id} coordinate={post.location}>
            <Callout
              onPress={() => {
                router.push({
                  pathname: `map/${post.id}`,
                });
              }}
            >
              <View style={styles.calloutview}>
                {Platform.OS === "android" ? (
                  <WebView
                    source={{ uri: decodeURIComponent(post.scanImage) }}
                    style={styles.image}
                  />
                ) : (
                  <Image
                    source={{ uri: decodeURIComponent(post.scanImage) }}
                    style={styles.image}
                  />
                )}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: 100,
    height: 100,
    aspectRatio: "auto",
    resizeMode: "cover",
  },
  calloutview: {
    flex: 1,
    width: 100,
    height: 100,
  },
});
