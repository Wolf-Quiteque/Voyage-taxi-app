import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import axios from 'axios';
import * as Location from 'expo-location';


const GOOGLE_PLACES_API_KEY = "AIzaSyAbKqp4cMvQO-8uDtqC7KoYslkB4uB3dLs"


const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 30;

const HomeScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [location, setLocation] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchPlaces(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const fetchPlaces = async (latitude, longitude, pageToken = null) => {
    if (loading) return;
    setLoading(true);

    try {
      const types = ['restaurant', 'lodging', 'shopping_mall'];
      let newPlaces = [];

      for (const type of types) {
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
        
        if (pageToken) {
          url += `&pagetoken=${pageToken}`;
        }

        const response = await axios.get(url);
        newPlaces.push(...response.data.results);

        if (response.data.next_page_token) {
          setNextPageToken(response.data.next_page_token);
        } else {
          setNextPageToken(null);
        }
      }

      setPlaces(prevPlaces => [...prevPlaces, ...newPlaces]);
    } catch (error) {
      console.error('Error fetching places:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePlaces = () => {
    if (nextPageToken && !loading) {
      fetchPlaces(location.coords.latitude, location.coords.longitude, nextPageToken);
    }
  };

  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {item.photos && item.photos.length > 0 ? (
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}`,
          }}
          style={styles.cardImage}
        />
      ) : (
        <View style={[styles.cardImage, styles.noImage]}>
          <Text style={styles.noImageText}>No Image Available</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.vicinity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Explore nearby places</Text>
      </View>

      <FlatList
        data={places}
        renderItem={renderPlaceCard}
        keyExtractor={(item) => item.place_id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        onEndReached={loadMorePlaces}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />

      <BlurView intensity={80} tint="light" style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Icon name="calendar-clock" size={24} color={colors.primary} />
          <Text style={styles.navButtonText}>Schedule Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navButton, styles.primaryButton]}>
          <Icon name="car" size={24} color={colors.background} />
          <Text style={[styles.navButtonText, styles.primaryButtonText]}>Voyage Now</Text>
        </TouchableOpacity>
      </BlurView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text,
    marginTop: 5,
  },
  gridContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.background,
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 7.5,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  noImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '33',
  },
  noImageText: {
    color: colors.text + '99',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.text + '99',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: 'rgba(200, 200, 200, 0.8)', // Light grey color
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    width: '40%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  navButtonText: {
    color: colors.primary,
    marginTop: 5,
    fontWeight: 'bold',
  },
  primaryButtonText: {
    color: colors.background,
  },
    loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});

export default HomeScreen;