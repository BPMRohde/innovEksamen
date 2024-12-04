import React, { useState } from 'react'; // Importér React og useState hook
import { View, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native'; // Importér nødvendige komponenter fra react-native

// ActivitiesScreen funktionel komponent
const ActivitiesScreen = () => {
  // State variabel til at styre synligheden af modalvinduet
  const [modalVisible, setModalVisible] = useState(false); // Initialiserer modalVisible til false

  return (
    // Hovedcontainer for ActivitiesScreen
    <View style={styles.container}>
      {/* TouchableOpacity for at åbne modalvinduet ved tryk */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {/* Viser aktivitetsmockup billedet */}
        <Image source={require('../assets/images/activities_mockup.jpg')} style={styles.image} />
      </TouchableOpacity>

      {/* Modal for at vise billedet i fuldskærm */}
      <Modal
        visible={modalVisible} // Bind modalens synlighed til state variablen modalVisible
        animationType="slide" // Animationstype når modalvinduet åbnes
        onRequestClose={() => setModalVisible(false)} // Håndter lukning af modalvinduet
      >
        {/* TouchableOpacity for at lukke modalvinduet ved tryk */}
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.fullscreenModal}>
          {/* Viser aktivitetsmockup billedet i fuldskærm */}
          <Image
            source={require('../assets/images/activities_mockup.jpg')}
            style={styles.fullImage} // Anvendelse af stil til fuldskærmsbilledet
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Stile for ActivitiesScreen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Giver containeren mulighed for at fylde den tilgængelige plads
    justifyContent: 'center', // Centrerer indholdet vertikalt
    alignItems: 'center', // Centrerer indholdet horisontalt
  },
  image: {
    width: 300, // Sætter bredden på billedet
    height: 200, // Sætter højden på billedet
    resizeMode: 'contain', // Bevarer billedets aspektsforhold inden for de angivne dimensioner
  },
  fullscreenModal: {
    flex: 1, // Giver modalvinduet mulighed for at fylde hele skærmen
    backgroundColor: 'black', // Sætter en sort baggrund for modalvinduet
  },
  fullImage: {
    width: '100%', // Sætter bredden på det fulde billede til 100% af skærmen
    height: '100%', // Sætter højden på det fulde billede til 100% af skærmen
    resizeMode: 'contain', // Bevarer billedets aspektsforhold i fuldskærm
  },
});

// Eksportér ActivitiesScreen komponenten
export default ActivitiesScreen;
