import { Text, View, StyleSheet, SafeAreaView, ScrollView, Image} from 'react-native';
import {useEffect, useState} from "react"; 
import Colors from '../constants/Colors';
import RatingCard from '../components/RatingCard';

/**
 * View_marker er en skærm, der viser information om en aktivitet.
 * Skærmen modtager en aktivitet som prop og viser information om aktiviteten.
 * Skærmen indeholder et billede, titel, type, beskrivelse, pris og rating.
 */

const View_marker = ({route}) => {
    const [marker, setMarker] = useState('');

    useEffect(() => {
        setMarker(route.params.marker);

        /*Fjern data, når vi går væk fra screenen*/
        return () => {
            setMarker('');
        }
    },[route.params.marker]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {marker === '' ? 
                (<Text>Loading...</Text>) :
                (<View style={styles.card}>
                    <View style={{width:'100%', marginBottom: 10}}>
                        <Image source={require('../assets/tivoli.jpg')} style={{width:'100%', height: 250}} />
                        <Text style={[styles.text, {position: 'absolute', bottom: 20, left: 20, paddingVertical:10, paddingHorizontal:20, backgroundColor: 'lightgreen', borderRadius: 15,}]}>{marker.cost}</Text>
                        <RatingCard rating={marker.rating}/>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.text}>{marker.title}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.text}>{marker.type}</Text>
                    </View>
                    <View style={styles.section}>
                        <Text style={[styles.text, {minHeight: 200}]}>{marker.description}</Text>
                    </View>
                </View>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
    card: {
        alignItems: 'center',
    },
    section: {
        backgroundColor: 'white',
        width: '90%',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        borderRadius: 15,
        marginBottom: 20,
        padding: 10,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20, // Optional, adds padding to the bottom of the scrollview for better touchability
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
})

export default View_marker; 