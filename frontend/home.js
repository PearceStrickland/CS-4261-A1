import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
      <Button title="Log Out" onPress={() => navigation.navigate('Login')} />
      <Button
        title="Go to Stocks"
        onPress={() => navigation.navigate('Stocks', { symbol: 'AAPL' })} // 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;