import primary from "@/constants/ThemeVariables";
import { Image, StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";

export default function Avatar({ uid }) {
  const [user, setUser] = useState({});
  useEffect(() => {
    if (uid) {
      getUser();
    }
  }, [uid]);
  async function getUser() {
    const response = await fetch(
      `https://wildeye-cam-default-rtdb.firebaseio.com/users/${uid}.json`
    );
    const data = await response.json();
    setUser(data);
  }
  return (
    <View style={styles.avatarContainer}>
      <View style={styles.avatarImageContainer}>
        <Image
          style={styles.avatarImage}
          source={{
            uri:
              user?.image ||
              "https://cdn-icons-png.flaticon.com/512/6511/6511076.png",
          }}
        />
      </View>
      <View>
        <Text style={styles.avatarName}>{user?.name || "anonymoose"}</Text>
        {/* <Text style={styles.avatarTitle}>{user.title}</Text> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  avatarImageContainer: {
    borderWidth: 3,
    borderColor: primary,
    borderRadius: 100,
    padding: 2,
    height: 55,
    marginRight: 12,
    width: 55,
  },
  avatarImage: {
    aspectRatio: 1,
    borderRadius: 100,
  },
  avatarName: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 12,
  },
  avatarTitle: {
    fontSize: 13,
    marginRight: 12,
  },
});
