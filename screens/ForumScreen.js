import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Button, Modal, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { db, storage } from '../components/firebaseconfig';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, query, orderBy, onSnapshot, ref, getDatabase } from 'firebase/database';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import MessageComponent from '../components/MessageComponent';
import InputComponent from '../components/InputComponent';
import PrivateMessagesScreen from './PrivateMessagesScreen';
import uuid from 'react-native-uuid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Importer MaterialIcons

const ForumHomeScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedForum, setSelectedForum] = useState('Denmark'); 
  const forums = ['Denmark', 'Thailand', 'France'];

  // Hent beskeder fra Firebase i realtid
  useEffect(() => {
    const db = getDatabase();
    const messagesRef = ref(db, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  // Send tekstbesked til Firebase
  const sendMessage = async () => {
    if (newMessage.trim().length > 0) {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        createdAt: new Date(),
        forum: selectedForum,
      });
      setNewMessage('');
    }
  };

  // Tag foto og upload til Firebase Storage
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Kameratilladelse er påkrævet');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      const uniqueId = uuid.v4();
      const imageRef = ref(storage, `images/${uniqueId}`);
      const img = await fetch(result.uri);
      const bytes = await img.blob();
  
      await uploadBytes(imageRef, bytes);
      const downloadURL = await getDownloadURL(imageRef);
  
      await addDoc(collection(db, 'messages'), {
        image: downloadURL,
        createdAt: new Date(),
        forum: selectedForum,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.forumTitle}>You are in: {selectedForum}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Choose Forum" onPress={() => setModalVisible(true)} />
        <TouchableOpacity style={styles.privateMessagesButton} onPress={() => navigation.navigate('PrivateMessages')}>
          <Text style={styles.privateMessagesText}>Private messages</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {forums.map((forum) => (
            <TouchableOpacity key={forum} onPress={() => {
              setSelectedForum(forum);
              setModalVisible(false);
            }}>
              <Text style={styles.forumOption}>{forum}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <FlatList
        data={messages.filter(message => message.forum === selectedForum)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageComponent text={item.text} image={item.image} />
        )}
      />
      <InputComponent
        newMessage={newMessage}
        onChangeMessage={setNewMessage}
        onSendMessage={sendMessage}
        onSendImage={takePhoto} 
        renderSendImageButton={() => (
          <TouchableOpacity onPress={takePhoto}>
            <MaterialIcons name="camera-alt" size={30} color="#000" /> {/* Ikon til at tage billede */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const Stack = createStackNavigator();

const ForumScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ForumHome" component={ForumHomeScreen} options={{ title: 'Forum' }} />
      <Stack.Screen name="PrivateMessages" component={PrivateMessagesScreen} options={{ title: 'Private Messages' }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  forumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  privateMessagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    paddingRight: 30,
  },
  privateMessagesText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  forumOption: {
    padding: 20,
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#007BFF',
    width: '80%',
    textAlign: 'center',
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default ForumScreen;
