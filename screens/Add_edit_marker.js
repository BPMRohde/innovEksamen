import { Text, View, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import {useEffect, useState} from "react"; 
import { getDatabase, ref, push, update  } from "firebase/database";
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import BlueButton from '../components/BlueButton';
import {Picker} from '@react-native-picker/picker';
import CostSelect from '../components/CostSelect';
import ImagePickerExample from '../components/ImagePicker';

const Add_edit_marker = ({navigation, route}) => {
    const db = getDatabase();
    const initialState = {
        latlng: {
            latitude: 0,
            longitude: 0
        },
        title: '',
        type: '',
        rating: 0,
        description: '',
        address: '',
        cost: '',
    }

    const [newMarker, setNewMarker] = useState(initialState);

    useEffect(() => {
        return () => {
            setNewMarker(initialState);
        }
    },[]);

    const changeTextInput = (key, value) => {
        setNewMarker({...newMarker, [key]: value});
    };

    //Denne funktion bruges til at omdanne en adresse til koordinater.
    const geoCode = async () => {
        const geocodedLocation = await Location.geocodeAsync(newMarker.address);
        console.log('Geocoded location:', geocodedLocation);
    
        if (geocodedLocation.length > 0) {
            const { latitude, longitude } = geocodedLocation[0];
            return { latitude, longitude }; // Return new coordinates
        } else {
            Alert.alert('Address not found');
            return null; // Indicate failure
        }
    };
    
    
    //Denne funktion bruges til at gemme en markør
    const saveMarker = async () => {
        const {title, type, description, address, rating, cost} = newMarker;
        if (title === '' || type === '' || description === ''|| address === '') {
            Alert.alert('Please fill out all fields');
            return;
        }

        //Her geoCoder vi adressen til latlng
        const newLatLng = await geoCode(); // Get new coordinates
        if (!newLatLng) {
            Alert.alert('Address not found');
            return;
        }

        const { latitude, longitude } = newLatLng;

        // Marker opdateres med de nyfundne koordinater
        setNewMarker((prev) => ({
            ...prev,
            latlng: { latitude, longitude }
        }));

        // Hvis der ikke er fundet koordinater, må adressen være ugyldig
        if (latitude === 0 && longitude === 0) {
            Alert.alert('Address not found');
            return;
        }
        
        const markerRef = ref(db, 'Cities/Copenhagen/Markers');

        const newMarkerRef = {
            title,
            type,
            description,
            latlng: {latitude, longitude},
            address,
            rating,
            cost,
        };

        await push(markerRef, newMarkerRef)
            .then(() => {
                Alert.alert('Marker added');
                setNewMarker(initialState);
            })
            .catch((error) => {
                Alert.alert('Error adding marker', error.message);
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.card}>
                    <Text style={{font: 'bold', fontSize: 30, marginBottom: 10}}>Write Review</Text>
                    <ImagePickerExample />
                    <TextInput style={styles.input} value={newMarker.title} placeholder='Title' onChangeText={(e) => changeTextInput('title',e)}></TextInput>
                    
                    <Picker
                    style={{width: '100%'}}
                    onValueChange={(itemValue, itemIndex) =>
                        changeTextInput('type',itemValue)
                    }
                    selectedValue={newMarker.type}
                    >
                        <Picker.Item label="Restaurant" value="Restaurant" />
                        <Picker.Item label="Club" value="Club" />
                        <Picker.Item label="Bar" value="Bar" />
                        <Picker.Item label="Cafe" value="Cafe" />
                        <Picker.Item label="Activity" value="Activity" />
                        <Picker.Item label="Tourist attraction" value="Tourist Attraction" />
                        <Picker.Item label="Other" value="Other" />
                    </Picker>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={newMarker.rating}
                        maxLength={2} // To prevent entering numbers beyond 99
                        placeholder="Rating 1-10"
                        onChangeText={(e) => changeTextInput('rating',e)}
                    />
                    <TextInput style={[styles.input]} placeholder='Write Address' value={newMarker.address} onChangeText={(e) => changeTextInput('address',e)}></TextInput>
                    <CostSelect action={changeTextInput} />
                    <TextInput 
                        style={[styles.input, {height: 100}]} 
                        placeholder='Write review here...' 
                        value={newMarker.description} 
                        onChangeText={(e) => changeTextInput('description',e)} 
                        multiline 
                    />
                    <BlueButton text="Save marker" action={saveMarker} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
    },
    scrollViewContent: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 20, // Optional, adds padding to the bottom of the scrollview for better touchability
    },
    input: {
        height: 40, // Højere inputfelter for bedre brugervenlighed
        width: '100%',
        borderColor: 'lightgray', // Borderfarve
        borderWidth: 1, // Borderbredde
        borderRadius: 10, // Rundede hjørner
        marginBottom: 20, // Afstand under inputfeltet
        paddingHorizontal: 15, // Indvendig afstand til venstre og højre
        backgroundColor: '#fff', // Hvid baggrund for inputfelterne
    },
    label: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    card: {
        width: '90%',
        padding: 20,
        margin: 0,
        borderRadius: 10,
        alignItems: 'center',
    },
    section: {
        marginBottom: 20,
        width: '100%',
    },
    picker: {
        flex: 1,
    },
})

export default Add_edit_marker; 
