import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// MessageComponent viser enten en tekstbesked eller et billede (eller begge dele), baseret på de props der sendes ind.
const MessageComponent = ({ text, image }) => {
  return (
    <View style={styles.messageContainer}>
      {image && (                   // Viser billede, hvis image-prop er tilgængelig
        <Image source={{ uri: image }} style={styles.image} />
      )}
      {text && (                    // Viser tekst, hvis text-prop er tilgængelig
        <Text>{text}</Text>
      )}
    </View>
  );
};

// Styles til layout af besked og billede
const styles = StyleSheet.create({
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,            
    borderBottomColor: '#ddd'
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 5,
    borderRadius: 10,                
  }
});

export default MessageComponent;
