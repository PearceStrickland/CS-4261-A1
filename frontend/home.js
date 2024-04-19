import React from 'react';
import { View, StyleSheet, ImageBackground, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <ImageBackground 
      source={require('./back2.jpg')}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to BudgetBuddy!</Text>
        <Text style={styles.sub}>The Personal Financial Assistant in Your Pocket</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Settings')}
            style={[styles.button, styles.settingsButton]}
            labelStyle={styles.buttonLabel}
          >
            Settings
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('BudgetOverview2')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Budget Overview
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Assistant')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Assistant Page
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Login')}
            style={styles.logoutButton}
            labelStyle={styles.buttonLabel}
          >
            Log Out
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center', // Center content for a better visual impact
  },
  content: {
    flex: 1,
     // Evenly space children vertically
    alignItems: 'center',
  },
  title: {
    color: '#ffffff', // White color for the text for better contrast
    fontSize: 28, // Larger font size for the title
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for better readability
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 30, // Space from the buttons
    marginTop: 40
  },
  sub: {
    color: '#ffffff', // White color for the text for better contrast
    fontSize: 20, // Larger font size for the title
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for better readability
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 100, // Space from the buttons
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    marginBottom: 30,
    shadowOpacity: 0.95,
    shadowColor: 'rgba(0, 0, 0, 0.75)',
    shadowRadius: 10 ,
    shadowOffset : { width: -3, height: 3},
  },

  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    marginBottom: 30,
    shadowOpacity: 0.95,
    shadowColor: 'rgba(0, 0, 0, 0.75)',
    shadowRadius: 10 ,
    shadowOffset : { width: -3, height: 3},
    marginTop: 180,
  },
  buttonLabel: {
    color: '#333333', // Dark text for readability on light buttons
    fontSize: 16, // Bigger font size for button labels
  }
  // ... rest of your styles
});

export default HomeScreen;
