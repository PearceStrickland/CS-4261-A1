import React from 'react';
import { View, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={require('./homescreenback.jpg')} // Make sure the path is correct
        resizeMode="cover" // This will cover the whole area without stretching
        style={styles.backgroundImage}
      >
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Welcome to BudgetBuddy!</Title>
            </Card.Content>
          </Card>

          <View style={styles.buttonContainer}>
          
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Settings')}
            style={styles.button}
          >
            Settings
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('BudgetOverview')}
            style={styles.button}
          >
            Budget Overview
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Stocks')}
            style={styles.button}
          >
            Stock Page
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Assistant')}
            style={styles.button}
          >
            Assistant Page
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('BudgetOverview2')}
            style={styles.button}
          >
            BudgetOverview2
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Login')}
            style={styles.logoutButton}
          >
            Log Out
          </Button>
          
        </View>

        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1, // This makes sure the background image takes up the whole space
    width: '100%', // These are required for ImageBackground to be full screen
    height: '100%', // These are required for ImageBackground to be full screen
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  card: {
    width: '90%',
    elevation: 4,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 8,
  },
  buttonContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'stretch', // Make buttons stretch to fill the container
    marginTop: 20,
  },
  button: {
    marginVertical: 5, // Add vertical margin between buttons
  },
  logoutButton: {
    marginTop: 10,
    borderColor: '#6200ee',
  }
  // ... rest of your styles
});

export default HomeScreen;
