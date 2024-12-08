import React, { useState, useEffect } from 'react'; // Til brug af hooks som useState og useEffect
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getApps, initializeApp } from "firebase/app"; 
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import { Image } from 'react-native';
import Colors from './constants/Colors';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase authentication
import { getDatabase } from 'firebase/database'; // Firebase Realtime Database



//Her importeres vores screens
import Map from "./screens/map";
import Add_edit_marker from './screens/Add_edit_marker';
import View_marker from './screens/View_marker';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import ForumScreen from './screens/ForumScreen';


const firebaseConfig = {
  authDomain: "fir-test-b3f66.firebaseapp.com",
  databaseURL: "https://fir-test-b3f66-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-test-b3f66",
  storageBucket: "fir-test-b3f66.firebasestorage.app",
  messagingSenderId: "896839969752",
  appId: "1:896839969752:web:e655fe02166110def720ad",
  measurementId: "G-ELVNEG5Y1L"
};


if (getApps().length < 1) {
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  console.log("Firebase On!");
}


export default function App() {
  const [user, setUser] = useState(null); // Opretter en state variabel for brugerens login-status

  // Tjekker om brugeren er logget ind
  useEffect(() => {
    const auth = getAuth(); // Henter Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { // Lyt efter ændringer i brugerens login-status
      setUser(currentUser); // Opdater state med den aktuelle bruger
    });

    return unsubscribe; // Ryd op i listeneren når komponenten unmountes
  }, []);


  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  // Logged-Out Navigation
  const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={RegisterScreen} />
    </Stack.Navigator>
  );

  // Logged-In Navigation with Tabs
  const AppTabs = () => (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "black",
        tabBarActiveBackgroundColor: Colors.activeNavigation,
        tabBarInactiveBackgroundColor: Colors.primary,
      }}
    >
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/map.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Forum"
        component={ForumScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/chat.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/compas.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./assets/user.png')}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );

  // Stack for additional screens outside the Bottom Tabs
  const MainStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppTabs} />
      <Stack.Screen name="View_marker" component={View_marker} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
