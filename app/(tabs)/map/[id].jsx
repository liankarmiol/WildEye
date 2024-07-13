import Post from "@/components/Post";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { useState, useEffect } from "react";

export default function MapDetail() {
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    getPost();
  }, [id]);

  async function getPost() {
    const response = await fetch(
      `https://wildeye-cam-default-rtdb.firebaseio.com/posts/${id}.json`
    );
    const data = await response.json();
    data.id = id;
    setPost(data);
  }

  return (
    <ScrollView>
      <Stack.Screen options={{ title: post?.caption, title: "Information" }} />
      <Post post={post} showAvatar={true} />
    </ScrollView>
  );
}
