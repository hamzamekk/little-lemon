import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const { navigate } = useNavigation();

  const signIn = () => {
    const user = {
      firstName,
      email,
    };

    try {
      AsyncStorage.setItem("@user", JSON.stringify(user));
      AsyncStorage.setItem("@isOnboardingCompleted", JSON.stringify(true));

      navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/Logo.png")}
          resizeMethod={"scale"}
          resizeMode={"cover"}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputsContainer}
      >
        <Text style={styles.topText}>Let us get you know</Text>
        <View>
          <Text style={styles.inputLabel}>First name</Text>
          <TextInput
            style={styles.textInput}
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType={"email-address"}
          />
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttom}>
        <TouchableOpacity
          style={styles.buttonContainer}
          disabled={!firstName && !email}
          onPress={signIn}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: "15%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#iDEE3E8",
  },
  inputsContainer: {
    flex: 1,
    backgroundColor: "#CBD2D8",
    paddingVertical: "10%",
    justifyContent: "space-between",
  },
  topText: {
    fontSize: 30,
    textAlign: "center",
  },
  inputLabel: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    height: 40,
    marginBottom: 20,
    marginHorizontal: "10%",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  buttom: {
    height: "15%",
    backgroundColor: "#F1F4F7",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: "10%",
  },
  buttonContainer: {
    backgroundColor: "#CBD2D8",
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
  },
});
