import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  TextInput,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import axios from 'axios';
import * as Location from 'expo-location';
const GOOGLE_PLACES_API_KEY = "AIzaSyBnr2f82PpIKH20FNEtRei5iVUCXxozoNw"

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 30;

const HomeScreen = ({ navigation }) => {
  const [places, setPlaces] = useState([]);
  const [location, setLocation] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [date, setDate] = useState(new Date());
const [time, setTime] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
const [showTimePicker, setShowTimePicker] = useState(false);

const onChangeDate = (event, selectedDate) => {
  const currentDate = selectedDate || date;
  setShowDatePicker(false);
  setDate(currentDate);
};

const onChangeTime = (event, selectedTime) => {
  const currentTime = selectedTime || time;
  setShowTimePicker(false);
  setTime(currentTime);
};

  const animatedHeight = useRef(new Animated.Value(height * 0.15)).current;

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
        // Add a delay before setting the next page token
        setTimeout(() => {
          setNextPageToken(response.data.next_page_token);
        }, 2000); // 2 seconds delay
      } else {
        setNextPageToken(null);
      }
    }

    // Limit the number of new places to 12
    newPlaces = newPlaces.slice(0, 12);

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

  const handleScheduleRide = () => {
    setIsScheduling(true);
    Animated.timing(animatedHeight, {
      toValue: height * 0.7, // Adjust the height as needed
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const handleCancelSchedule = () => {
    setIsScheduling(false);
    Animated.timing(animatedHeight, {
      toValue: height * 0.15,
      duration: 500,
      useNativeDriver: false,
    }).start();
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

      <Animated.View style={[styles.bottomNav, { height: animatedHeight }]}>
        {isScheduling ? (
          <>
           <Text style={styles.scheduleTitle}>Schedule Ride</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
  <Text style={{ color: '#fff' }}>{date.toDateString()}</Text>
</TouchableOpacity>
{showDatePicker && (
  <DateTimePicker
    value={date}
    mode="date"
    display="default"
    onChange={onChangeDate}
  />
)}

<TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
  <Text style={{ color: '#fff' }}>{time.toLocaleTimeString()}</Text>
</TouchableOpacity>
{showTimePicker && (
  <DateTimePicker
    value={time}
    mode="time"
    display="default"
    onChange={onChangeTime}
  />
)}
            <TextInput style={styles.input} placeholder="Pick up / Drop-Off Location" placeholderTextColor="#fff" />
            <TouchableOpacity style={styles.scheduleButton}>
              <Text style={styles.scheduleButtonText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelSchedule} style={styles.cancelButton}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.navButton} onPress={handleScheduleRide}>
              <Icon name="calendar-clock" size={24} color={colors.primary} />
              <Text style={styles.navButtonText}>Schedule Ride</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.navButton, styles.primaryButton]}>
              <Icon name="car" size={24} color={colors.background} />
              <Text style={[styles.navButtonText, styles.primaryButtonText]}>Voyage Now</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
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
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
      width: '90%',
      marginVertical: 10,
      borderRadius: 50,
      backgroundColor: '#fff',
      flexDirection: 'row',
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        color: colors.text,
      },
      primaryButton: {
        backgroundColor: colors.primary,
      },
      primaryButtonText: {
        color: '#fff',
      },
      scheduleTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
      },
      input: {
        width: '90%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#333',
        marginVertical: 10,
        color: '#fff',
      },
      scheduleButton: {
        width: '90%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
        marginVertical: 10,
      },
      scheduleButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
      },
      cancelButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
      },
      loadingFooter: {
        paddingVertical: 20,
        borderTopWidth: 1,
        borderColor: '#CED0CE',
      },
    });
    
    export default HomeScreen;