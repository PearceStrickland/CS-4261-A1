import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ImageBackground } from 'react-native';

const SignUpScreen = ({ navigation }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    try {
      const response = await fetch('https://cs4261-budget-buddy-b244eb0e4e74.herokuapp.com/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname,
          email,
          password,
          confirmPassword
        }),
      });

      const data = await response.json();
      if (data.success) {
    
        console.log('Signup successful', data);
    
        navigation.navigate('Login');
      } else {
     
        setError(data.message || 'Failed to sign up.');
      }
    } catch (error) {
      console.error('Signup request error', error);
      setError('Failed to connect to the server');
    }
  };

  return (
    <View style={styles.container}>
    
        <Text style={styles.headerText}>CREATE YOUR BUDGETBUDDY ACCOUNT</Text>
 
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullname}
          onChangeText={setFullname}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleSignUp}
        >
          <Text style={styles.loginButtonText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.forgotPassword}>ALREADY HAVE AN ACCOUNT? LOGIN</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('./loginbottom.png')}
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
  container1: {
    textAlign: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontFamily: 'GillSans-Bold',
    fontSize: 24,
    color: '#99E1FB',
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
  },
  logo: {
    top: 100,
    width: '50%',
    height: '25%',
    marginBottom: 80,
  },
  inputContainer: {
    width: '80%',
    marginTop: 150,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginBottom: 15,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  forgotPassword: {
    color: 'gray',
    alignSelf: 'center',
    marginTop: 10,
  },
  waves: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '30%',
  },
  termsText: {
    position: 'absolute',
    bottom: 10,
    width: '80%',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default SignUpScreen;