import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width, height } = Dimensions.get('window');
const GOOGLE_PLACES_API_KEY = "AIzaSyAbKqp4cMvQO-8uDtqC7KoYslkB4uB3dLs"


const MapScreen = ({ navigation }) => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const currentRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };

      setPickupLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setRegion(currentRegion);
    })();
  }, []);

  const handleLocationSelect = (details, isPickup) => {
    const location = {
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
    };

    if (isPickup) {
      setPickupLocation(location);
    } else {
      setDropoffLocation(location);
    }
  };

  const handleConfirm = () => {
    navigation.navigate('HomeScreen', { pickupLocation, dropoffLocation });
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
        >
          {pickupLocation && <Marker coordinate={pickupLocation} title="Pickup Location" />}
          {dropoffLocation && <Marker coordinate={dropoffLocation} title="Dropoff Location" />}
        </MapView>
      )}

      <GooglePlacesAutocomplete
        placeholder="Search Pickup Location"
        fetchDetails
        onPress={(data, details = null) => {
          handleLocationSelect(details, true);
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        styles={styles.autocomplete}
      />

      <GooglePlacesAutocomplete
        placeholder="Search Dropoff Location"
        fetchDetails
        onPress={(data, details = null) => {
          handleLocationSelect(details, false);
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
        styles={[styles.autocomplete, { top: 110 }]}
      />

      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>Confirm Locations</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height * 0.6,
  },
  autocomplete: {
    container: {
      position: 'absolute',
      width: '90%',
      top: 20,
      left: '5%',
    },
    textInputContainer: {
      backgroundColor: '#fff',
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    textInput: {
      height: 38,
      color: '#5d5d5d',
      fontSize: 16,
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: '5%',
    right: '5%',
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;