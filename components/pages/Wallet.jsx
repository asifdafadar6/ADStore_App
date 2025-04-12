import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

const walletData = {
  balance: '₹5,000.00',
  transactions: [
    { id: '1', title: 'Nike Air4 Shoes', amount: '-₹1,200.00', date: 'Feb 15, 2025', type: 'debit', icon: 'cart-outline' },
    { id: '2', title: 'Vivo Refund', amount: '+₹800.00', date: 'Feb 14, 2025', type: 'credit', icon: 'cash-refund' },
    { id: '3', title: 'Bank Transfer', amount: '-₹2,000.00', date: 'Feb 12, 2025', type: 'debit', icon: 'bank-transfer' },
    { id: '4', title: 'Cashback', amount: '+₹150.00', date: 'Feb 10, 2025', type: 'credit', icon: 'cash' },
  ],
};

export default function Wallet() {
  return (
    <View style={styles.container}>
      {/* Wallet Header */}
      {/* Wallet Balance Section with Linear Gradient */}
      <LinearGradient colors={['#4CAF50', '#2E7D32']} style={styles.balanceContainer}>
        <FontAwesome5 name="wallet" size={28} color="#fff" />
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balance}>{walletData.balance}</Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addMoneyButton}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Money</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.withdrawButton}>
            <MaterialCommunityIcons name="bank-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Transactions List */}
      <Text style={styles.transactionHeader}>Recent Transactions</Text>
      <FlatList
        data={walletData.transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.transactionCard, item.type === 'debit' ? styles.debit : styles.credit]}>
            <MaterialCommunityIcons name={item.icon} size={26} color={item.type === 'debit' ? "#e74c3c" : "#27ae60"} />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionTitle}>{item.title}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text style={[styles.transactionAmount, item.type === 'debit' ? styles.debitText : styles.creditText]}>
              {item.amount}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  balanceContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  addMoneyButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 5,
  },
  withdrawButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(253, 69, 13, 0.8)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    gap: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  transactionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  debit: {
    borderLeftWidth: 4,
    borderColor: '#e74c3c',
  },
  credit: {
    borderLeftWidth: 4,
    borderColor: '#27ae60',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#777',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  debitText: {
    color: '#e74c3c',
  },
  creditText: {
    color: '#27ae60',
  },
});
