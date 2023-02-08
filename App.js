import OnboardingScreen from "./Screens/Onboarding";
import ProfileScreen from "./Screens/Profile";
import HomeScreen from "./Screens/Home";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [fontsLoaded] = useFonts({
    Karla: require("./assets/Fonts/Karla-Regular.ttf"),
    markaz: require("./assets/Fonts/MarkaziText-Regular.ttf"),
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("@isOnboardingCompleted");
      if (value !== null) {
        // value previously stored
        setIsOnboardingCompleted(JSON.parse(value));
      }
    } catch (e) {
      // error reading value
    }
  };
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isOnboardingCompleted && fontsLoaded ? (
          // Onboarding completed, user is signed in
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          // User is NOT signed in
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
