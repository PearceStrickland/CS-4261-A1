import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, SectionList, TouchableOpacity, Modal, FlatList } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAuth } from './AuthContext';
import axios from 'axios';

const BudgetOverviewScreen2 = () => {
  const { accessToken } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [months, setMonths] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const formatDate = (dateString) => {
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Adjust month (-1)
    const date = new Date(year, month);

    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    if (accessToken) {
      axios.post('https://sandbox.plaid.com/transactions/sync', {
        client_id: '65e23a52dbf9aa001b55b5a0',
        secret: 'aa6c0c28445c17d25b2825d8c1ac55',
        access_token: accessToken
      })
      .then(response => {
        const combinedTransactions = [...response.data.added, ...response.data.modified];
        combinedTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(combinedTransactions);

        // Group transactions by category
        const transactionsByCategory = combinedTransactions.reduce((acc, transaction) => {
          const monthYear = transaction.date.slice(0, 7);
          const category = transaction.category ? transaction.category[0] : 'Uncategorized';
          if (!acc[monthYear]) acc[monthYear] = {};
          if (!acc[monthYear][category]) acc[monthYear][category] = [];
          acc[monthYear][category].push(transaction);
          return acc;
        }, {});

        // Prepare data for SectionList
        const selectedMonthTransactions = transactionsByCategory[selectedMonth] || {};
        const groupedData = Object.keys(selectedMonthTransactions).map(category => ({
          title: category,
          data: selectedMonthTransactions[category],
        }));

        setGroupedTransactions(groupedData);
        setMonths(Object.keys(transactionsByCategory).sort().reverse());
        setSelectedMonth(Object.keys(transactionsByCategory).sort().reverse()[0]);
        calculateTotalForMonth(selectedMonth, combinedTransactions);
      })
      .catch(error => {
        console.error('Error fetching transactions:', error);
      });
    }
  }, [accessToken, selectedMonth]);

  const calculateTotalForMonth = (month, transactionsToSum) => {
    const monthTransactions = transactionsToSum.filter(t => t.date.slice(0, 7) === month && t.amount > 0);
    const total = monthTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    setTotalAmount(total);
  };

  const selectMonth = (month) => {
    setSelectedMonth(month);
    calculateTotalForMonth(month, transactions);
    setModalVisible(false);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionName}>{item.name}</Text>
      <Text style={styles.transactionAmount}>${Math.abs(item.amount).toFixed(2)}</Text>
      <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.monthSelector} onPress={() => setModalVisible(true)}>
        <Text style={styles.monthText}>{'March' && formatDate(`March-01`)}</Text>
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

      <Text style={styles.totalAmount}>Total for {selectedMonth && formatDate(`${selectedMonth}-01`)}: ${totalAmount.toFixed(2)}</Text>

      <PieChart
        data={groupedTransactions.map(section => {
            const positiveTransactions = section.data.filter(t => t.amount > 0); // Filter out negative transactions
            const total = positiveTransactions.reduce((sum, t) => sum + t.amount, 0);
            return {
              name: section.title,
              amount: parseFloat(total.toFixed(2)),
              color: '#' + Math.floor(Math.random()*16777215).toString(16),
              legendFontColor: '#7F7F7F',
              legendFontSize: 10,
            };
          }).filter(section => section.amount > 0)} 
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={{
          backgroundColor: '#000000',
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          strokeWidth: 2, // optional, default 3
          barPercentage: 0.5,
          useShadowColorFromDataset: false, // optional
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 10]}
        absolute
      />

      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item, index) => item + index}
        renderItem={renderTransaction}
        renderSectionHeader={renderSectionHeader}
      />
    </ScrollView>
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
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '50%', // Adjust the width as needed
  },
  transactionAmount: {
    fontSize: 16,
    color: '#c0392b',
    width: '25%', // Adjust the width as needed
    textAlign: 'center', // Center the amount
  },
  transactionDate: {
    fontSize: 14,
    color: '#7f8c8d',
    width: '25%', // Adjust the width as needed
    textAlign: 'right', // Align the date to the right
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

export default BudgetOverviewScreen2;
