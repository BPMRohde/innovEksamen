import React, { useState } from 'react'; // Importér React og useState hook
import { View, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native'; // Importér nødvendige komponenter fra react-native

const ForumScreen = () => {
  // Definerer state til at kontrollere, om de to modals er synlige
  const [firstModalVisible, setFirstModalVisible] = useState(false); // Til første billede/modal
  const [secondModalVisible, setSecondModalVisible] = useState(false); // Til andet billede/modal

  return (
    <View style={styles.container}>
      {/* Første billede der kan trykkes på for at åbne modal */}
      <TouchableOpacity onPress={() => setFirstModalVisible(true)}>
        {/* Billede der vises i Forum */}
        <Image source={require('../assets/images/forum_mockup.jpg')} style={styles.image} />
      </TouchableOpacity>

      {/* Modal for første billede. Vises i fuld skærm når brugeren trykker på billedet */}
      <Modal
        visible={firstModalVisible} // Modal er synlig, hvis firstModalVisible er true
        animationType="slide" // Modal glider ind på skærmen
        onRequestClose={() => setFirstModalVisible(false)} // Lukker modal hvis brugeren beder om det
      >
        {/* Når modal er åben, kan brugeren trykke på den for at lukke */}
        <TouchableOpacity onPress={() => setFirstModalVisible(false)} style={styles.fullscreenModal}>
          {/* Billedet der vises i modal */}
          <Image
            source={require('../assets/images/forum_mockup.jpg')}
            style={styles.fullImage}
          />
        </TouchableOpacity>
      </Modal>

      {/* Andet billede der kan trykkes på for at åbne anden modal */}
      <TouchableOpacity onPress={() => setSecondModalVisible(true)}>
        {/* Andet billede der vises i Forum */}
        <Image source={require('../assets/images/forum_chat_mockup.jpg')} style={styles.image} />
      </TouchableOpacity>

      {/* Modal for andet billede */}
      <Modal
        visible={secondModalVisible} // Modal er synlig, hvis secondModalVisible er true
        animationType="slide" // Modal glider ind på skærmen
        onRequestClose={() => setSecondModalVisible(false)} // Lukker modal ved brugeranmodning
      >
        {/* Når modal er åben, kan brugeren trykke for at lukke */}
        <TouchableOpacity onPress={() => setSecondModalVisible(false)} style={styles.fullscreenModal}>
          {/* Andet billede der vises i modal */}
          <Image
            source={require('../assets/images/forum_chat_mockup.jpg')}
            style={styles.fullImage}
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fylder hele skærmen
    justifyContent: 'center', // Centrerer indholdet lodret
    alignItems: 'center', // Centrerer indholdet vandret
  },
  image: {
    width: 300, // Fast bredde til billederne
    height: 200, // Fast højde til billederne
    margin: 10, // Lidt margin mellem billederne
    resizeMode: 'contain', // Sørger for at billedet ikke strækkes uden for proportion
  },
  fullscreenModal: {
    flex: 1, // Modal fylder hele skærmen
    backgroundColor: 'black', // Baggrundsfarve til modalen, for at billedet skiller sig ud
  },
  fullImage: {
    width: '100%', // Billedet fylder hele modalens bredde
    height: '100%', // Billedet fylder hele modalens højde
    resizeMode: 'contain', // Sørger for at billedet passer uden forvrængning
  },
});

export default ForumScreen;
