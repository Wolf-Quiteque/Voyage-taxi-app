import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../styles/colors';
import CustomButton from '../components/CustomButton';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
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

  const handleLogin = async () => {
    // Implement your login logic here
    console.log('Login attempt with:', email, password);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://picsum.photos/id/1067/1000/1000' }}
      style={styles.backgroundImage}
    >
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <Text style={styles.title}>Voyage</Text>
        <Text style={styles.subtitle}>Welcome back</Text>

        {!showForm && (
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.getStartedText}>Log In</Text>
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
            style={styles.keyboardAvoidingView}
          >
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
              placeholder="Password"
              placeholderTextColor={colors.text + '80'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <CustomButton
              title="Log In"
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <TouchableOpacity 
              style={styles.forgotPasswordLink}
              onPress={() => {/* Handle forgot password */}}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signUpLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signUpText}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
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
    height: height * 0.6,
  },
  keyboardAvoidingView: {
    flex: 1,
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
  loginButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
  },
  forgotPasswordLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  signUpLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    color: colors.primary,
    fontSize: 14,
  },
});

export default LoginScreen;