import { useEffect, useState } from "react";
import * as Location from "expo-location";

export async function getLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission to access location was denied");
    return;
  }
  const currentLocation = await Location.getCurrentPositionAsync();
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${currentLocation.coords.latitude}+${currentLocation.coords.longitude}&key=3789b1c20cf2486399a15e4c7ba18ebc`
  );
  const data = await response.json();

  // Check if data.results and data.results[0] exist
  if (
    !data.results ||
    data.results.length === 0 ||
    !data.results[0].components
  ) {
    console.log("No location data found.");
    return;
  }

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
