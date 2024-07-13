import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { primary, secondary, tintColorLight } from "@/constants/ThemeVariables";
import Avatar from "@/components/Avatar";
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { router } from "expo-router";
import ImagePopup from "./ImagePopup";

export default function Post({ post, reloadPosts, showAvatar }) {
  const { showActionSheetWithOptions } = useActionSheet();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // const encodedUri = post.scanImage;
  // const decodedUri = decodeURIComponent(encodedUri);
  // console.log(decodedUri);

  function getDate(timestamp) {
    const myDate = new Date(timestamp);
    return myDate.toLocaleDateString();
  }

  function showEditMenu() {
    const options = ["Delete Post", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
        title: "Delete Post?",
        message: "Do you want to delete this post",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          showDeleteDialogue();
        } else if (buttonIndex === 1) {
        }
      }
    );
  }

  function showDeleteDialogue() {
    Alert.alert(
      "Delete Post",
      `Do you want to delete post '${post.caption}'?`,
      [
        {
          text: "No",
          style: "destructive",
        },
        { text: "Yes", onPress: deletePost },
      ]
    );
  }

  async function deletePost() {
    const response = await fetch(
      `https://wildeye-cam-default-rtdb.firebaseio.com/posts/${post.id}.json`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      console.log("post successfully deleted");
      reloadPosts();
    }
  }

  function openImageModal(imageUri) {
    setCurrentImage(imageUri);
    setModalVisible(true);
  }

  return (
    <View style={styles.postContainer}>
      <View style={styles.headerContainer}>
        {showAvatar ? (
          <Avatar uid={post.uid} />
        ) : (
          <>
            <Text style={styles.title}>{post.title}</Text>
            <TouchableOpacity style={styles.dots} onPress={showEditMenu}>
              <Ionicons name="ellipsis-horizontal" size={28} color={primary} />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.imageWrapper}
            // onPress={() => openImageModal(post.scanImage)}
            onPress={() => openImageModal(decodeURIComponent(post.scanImage))}
          >
            <Image
              style={styles.image}
              source={{
                // uri: decodedUri,
                uri: decodeURIComponent(post.scanImage),
                // uri: post.scanImage,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageWrapper}
            onPress={() => openImageModal(post.wikiImage)}
          >
            <Image
              style={styles.image}
              source={{
                uri: post.wikiImage,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {showAvatar && <Text style={styles.title}>{post.title}</Text>}
      <Text style={styles.city}>
        {post.location?.city}, {post.location?.country}
      </Text>
      <Text style={styles.summary}>{post.summary}</Text>
      {!showAvatar && (
        <Text style={styles.date}>{getDate(post.createdAt)}</Text>
      )}
      <ImagePopup
        image={currentImage}
        modalVisible={modalVisible}
        closePopup={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    flex: 2,
    minHeight: 320,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: tintColorLight,
    borderColor: "tan",
    marginBottom: 30,
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  title: {
    fontSize: 22,
    padding: 15,
  },
  summary: {
    fontSize: 14,
    padding: 15,
  },
  date: {
    fontSize: 15,
    paddingHorizontal: 15,
  },
  city: {
    fontSize: 15,
    padding: 15,
    paddingBottom: 15,
  },
  imageWrapper: {
    flex: 1,
    aspectRatio: 1,
  },
  image: {
    aspectRatio: 1,
    width: "100%",
    height: "100%",
  },
  dots: {
    flex: 1,
    alignItems: "flex-end",
    margin: 10,
  },
});
