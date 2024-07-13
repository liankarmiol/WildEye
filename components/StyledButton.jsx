import { Text, StyleSheet, Pressable } from "react-native";

import {
  primary,
  secondary,
  tintColorLight,
  tintColorDark,
  borderRadius,
  borderWidth,
  labelFontSize,
} from "@/constants/ThemeVariables";

export default function StyledButton({ title, onPress }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: primary,
    padding: 10,
    marginTop: 20,
    borderRadius: borderRadius,
    borderColor: secondary,
    borderWidth: borderWidth,
    justifyContent: "center",
    alignContent: "center",
    width: 370,
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
