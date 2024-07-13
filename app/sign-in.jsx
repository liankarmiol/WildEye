import { Stack, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import StyledButton from "../components/StyledButton";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ImageBackground } from "react-native";
import {
  primary,
  secondary,
  tintColorLight,
  tintColorDark,
  borderRadius,
  borderWidth,
  labelFontSize,
} from "@/constants/ThemeVariables";

const image = {
  // uri: "https://cdn.wallpapersafari.com/89/4/qg8ZYE.jpg",
  uri: "https://wallup.net/wp-content/uploads/2018/10/09/893521-texture-crocodile-animals.jpg",
  // uri: "https://i.pinimg.com/originals/ba/93/be/ba93be0876f974158e1a02113b92b666.jpg",
};

export default function SignIn() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  function handleSignIn() {
    signInWithEmailAndPassword(auth, mail, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Signed in as", user.email);
        router.replace("/scan");
      })
      .catch((error) => {
        let errorMessage = error.code.split("/")[1];
        errorMessage = errorMessage.replaceAll("-", " ");
        setMessage(errorMessage);
      });
  }
  function goToSignUp() {
    router.push("/sign-up");
  }
  return (
    <ImageBackground
      source={image}
      resizeMode="cover"
      style={styles.image}
      opacity={0.7}
    >
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Sign In" }} />
        {/* <Text style={styles.fieldTitle}>Email</Text> */}
        <TextInput
          placeholder={"Enter your Email"}
          placeholderTextColor={"black"}
          style={styles.textInput}
          onChangeText={setMail}
          value={mail}
          autoCapitalize="none"
        />
        {/* <Text style={styles.fieldTitle}>Password</Text> */}
        <TextInput
          autoCapitalize="none"
          onChangeText={setPassword}
          value={password}
          placeholder="Enter your Password"
          placeholderTextColor={"black"}
          secureTextEntry={true}
          style={styles.textInput}
        />
        <Text style={styles.errorMessage}>{message}</Text>
        <StyledButton title="Sign In" style="primary" onPress={handleSignIn} />
        <StyledButton
          title="Create New Account"
          style="primary"
          onPress={goToSignUp}
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
