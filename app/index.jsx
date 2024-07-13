import { useEffect } from "react";
import { useRouter } from "expo-router";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const RedirectToMap = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (!user) {
          router.dismissAll();
          router.replace("/sign-in");
        } else {
          router.replace("/scan");
        }
      }, 100);
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default RedirectToMap;
