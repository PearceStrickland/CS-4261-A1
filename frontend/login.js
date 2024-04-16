import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ImageBackground, TouchableHighlight } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://cs4261-budget-buddy-b244eb0e4e74.herokuapp.com/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Login successful', data);
        navigation.navigate('Home');
      } else {
        setError(data.message || 'Invalid login credentials');
      }
    } catch (error) {
      console.error('Login request error', error);
      setError('Failed to connect to the server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>BudgetBuddy</Text>
      <Image
        source={require('./logo.png')} // Replace with your logo image path
        style={styles.logo}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          navigation.navigate('SignUp')
        }}>
          <Text style={styles.forgotPassword}>CREATE ACCOUNT</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('./loginbottom.png')} // Replace with your waves image path
        style={styles.waves}
        resizeMode="cover"
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    top: 160, // Stick to the bottom
    width: '50%', // Full width
    height: '25%',
    marginBottom: 120,
  },
  headerText: {
    fontFamily: 'GillSans-Bold',
    fontSize: 36,
    color: '#99E1FB', // Light blue color
    position: 'absolute',
    top: 110, // Adjust to your liking
    alignSelf: 'center',
  },
  inputContainer: {
    width: '80%', // Set width to match design
    marginTop: 30, // Adjust as needed
  },
  input: {
    height: 50, // Set height to match design
    borderBottomWidth: 1, // Only bottom border
    borderBottomColor: 'lightgray', // Border color
    marginBottom: 15, // Spacing between inputs
    fontSize: 16, // Text size
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
  },
  loginButton: {
    backgroundColor: '#007AFF', // Blue color for the button
    paddingVertical: 15, // Vertical padding
    alignItems: 'center', // Center text horizontally
    borderRadius: 25, // Rounded corners
    marginTop: 20, // Space from the last input field
  },
  loginButtonText: {
    color: 'white', // Text color
    fontSize: 16, // Text size
  },
  forgotPassword: {
    color: 'gray', // Text color for 'Forgot Password?'
    alignSelf: 'center', // Center text horizontally
    marginTop: 10, // Space from login button
  },
  waves: {
    position: 'absolute', // Absolute positioning
    bottom: 0, // Stick to the bottom
    width: '100%', // Full width
    height: '30%', // Take up bottom 25% of the screen
  },
  termsText: {
    position: 'absolute', // Absolute positioning
    bottom: 10, // Space from bottom
    width: '80%', // Width to match design
    textAlign: 'center', // Center text
    fontSize: 12, // Text size
  },
});

export default LoginScreen;