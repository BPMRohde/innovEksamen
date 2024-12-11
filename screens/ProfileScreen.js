import React, { useState, useEffect } from 'react'; // Importer React og hooks til state og effekt
import { View, Text, Button, StyleSheet } from 'react-native'; // Importer nødvendige komponenter fra react-native
import { getDatabase, ref, onValue } from 'firebase/database'; // Importer Firebase database funktioner
import { getAuth, signOut } from 'firebase/auth'; // Importer Firebase autentificering funktioner

/**
 * ProfileScreen er en skærm, der viser brugerens profiloplysninger.
 * Skærmen henter brugerdata fra Firebase og viser brugernavn, point og badges.
 * Brugeren har mulighed for at logge ud.
 */
const ProfileScreen = () => {
  const [userData, setUserData] = useState({}); // State til at holde brugerdata
  const auth = getAuth(); // Hent autentificeringsinstansen
  const currentUser = auth.currentUser; // Hent den nuværende bruger

  // useEffect hook til at hente brugerdata fra Firebase
  useEffect(() => {
    if (currentUser) { // Kontroller om der er en nuværende bruger
      const db = getDatabase(); // Hent databasen
      const userRef = ref(db, 'users/' + currentUser.uid); // Referer til den specifikke brugers data

      // Lyt til ændringer i brugerens data
      onValue(userRef, (snapshot) => {
        const data = snapshot.val(); // Hent data fra snapshot
        if (data) {
          setUserData(data); // Opdater state med brugerdata
        }
      });
    }
  }, [currentUser]); // Afhængighed: kør effekten igen når currentUser ændres

  // Funktion til at håndtere logout
  const handleLogout = () => {
    signOut(auth).then(() => { // Forsøg at logge brugeren ud
      console.log('User logged out'); // Log besked ved succesfuld logout
    }).catch((error) => { // Håndter eventuelle fejl ved logout
      console.error('Error logging out: ', error); // Log fejlmeddelelse
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Brugernavn: {userData.username}</Text>
      <Text style={styles.points}>Review Points: {userData.reviewPoints || 0}</Text>
      <Text style={styles.badges}>Badges: {userData.badges ? userData.badges.join(", ") : 'Ingen badges'}</Text>
      <Button title="Log ud" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Padding omkring hele containeren
    backgroundColor: '#f8f8f8', // Lys grå baggrundsfarve
    justifyContent: 'center', // Centrere indholdet
  },
  username: {
    fontSize: 20, // Størrelse på brugernavnet
    fontWeight: 'bold', // Gør teksten fed
    marginBottom: 10, // Margin under brugernavnet
  },
  points: {
    fontSize: 18, // Størrelse på point
    marginBottom: 10, // Margin under point
  },
  badges: {
    fontSize: 16, // Størrelse på badges
    marginBottom: 20, // Margin under badges
  },
});

// Eksporterer ProfileScreen komponenten
export default ProfileScreen;
