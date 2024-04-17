import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useAuth } from './AuthContext';
import axios from 'axios';

const BudgetOverviewScreen = () => {
  const { accessToken, jsonToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [months, setMonths] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [totalBudget, setTotalBudget] = useState(4000); // Assuming a fixed total budget, set this to your default or fetched value
  const [remainingAmount, setRemainingAmount] = useState(totalBudget);
  
  

  const formatDate = (dateString) => {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Adjust month (-1)
    const date = new Date(year, month);
  
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

    useEffect(() => {
      axios.get('https://cs4261-budget-buddy-b244eb0e4e74.herokuapp.com/retrieve-transactions', {
        headers: {
          'Authorization': `Bearer ${jsonToken}` // Ensure this token is securely handled and correctly set
        }
      })
      .then(response => {
        console.log('Transactions retrieved:', response.data);
        combinedTransactions=response.data.transactions
        setTransactions(combinedTransactions);
        console.log(combinedTransactions)
        const uniqueMonths = Array.from(new Set(combinedTransactions.map(t => t.date.slice(0, 7)))).sort().reverse();
        setMonths(uniqueMonths);
        setSelectedMonth(uniqueMonths[0]);
        calculateTotalForMonth(uniqueMonths[0], combinedTransactions);
        // You can now do something with the retrieved transactions
      })
      .catch(error => {
        console.error('Error retrieving transactions:', error);
      });
    }, [jsonToken]);
      
  const calculateTotalForMonth = (month, transactionsToSum) => {
    const monthTransactions = transactionsToSum.filter(t => t.date.startsWith(month) && t.amount > 0);
    const total = monthTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    setTotalAmount(total);
    setRemainingAmount(totalBudget - total);
  };

  const selectMonth = (month) => {
    setSelectedMonth(month);
    calculateTotalForMonth(month, transactions);
    setModalVisible(false);
  };
  console.log(transactions)

  return (
    <ScrollView style={styles.container}>
    <TouchableOpacity style={styles.monthSelector} onPress={() => setModalVisible(true)}>
      <Text style={styles.monthText}>{formatDate(`${selectedMonth}-01`)}</Text>
    </TouchableOpacity>

    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Month</Text>
        <FlatList
          data={months}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.modalItem} onPress={() => selectMonth(item)}>
              <Text style={styles.modalText}>{formatDate(`${item}-01`)}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>

    <View style={styles.budgetHeader}>
      <View style={styles.budgetInfo}>
        <View style={styles.budgetInfoItem}>
          <Text style={styles.budgetLabel}>Total Budget</Text>
          <Text style={styles.budgetValue}>${totalBudget.toFixed(2)}</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.budgetInfoItem}>
          <Text style={styles.budgetLabel}>Spent this Month</Text>
          <Text style={styles.budgetValue}>${totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={styles.budgetInfoItem}>
          <Text style={styles.budgetLabel}>Remaining</Text>
          <Text style={styles.remainValue}>${(totalBudget - totalAmount).toFixed(2)}</Text>
        </View>
      </View>
    </View>

    <Text style={styles.totalAmount}>Total for {formatDate(`${selectedMonth}-01`)}: ${totalAmount.toFixed(2)}</Text>
    {transactions.filter(t => t.date.startsWith(selectedMonth))
    .filter(t => t.amount > 0)
    .map((transaction, index) => (
      <View key={index} style={styles.transactionItem}>
        <Image 
          source={{ uri: transaction.logo_url || 'https://via.placeholder.com/150' }} 
          style={styles.logo} 
        />
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionName}>{transaction.name}</Text>
          <Text style={styles.transactionDate}>{transaction.date}</Text>
          <Text style={styles.transactionCategory}>{transaction.category?.join(', ') || 'No Category'}</Text>
          <Text style={styles.transactionAmount}>${transaction.amount}</Text>
        </View>
      </View>
    ))}
  </ScrollView>
);
};

const styles = StyleSheet.create({
  budgetHeader: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
  },
  budgetInfo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    padding: 15,
  },
  budgetInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  budgetLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6c757d',
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginVertical: 10,
  },
  positive: {
    backgroundColor: '#d4edda',
  },
  negative: {
    backgroundColor: '#f8d7da',
  },
  remainValue: {
    color: 'green',
  },
  container: {
    flex: 1,
  },
  monthSelector: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
  },
  modalView: {
    marginTop: 22,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItem: {
    padding: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 14,
  },
  transactionCategory: {
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BudgetOverviewScreen;