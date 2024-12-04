import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const BlueButton = ({ text, action }) => {
  return (
    <TouchableOpacity onPress={action} style={styles.button}>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>{text}</Text>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    button: {
      backgroundColor: Colors.buttonColor,
      padding: 10,
      borderRadius: 10,
      marginBottom: 20,
      width: '100%',
    },
  });
export default BlueButton;