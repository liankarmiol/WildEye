import StyledButton from "@/components/StyledButton";
import {
  borderRadius,
  labelFontSize,
  placeholderTextColor,
  primary,
  secondary,
  tintColorLight,
} from "@/constants/ThemeVariables";
import { auth } from "@/firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { signOut } from "firebase/auth";
import Post from "../../components/Post";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
} from "react-native";
import React from "react";

export default function Profile() {
  const { id } = useLocalSearchParams();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [image, setImage] = useState("");
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const url = `https://wildeye-cam-default-rtdb.firebaseio.com/users/${auth.currentUser?.uid}.json`;

  useEffect(() => {
    getUser();
    getPosts();
  }, [id]);

  async function getUser() {
    const response = await fetch(url);
    const userData = await response.json();

    if (userData) {
      setName(userData?.name);
      setMail(userData?.email);
      setImage(userData?.image);
      setUser(userData);
    }
  }

  async function getPosts() {
    const response = await fetch(
      `https://wildeye-cam-default-rtdb.firebaseio.com/posts.json?orderBy="uid"&equalTo="${auth.currentUser?.uid}"`
    );
    const data = await response.json();
    const arrayOfPosts = Object.keys(data).map((key) => {
      return {
        id: key,
        ...data[key],
      };
    });
    arrayOfPosts.sort((postA, postB) => postB.createdAt - postA.createdAt);
    setPosts(arrayOfPosts);
    console.log(arrayOfPosts);
  }

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/sign-in");
  }

  async function chooseImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      quality: 0.3,
    });

    if (!result.canceled) {
      const base64 = "data:image/jpeg;base64," + result.assets[0].base64;
      setImage(base64);
    }
  }

  async function toggleEditMode() {
    setEditMode(true);
    console.log(editMode);
  }

  async function handleSaveUser() {
    const userToUpdate = { name: name, mail: mail, image };

    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(userToUpdate),
    });
    if (response.ok) {
      const data = await response.json();
      console.log("User data: ", data);
      setEditMode(false);
    }
  }

  function handleMailChange(event) {
    setMail(event.target.value);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await getPosts();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }
  const data = [{}];
  const renderItem = () => (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              style={styles.button}
              title="Sign Out"
              color={Platform.OS === "ios" ? tintColorLight : primary}
              onPress={handleSignOut}
            />
          ),
        }}
      />
      <View>
        <TouchableOpacity
          onPress={editMode ? chooseImage : null}
          style={styles.imageContainer}
        >
          <Image
            style={styles.image}
            source={{
              uri:
                image ||
                "https://cederdorff.com/race/images/placeholder-image.webp",
            }}
          />
        </TouchableOpacity>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={editMode ? styles.inputEdit : styles.input}
          onChangeText={setName}
          value={name}
          placeholder={editMode ? "Type your name" : ""}
          placeholderTextColor={placeholderTextColor}
          autoCapitalize="none"
          editable={editMode}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={editMode ? styles.inputEdit : styles.input}
          onChange={handleMailChange}
          value={auth.currentUser?.email}
          placeholder="Type your email"
          placeholderTextColor={placeholderTextColor}
          autoCapitalize="none"
          editable={editMode}
        />

        <View style={styles.buttonContainer}>
          {editMode ? (
            <StyledButton
              title="Save"
              style="primary"
              onPress={handleSaveUser}
            />
          ) : (
            <StyledButton
              title="Edit Profile"
              style="primary"
              onPress={toggleEditMode}
            />
          )}
        </View>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            reloadPosts={getPosts}
            showAvatar={false}
          />
        ))}
      </View>
    </>
  );

  return (
    <FlatList
      style={styles.container}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: secondary,
    paddingBottom: 50,
  },
  label: {
    fontSize: labelFontSize,
    color: primary,
    marginTop: 30,
    marginBottom: 5,
  },
  inputEdit: {
    height: 50,
    padding: 10,
    backgroundColor: tintColorLight,
    borderRadius: borderRadius,
    borderColor: primary,
    borderWidth: 2,
  },
  input: {
    height: 50,
    padding: 10,
    backgroundColor: tintColorLight,
    borderRadius: borderRadius,
    borderColor: "white",
    borderWidth: 2,
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: primary,
    borderRadius: 200,
    padding: 2,
    backgroundColor: tintColorLight,
  },
  image: {
    aspectRatio: 1,
    borderRadius: 200,
  },
  buttonContainer: {
    marginBottom: 50,
    marginTop: 20,
  },
  button: {
    paddingRight: 10,
  },
});
