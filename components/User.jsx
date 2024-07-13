import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import { primary, secondary } from "@/constants/ThemeVariables";
import { router } from "expo-router";

export default function User({ user }) {
  return (
    <TouchableOpacity onPress={() => router.push(`users/${user.id}`)}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarImageContainer}>
          <Image style={styles.avatarImage} source={{ uri: user.image }} />
        </View>
        <View>
          <View>
            <Text>{user.name}</Text>
          </View>
          <View>
            <Text>{user.title}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    flexDirection: "row",
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
});
