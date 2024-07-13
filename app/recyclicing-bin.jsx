async function handleUpdatePost() {
  const post = {
    caption: caption,
    image: image,
  };
  const response = await fetch(
    `https://wildeye-cam-default-rtdb.firebaseio.com/posts/${id}.json`,
    // `https://wildeye-cam-default-rtdb.firebaseio.com/posts/${id}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(post),
    }
  );
  if (response.ok) {
    router.back();
  }
}

async function handleCreatePost() {
  const createdAt = new Date().getTime();
  const post = {
    caption: caption,
    image: image,
    createdAt: createdAt,
    location: location,
    uid: auth.currentUser.uid,
  };
  const response = await fetch(
    "https://wildeye-cam-default-rtdb.firebaseio.com/posts.json",
    {
      method: "POST",
      body: JSON.stringify(post),
    }
  );
  if (response.ok) {
    router.back();
  }
}

function handleSave() {
  if (id) {
    handleUpdatePost();
  } else {
    handleCreatePost();
  }
}
