import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../styles/colors';
import CustomButton from '../components/CustomButton';
import { saveUserInfo } from '../utils/storage';

const { width, height } = Dimensions.get('window');

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);

  const slideAnim = useRef(new Animated.Value(height)).current;

  const handleGetStarted = () => {
    setShowForm(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  };

  const handleSignUp = async () => {
    const userInfo = { name, email, phone, password };
    const success = await saveUserInfo(userInfo);
    if (success) {
      // Navigate to the next screen or show a success message
      console.log('Sign up successful!');
    } else {
      // Show an error message
      console.log('Sign up failed. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://picsum.photos/id/1015/1000/1000' }}
      style={styles.backgroundImage}
    >
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <Text style={styles.title}>Voyage</Text>
        <Text style={styles.subtitle}>Your journey begins here</Text>

        {!showForm && (
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedText}>Let's Get Started</Text>
          </TouchableOpacity>
        )}

        <Animated.View
          style={[
            styles.formContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView contentContainerStyle={styles.scrollView}>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={colors.text + '80'}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={colors.text + '80'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={colors.text + '80'}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.text + '80'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <CustomButton
                title="Sign Up"
                onPress={handleSignUp}
                style={styles.signUpButton}
              />

              <TouchableOpacity style={styles.loginLink}>
                <Text style={styles.loginText}>
                  Already have an account? Log In
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.background,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: colors.background,
    marginBottom: 30,
    textAlign: 'center',
  },
  getStartedButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  getStartedText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 50,
    height: height * 0.75,
  },
  scrollView: {
    flexGrow: 1,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: colors.text,
  },
  signUpButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: colors.primary,
    fontSize: 14,
  },
});

export default SignUpScreen;