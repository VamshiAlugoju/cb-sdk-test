import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { isValidUserId } from '../lib';

export type User = {
  apiKey: string;
  uniqueId: string;
};

type LoginProps = {
  setUser: React.Dispatch<React.SetStateAction<User>>;
};
const Login = (props: LoginProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (isValidUserId(inputValue) === false) {
      Alert.alert('Invalid ID', 'Please enter a valid ID');
      return;
    }
    console.log('Submitted ID:', inputValue);
    props.setUser({ apiKey: 'your-api-key', uniqueId: inputValue });
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      }}
      style={styles.background}
      blurRadius={2}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your ID to continue</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter ID or phone"
            placeholderTextColor="#999"
            keyboardType="default"
            value={inputValue}
            onChangeText={setInputValue}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
