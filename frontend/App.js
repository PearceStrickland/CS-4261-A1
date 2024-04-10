import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import LoginScreen from './login';
import HomeScreen from './home';
import StocksScreen from './stocks';
import SignUpScreen from './signup';
import CurrencyScreen from './currency';
import SettingsScreen from './settings';
import BudgetOverviewScreen from './BudgetOverview'
import AssistantScreen from './assistant'
import BudgetOverviewScreen2 from './BudgetOverview2'


const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Stocks" component={StocksScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Currency" component={CurrencyScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="BudgetOverview" component={BudgetOverviewScreen} />
          <Stack.Screen name="Assistant" component={AssistantScreen} />
          <Stack.Screen name="BudgetOverview2" component={BudgetOverviewScreen2} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
