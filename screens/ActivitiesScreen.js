import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, } from 'react-native';
import { getDatabase, ref, onValue, off } from 'firebase/database';

import ActivityCard from '../components/ActivityCard';

const ActivitiesScreen = () => {
  const [activities, setActivities] = useState([]); // State to hold activities

  useEffect(() => {
    // Fetch markers from the database
    const db = getDatabase();
    const activitiesRef = ref(db, 'Cities/Copenhagen/Markers');

    const unsubscribe = onValue(activitiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert the object from the database into an array of activities
        const activitiesArray = Object.keys(data).map((key) => ({
          ...data[key],
          id: key, // Include the key as an ID for each marker
        }));
        setActivities(activitiesArray);
      } else {
        setActivities([]); // Set an empty array if no data
      }
    });

    // Clean up the listener on component unmount
    return () => {
      off(activitiesRef);
    };
  }, []); // Empty dependency array ensures this runs only once

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
    flex: 1, // Allows the container to fill the available space
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
    width: '100%', // Full width
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20, // Optional, adds padding to the bottom of the scrollview for better touchability
    width: '95%', // Full width
  },
});

export default ActivitiesScreen;
