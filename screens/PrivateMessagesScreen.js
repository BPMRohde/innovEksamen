import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Modal, TouchableOpacity, Text, TextInput, Button } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import MessageComponent from '../components/MessageComponent';
import InputComponent from '../components/InputComponent';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PrivateMessagesScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState('User1'); 
  const [newUserName, setNewUserName] = useState('');

  // Definere forskellige brugere
  const [users, setUsers] = useState(['User1', 'User2', 'User3']);

  // Hent beskeder fra Firebase i realtid
  useEffect(() => {
    const messagesRef = collection(db, 'privateMessages'); 
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

  // Send besked til Firebase
  const sendMessage = async () => {
    if (newMessage.trim().length > 0) {
      await addDoc(collection(db, 'privateMessages'), {
        text: newMessage,
        createdAt: new Date(),
        user: selectedUser, 
      });
      setNewMessage(''); 
    }
  };

  // Tilføj ny bruger
  const addUser = () => {
    if (newUserName.trim().length > 0 && !users.includes(newUserName)) {
      setUsers([...users, newUserName]); 
      setNewUserName(''); 
      setAddUserModalVisible(false); 
    } else {
      alert('Indtast venligst et gyldigt brugernavn eller brugeren findes allerede.');
    }
  };

  // Slet bruger
  const deleteUser = (userToDelete) => {
    setUsers(users.filter(user => user !== userToDelete));
    if (selectedUser === userToDelete) {
      setSelectedUser(users[0]); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.selectUserButton} onPress={() => setModalVisible(true)}>
          <Icon name="person" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddUserModalVisible(true)}>
          <Text style={styles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Du skriver til: {selectedUser}</Text>

      {/* Modal til at vælge bruger */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {users.map((user) => (
            <View key={user} style={styles.userContainer}>
              <TouchableOpacity onPress={() => {
                setSelectedUser(user);
                setModalVisible(false);
              }}>
                <Text style={styles.option}>{user}</Text>
              </TouchableOpacity>
              <Button title="Slet" onPress={() => deleteUser(user)} color="red" />
            </View>
          ))}
        </View>
      </Modal>

      {/* Modal til at tilføje bruger */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addUserModalVisible}
        onRequestClose={() => setAddUserModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Indtast brugernavn"
            value={newUserName}
            onChangeText={setNewUserName}
          />
          <Button title="Tilføj" onPress={addUser} />
          <Button title="Annuller" onPress={() => setAddUserModalVisible(false)} />
        </View>
      </Modal>

      <FlatList
        data={messages.filter(message => message.user === selectedUser)} 
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageComponent text={item.text} />}
      />
      <InputComponent
        newMessage={newMessage}
        onChangeMessage={setNewMessage}
        onSendMessage={sendMessage}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginVertical: 5,
  },
  option: {
    padding: 20,
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#007BFF',
    width: '100%',
    textAlign: 'center',
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#007BFF',
    borderRadius: 30,
    padding: 10,
    marginLeft: 10,
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  selectUserButton: {
    backgroundColor: '#007BFF',
    borderRadius: 30,
    padding: 10,
  },
});

export default PrivateMessagesScreen;
