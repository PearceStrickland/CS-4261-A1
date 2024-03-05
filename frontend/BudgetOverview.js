import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCutlery, faCoffee, faBicycle, faGift, faShoppingBag, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const BudgetOverviewScreen = () => {
  // Mock data
  const transactions = [
    { date: 'Today', category: 'Food', amount: -18, icon: faCutlery },
    { date: 'Today', category: 'Coffee', amount: -10, icon: faCoffee },
    { date: 'Feb 24', category: 'Fitness', amount: -80, icon: faBicycle },
    { date: 'Feb 24', category: 'Gift', amount: -18, icon: faGift },
    { date: 'Feb 24', category: 'Clothing', amount: -25, icon: faShoppingBag },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.month}>FEBRUARY ↓</Text>
        <FontAwesomeIcon icon={faEllipsisV} size={24} color="black" />
      </View>


      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>$4200</Text>
          <Text style={styles.summaryLabel}>Budget</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>$1892</Text>
          <Text style={styles.summaryLabel}>Balance Remaining</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>-$2308</Text>
          <Text style={styles.summaryLabel}>Expenses</Text>
        </View>
      </View>

      <View style={styles.transactionList}>
        {transactions.map((transaction, index) => (
          <View key={`transaction-${index}`} style={styles.transactionItem}>
          {transaction.icon ? <FontAwesomeIcon icon={transaction.icon} size={24} color="black" /> : <Text>No Icon</Text>}    
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionCategory}>{transaction.category}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={styles.transactionAmount}>{transaction.amount}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffebc5',
    alignItems: 'center',
  },
  month: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#ffdeab',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },
  transactionList: {
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  transactionDetails: {
    marginLeft: 10,
    flex: 1,
  },
  transactionCategory: {
    fontSize: 16,
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d9534f',
  },
});

export default BudgetOverviewScreen;
