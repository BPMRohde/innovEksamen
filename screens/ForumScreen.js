import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Button, Modal, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { getDatabase, ref, push, set, onValue, query, orderByChild } from 'firebase/database';
import { uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../components/firebaseconfig';
import * as ImagePicker from 'expo-image-picker';
import MessageComponent from '../components/MessageComponent';
import InputComponent from '../components/InputComponent';
import PrivateMessagesScreen from './PrivateMessagesScreen';
import uuid from 'react-native-uuid';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getAuth } from 'firebase/auth';
/**
 * ForumHomeScreen er en skærm, der viser en liste over beskeder i et forum.
 * Brugeren kan skifte forum og sende beskeder til det valgte forum.
 */

const ForumScreen = ({ navigation }) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [userData, setUserData] = useState({}); // State til at holde brugerdata
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedForum, setSelectedForum] = useState('Denmark');
  const forums = ['Denmark', 'Thailand', 'France'];

  // Hent beskeder fra Firebase i realtid
  useEffect(() => {
    const db = getDatabase();
    const messagesRef = query(ref(db, 'messages'), orderByChild('createdAt'));

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((childSnapshot) => {
        const message = { id: childSnapshot.key, ...childSnapshot.val() };
        messagesData.push(message);
      });
      setMessages(messagesData);
    });
    return () => unsubscribe();
  }, []);

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

  // Send tekstbesked til Firebase
  const sendMessage = async () => {
    if (newMessage.trim().length > 0) {
      const db = getDatabase();
      const messagesRef = ref(db, 'messages');
      const newMessageRef = push(messagesRef);

      await set(newMessageRef, {
        text: newMessage,
        createdAt: Date.now(),
        forum: selectedForum,
        user: userData.username,
      });

      setNewMessage('');
    }
  };
  /**
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

      const db = getDatabase();
      const messagesRef = ref(db, 'messages');
      const newMessageRef = push(messagesRef);

      await set(newMessageRef, {
        image: downloadURL,
        createdAt: Date.now(),
        forum: selectedForum,
      });
    }
  };
  */

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Button title={selectedForum} onPress={() => setModalVisible(true)} style={styles.forumTitle}/>
        <TouchableOpacity
          style={styles.privateMessagesButton}
          onPress={() => navigation.navigate('Private messages')}
        >
          <MaterialIcons name="chat" size={24} color="#fff" />
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
            <TouchableOpacity
              key={forum}
              onPress={() => {
                setSelectedForum(forum);
                setModalVisible(false);
              }}
            >
              <Text style={styles.forumOption}>{forum}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>

      <FlatList
        data={messages.filter((message) => message.forum === selectedForum)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageComponent text={item.text} messageUser={item.user} currentUser={userData.username} />
        )}
      />
      <InputComponent
        newMessage={newMessage}
        onChangeMessage={setNewMessage}
        onSendMessage={sendMessage}
        //onSendImage={takePhoto}
        renderSendImageButton={() => (
          <TouchableOpacity onPress={takePhoto}>
            <MaterialIcons name="camera-alt" size={30} color="#000" />
          </TouchableOpacity>
        )}
      />
    </View>
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
