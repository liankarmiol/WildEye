import { createUserWithEmailAndPassword } from "firebase/auth";
import StyledButton from "../components/StyledButton";
import { auth } from "../firebaseConfig";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  ImageBackground,
} from "react-native";
import { Stack, router } from "expo-router";
import {
  primary,
  secondary,
  tintColorLight,
  tintColorDark,
  borderRadius,
  borderWidth,
  labelFontSize,
} from "@/constants/ThemeVariables";

export default function SignUp() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function handleSignUp() {
    createUserWithEmailAndPassword(auth, mail, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(`signed in as ${user.email}`);
        router.replace("/sign-in");
      })
      .catch((error) => {
        let errorMessage = error.code.split("/")[1];
        errorMessage = errorMessage.replaceAll("-", " ");
        setMessage(errorMessage);
      });
  }

  const image = {
    uri: "https://i.pinimg.com/originals/88/fe/b9/88feb924fb0e9564ac917b3693e5abdb.jpg",
  };

  return (
    <ImageBackground
      source={image}
      resizeMode="cover"
      style={styles.image}
      opacity={0.7}
    >
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Create New Account" }} />
        <TextInput
          onChangeText={setMail}
          value={mail}
          placeholder="Enter your email address"
          placeholderTextColor={"black"}
          style={styles.textInput}
          autoCapitalize="none"
        />
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="Enter your Password"
          placeholderTextColor={"black"}
          secureTextEntry={true}
          style={styles.textInput}
        />
        <Text style={styles.errorMessage}>{message}</Text>
        <StyledButton
          title="Create New Account"
          style="primary"
          onPress={handleSignUp}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
  },
  textInput: {
    height: 40,
    width: "100%",
    margin: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "white",
    fontSize: 18,
    opacity: 0.8,
  },
  fieldTitle: {
    margin: 10,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
