
import React from 'react';
import { Text, Alert, View } from 'react-native';
import { PlaidLink } from 'react-native-plaid-link-sdk';

const SettingsScreen = () => {
  const handleOnSuccess = (success) => {
    console.log('Plaid Link success: ', success);
    // You might want to send 'success.publicToken' to your server here to exchange for an access token
  };

  const handleOnExit = (exit) => {
    console.log('Plaid Link exit: ', exit);
    // You might want to handle the exit scenario here. For example:
    if (exit.error) {
      Alert.alert('Exit or Error', exit.error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PlaidLink
        tokenConfig={{
          token: "link-sandbox-6ea96692-32ea-40d7-9493-23671331dc42", // Replace with your actual generated link token
          logLevel: 'ERROR', // Adjust log level as needed
          noLoadingState: false, // Set to true to skip loading animation
        }}
        onSuccess={handleOnSuccess}
        onExit={handleOnExit}
        iOSPresentationStyle='MODAL' // 'FULL_SCREEN' is also an option
      >
        <Text>Add Account</Text>
      </PlaidLink>
    </View>
  );
};

export default SettingsScreen;