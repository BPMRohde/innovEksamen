import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';

import ActivityCard from '../components/ActivityCard';

/**
 * Dette er en skærm, der viser en liste over alle aktiviteter.
 * Skærmen henter aktiviteter fra databasen og viser dem som ActivityCards.
 * ActivityCards er klikbare og navigerer brugeren til View_marker med aktiviteten som prop.
 */

const ActivitiesScreen = () => {
  const [activities, setActivities] = useState([]); // State til at holde aktiviteter

  useEffect(() => {
    // Hent markører fra Firebase Realtime Database
    const db = getDatabase();
    // Referer til markører i databasen
    const activitiesRef = ref(db, 'Cities/Copenhagen/Markers');

    // Lyt til ændringer i markører og opdater state
    const unsubscribe = onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Konverter data til et array af objekter
        const activitiesArray = Object.keys(data).map((key) => ({
          ...data[key],
          id: key, // Gem ID i objektet
        }));
        setActivities(activitiesArray);
      } else {
        setActivities([]); // Sæt aktiviteter til et tomt array hvis der ikke er nogen data.
      }
    });

    // Ryder op efter komponenten, når den unmountes
    return () => {
      off(activitiesRef);
    };
  }, []); // Ved at angive et tomt array som afhængighed, kører effekten kun ved mount og unmount

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}
      >
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles for ActivitiesScreen
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20, 
    width: '95%',
  },
});

export default ActivitiesScreen;
