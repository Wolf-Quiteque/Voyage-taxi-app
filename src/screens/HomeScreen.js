import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 30;

const API_KEY = 'AIzaSyAbKqp4cMvQO-8uDtqC7KoYslkB4uB3dLs';

const HomeScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const types = ['restaurant', 'lodging', 'shopping_mall'];
      const allPlaces = [];

      for (const type of types) {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.7128,-74.0060&radius=1500&type=${type}&key=${API_KEY}`
        );
        allPlaces.push(...response.data.results.slice(0, 2));
      }

      setPlaces(allPlaces);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=${API_KEY}` }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.vicinity}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://picsum.photos/id/1015/1000/1000' }}
      style={styles.backgroundImage}
    >
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Explore nearby places</Text>

        <FlatList
          data={places}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => item.place_id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />

        <BlurView style={styles.bottomNav} blurType="light" blurAmount={10}>
          <TouchableOpacity style={styles.navButton}>
            <Icon name="calendar-clock" size={24} color={colors.primary} />
            <Text style={styles.navButtonText}>Schedule Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, styles.primaryButton]}>
            <Icon name="car" size={24} color={colors.background} />
            <Text style={[styles.navButtonText, styles.primaryButtonText]}>Voyage Now</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.background,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    color: colors.background,
    marginBottom: 20,
  },
  gridContainer: {
    paddingBottom: 100,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.background,
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 10,
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
});

export default HomeScreen;