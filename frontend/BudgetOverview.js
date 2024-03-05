import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const BudgetOverviewScreen = ({ navigation }) => {
  // Mock data for budget categories
  const budgetCategories = [
    { name: 'Auto & Transport', budget: 700, spent: 514 },
    { name: 'Auto Insurance', budget: 250, spent: 130 },
    { name: 'House Service', budget: 138, spent: 128 },
    { name: 'Maintenance', budget: 130, spent: 100 },
  ];

  const calculateRemaining = (budget, spent) => {
    return budget - spent;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthText}>March 2024</Text>
        <View style={styles.budgetOverview}>
          <Text style={styles.leftToSpend}>Left to spend</Text>
          <Text style={styles.monthlyBudget}>Monthly budget</Text>
          <Text style={styles.amountLeft}>$738</Text>
          <Text style={styles.totalBudget}>$2,550</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar(0.3)}></View>
          </View>
        </View>
      </View>
      {budgetCategories.map((category, index) => (
        <View key={index} style={styles.budgetItem}>
          <Text style={styles.budgetName}>{category.name}</Text>
          <Text style={styles.budgetAmount}>
            ${category.budget}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar(calculateRemaining(category.budget, category.spent) / category.budget)}></View>
          </View>
          <Text style={styles.amountLeft}>
            Left ${calculateRemaining(category.budget, category.spent)}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  budgetOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftToSpend: {
    fontSize: 14,
    color: '#666',
  },
  monthlyBudget: {
    fontSize: 14,
    color: '#666',
  },
  amountLeft: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalBudget: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#eaecef',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 5,
  },
  progressBar: (percentage) => ({
    height: '100%',
    width: `${percentage * 100}%`,
    backgroundColor: percentage > 0.5 ? '#4caf50' : '#ff9800',
    borderRadius: 5,
  }),
  budgetItem: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  budgetAmount: {
    fontSize: 16,
    color: '#666',
  },
});

export default BudgetOverviewScreen;