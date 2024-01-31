import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';


// Made another page that pulls from the financial service and tells the real time exchange rates of currencies. 
const CurrencyScreen = ({ navigation }) => {
  const [currencyPair, setCurrencyPair] = useState('');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchExchangeRate = async () => {
    if (!currencyPair.trim() || currencyPair.trim().length !== 6) {
      setError('Please enter a valid currency pair (e.g., USDGBP)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const baseCurrency = currencyPair.trim().substring(0, 3);
      const quoteCurrency = currencyPair.trim().substring(3, 6);
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/20fce94a084ce4b16129bd6c/latest/${baseCurrency}`);
      
      const rate = response.data.conversion_rates[quoteCurrency];
      if (rate) {
        setExchangeRate({ base: baseCurrency, quote: quoteCurrency, rate: rate });
      } else {
        setError('Data not found for the given currency pair');
      }
    } catch (error) {
      console.error('Error fetching exchange rate data:', error);
      setError('Error fetching exchange rate data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter currency pair (e.g., USDGBP)"
        value={currencyPair}
        onChangeText={setCurrencyPair}
        autoCapitalize="characters"
      />
      <Button title="Get Exchange Rate" onPress={fetchExchangeRate} />
      {loading && <ActivityIndicator size="large" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {exchangeRate && (
        <View style={styles.exchangeRateInfo}>
          <Text style={styles.title}>Currency Pair: {exchangeRate.base}/{exchangeRate.quote}</Text>
          <Text>Exchange Rate: {exchangeRate.rate}</Text>
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
  exchangeRateInfo: {
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

export default CurrencyScreen;