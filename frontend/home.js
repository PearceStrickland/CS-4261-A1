import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';


const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Welcome to BudgetBuddy!</Title>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Currency')}
            style={styles.button}
          >
            Currency Exchange
          </Button>
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
            mode="outlined"
            onPress={() => navigation.navigate('Login')}
            style={styles.logoutButton}
          >
            Log Out
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
});

export default HomeScreen;
