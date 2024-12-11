import React, { useState } from 'react'; // Importerer React og useState hook
import { View, TextInput, StyleSheet, Text, Button } from 'react-native'; // Importerer nødvendige komponenter fra React Native
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Importerer Firebase autentificeringsfunktioner
import { Image } from 'react-native';
import Colors from '../constants/Colors';
import BlueButton from '../components/BlueButton';

/**
 * LoginScreen er en skærm, der giver brugeren mulighed for at logge ind.
 * Skærmen indeholder inputfelter til email og adgangskode.
 * Når brugeren trykker på knappen "Login", forsøges der at logge brugeren ind.
 */

const LoginScreen = ({ navigation }) => {
  // State til at holde email, adgangskode og eventuelle fejlmeddelelser
  const [email, setEmail] = useState(''); // State til email
  const [password, setPassword] = useState(''); // State til adgangskode
  const [error, setError] = useState(null); // State til fejlmeddelelser

  // Funktion til at håndtere login
  const handleLogin = () => {
    const auth = getAuth(); // Henter autentificeringsinstansen
    signInWithEmailAndPassword(auth, email, password) // Forsøger at logge brugeren ind
      .then((userCredential) => {
        console.log("User logged in successfully!"); // Log meddelelse ved succesfuld login
      })
      .catch((error) => {
        setError(error.message); // Sætter fejlmeddelelsen, hvis login fejler
      });
  };

  return (
    <View style={styles.container}> 
      <Image source={require('../assets/login.png')} style={{width: 300, height: 300}} />
      <Text style={styles.title}>Sign in</Text>
      <TextInput
        placeholder="Email" // Pladsholder tekst for email-input
        value={email} // Værdi af email-input
        onChangeText={setEmail} // Opdaterer email state ved ændringer
        style={styles.input} // Anvender stil til inputfeltet
      />
      <TextInput
        placeholder="Password" // Pladsholder tekst for adgangskode-input
        value={password} // Værdi af adgangskode-input
        onChangeText={setPassword} // Opdaterer adgangskode state ved ændringer
        secureTextEntry // Gør, at adgangskoden vises som prikker
        style={styles.input} // Anvender stil til inputfeltet
      />
      <BlueButton text="Login" action={handleLogin} />
      {error && <Text style={styles.error}>{error}</Text>} 
      <View style={styles.spacing} />
      <Text style={{textAlign: 'center'}}>Don't have an account?</Text>
      <Button title="Sign up" onPress={() => navigation.navigate('Signup')} /> 
    </View>
  );
};

// Styling af komponenter
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: Colors.primary, // Lys blå baggrund for en blødere effekt
      justifyContent: 'center', // Centrere indholdet
    },
    title: {
      fontSize: 36, // Større skriftstørrelse for titlen
      fontWeight: 'bold', // Fed skrift
      marginBottom: 30, // Plads under titlen
      textAlign: 'left', // Centrerer titlen
    },
    input: {
      height: 40, // Højere inputfelter for bedre brugervenlighed
      borderColor: 'lightgray', // Borderfarve
      borderWidth: 1, // Borderbredde
      borderRadius: 10, // Rundede hjørner
      marginBottom: 20, // Afstand under inputfeltet
      paddingHorizontal: 15, // Indvendig afstand til venstre og højre
      backgroundColor: '#fff', // Hvid baggrund for inputfelterne
    },
    error: {
      color: 'red', // Rød farve til fejlmeddelelser
      marginTop: 10, // Plads over fejlmeddelelser
      textAlign: 'center', // Centrerer fejlmeddelelsen
    },
    spacing: {
      height: 20, // Justerbar afstand mellem knapper
    },
  });

// Eksporterer LoginScreen komponenten
export default LoginScreen;
