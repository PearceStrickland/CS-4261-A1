import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';

const StocksScreen = ({ navigation }) => {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStockData = async () => {
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: {
          symbol: symbol.trim(),
          token: 'cmsoffpr01qpvcptb5v0cmsoffpr01qpvcptb5vg' 
        },
      });
     
      if (response.data.c) { // 'c' represents the current price
        setStockData(response.data);
      } else {
        setError('Data not found for the given symbol');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Error fetching stock data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter stock symbol (e.g., AAPL)"
        value={symbol}
        onChangeText={setSymbol}
        autoCapitalize="characters"
      />
      <Button title="Get Stock Data" onPress={fetchStockData} />
      {loading && <ActivityIndicator size="large" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {stockData && (
        <View style={styles.stockInfo}>
          <Text style={styles.title}>Stock Symbol: {symbol}</Text>
          <Text>Current Price: {stockData.c}</Text>
          <Text>High: {stockData.h}</Text>
          <Text>Low: {stockData.l}</Text>
          <Text>Open: {stockData.o}</Text>
          <Text>Previous Close: {stockData.pc}</Text>
        </View>
      )}
      <Button
        title="Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  stockInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
});

export default StocksScreen;