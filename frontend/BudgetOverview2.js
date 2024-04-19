import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Dimensions, SectionList, TextInput} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAuth } from './AuthContext';
import axios from 'axios';

const BudgetOverview2 = () => {
  const { accessToken, jsonToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalBudget, setTotalBudget] = useState(4000);
  const [remainingAmount, setRemainingAmount] = useState(totalBudget);
  const [months, setMonths] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [sortType, setSortType] = useState({});
  const [editableBudget, setEditableBudget] = useState(totalBudget.toString());
  const [isBudgetSet, setIsBudgetSet] = useState(false);
  

  const formatDate = (dateString) => {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const date = new Date(year, month);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  useEffect(() => {
    axios.get('https://cs4261-budget-buddy-b244eb0e4e74.herokuapp.com/retrieve-transactions', {
      headers: {
        'Authorization': `Bearer ${jsonToken}` // Ensure this token is securely handled and correctly set
      }
    })
    .then(response => {
    combinedTransactions=response.data.transactions;
    console.log(combinedTransactions)
    setTransactions(combinedTransactions);

    const uniqueMonths = Array.from(new Set(combinedTransactions.map(t => t.date.slice(0, 7)))).sort().reverse();
    setMonths(uniqueMonths);
    setSelectedMonth(uniqueMonths[0]);

    // Update totals and group transactions
    calculateTotalForMonth(uniqueMonths[0], combinedTransactions);
    groupTransactionsByCategory(combinedTransactions, uniqueMonths[0])
    })
    .catch(error => {
      console.error('Error fetching transactions:', error);
    });
    
  }, [jsonToken]);

  const calculateTotalForMonth = (month, transactionsToSum) => {
    const monthTransactions = transactionsToSum.filter(t => t.date.startsWith(month) && t.amount > 0);
    const total = monthTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    setTotalAmount(total);
    setRemainingAmount(totalBudget - total);
  };


  const groupTransactionsByCategory = (transactions, month) => {
    const monthTransactions = transactions.filter(t => t.date.startsWith(month));
    const transactionsByCategory = monthTransactions.reduce((acc, transaction) => {
      const category = transaction.categories ? transaction.categories[0] : 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(transaction);
      return acc;
    }, {});
  
    const groupedData = Object.keys(transactionsByCategory).map(category => {
      const sortedTransactions = transactionsByCategory[category];
      return {
        title: category,
        data: sortedTransactions,
        amount: sortedTransactions.reduce((sum, t) => sum + t.amount, 0),
      };
    });
  
    setGroupedTransactions(groupedData);
  };


  const selectMonth = (month) => {
    setSelectedMonth(month);
    calculateTotalForMonth(month, transactions);
    groupTransactionsByCategory(transactions, month);
    setModalVisible(false);
  };

  
  const chartData = () => {
    const categoryColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#FFCDCC'];
    const colorMap = groupedTransactions.reduce((acc, section, index) => {
      acc[section.title] = categoryColors[index % categoryColors.length];
      return acc;
    }, {});

    
  
    return groupedTransactions.map(section => ({
      name: section.title,
      amount: parseFloat(section.amount.toFixed(2)),
      color: colorMap[section.title],
      legendFontColor: '#7F7F7F',
      legendFontSize: 11,
    })).filter(section => section.amount > 0);
  };

  const onBudgetSubmit = () => {
    const newBudget = parseFloat(editableBudget.replace(/[^0-9\.]/g, ''));
    if (!isNaN(newBudget) && newBudget >= 0) {
      setTotalBudget(newBudget);
      setRemainingAmount(newBudget - totalAmount);
      setIsBudgetSet(true);
    } else {
      alert('Please enter a valid number for the budget.');
    }
  };


 
  return (
    <View style={styles.container}>
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
          <Text style={styles.modalTitle}>Select Month</Text>
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
  
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item, index) => `transaction-${item.date}-${item.name}-${index}`}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.transactionItem}>
            <Image
              source={{ uri: item.logoUrl || 'https://via.placeholder.com/150' }}
              style={styles.logo}
            />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
              <Text style={styles.transactionCategory}>
                {item.categories ? item.categories.join(', ') : 'No Category'}
              </Text>
              <Text style={styles.transactionAmount}>
                ${item.amount.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
              <TouchableOpacity
                  onPress={() => {
                      setSortType({
                          ...sortType,
                          [title]: sortType[title] === 'date' ? 'alphabetical' : 'date',
                      });
                      groupTransactionsByCategory(transactions, selectedMonth);
                  }}
                  style={styles.sortButton}
              >
                  <Text style={styles.sortButtonText}>
                      {sortType[title] === 'date' ? 'Sort by Name' : 'Sort by Date'}
                  </Text>
              </TouchableOpacity>
          </View>
      )}
      
        ListHeaderComponent={
          <>
           <View style={styles.budgetHeader}>
           <View style={styles.budgetInfo}>
        <View style={styles.budgetInfoItem}>
          <Text style={styles.budgetLabel}>Total Budget</Text>
          <TextInput
            style={styles.budgetValue}
            value={editableBudget}
            onChangeText={text => setEditableBudget(text)}
            keyboardType="numeric"
            returnKeyType="done"
            onEndEditing={() => {
              const newBudget = parseFloat(editableBudget.replace(/[^0-9]/g, ''));
              if (!isNaN(newBudget) && newBudget >= 0) {
                setTotalBudget(newBudget);
                setRemainingAmount(newBudget - totalAmount);
              }
            }}
          />
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
            <View style={styles.chartContainer}>
            <PieChart
              data={chartData()}
              width={Dimensions.get('window').width}
              height={240}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="8"
              center={[0, 0]}
              absolute
            />
            </View>
          </>
        }
      />
    </View>
  );
  
};

const styles = StyleSheet.create({
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
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
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
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  
  },
  sectionHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#2980b9',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});


export default BudgetOverview2;
