import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

// InputComponent tager props til håndtering af beskeder og billeder
const InputComponent = ({ newMessage, onChangeMessage, onSendMessage, onSendImage }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Skriv en besked..."
        value={newMessage}          // Viser den aktuelle besked
        onChangeText={onChangeMessage} // Opdaterer beskeden ved ændring
      />
      <TouchableOpacity style={styles.button} onPress={onSendMessage}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onSendImage}>
        <Text style={styles.buttonText}>Tag billede</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default InputComponent;
