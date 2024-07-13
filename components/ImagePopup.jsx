import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { primary } from "../constants/ThemeVariables";

export default function ImagePopup({ image, modalVisible, closePopup }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closePopup}
    >
      <View style={styles.modalView}>
        <Image source={{ uri: image }} style={styles.fullImage} />
        <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    marginTop: 200,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fullImage: {
    width: "100%",
    height: 400,
    objectFit: "contain",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: primary,

    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
