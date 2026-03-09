import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { getProducts, getFolders, getSupermarkets, initializeDefaultCategories } from '../storage';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [productsCount, setProductsCount] = useState(0);
  const [foldersCount, setFoldersCount] = useState(0);
  const [supermarketsCount, setSupermarketsCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    await initializeDefaultCategories();
    const products = await getProducts();
    const folders = await getFolders();
    const supermarkets = await getSupermarkets();
    setProductsCount(products.length);
    setFoldersCount(folders.length);
    setSupermarketsCount(supermarkets.length);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Supermarket Price Compare</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{productsCount}</Text>
          <Text style={styles.statLabel}>Products</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{foldersCount}</Text>
          <Text style={styles.statLabel}>Folders</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{supermarketsCount}</Text>
          <Text style={styles.statLabel}>Supermarkets</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.menuIcon}>📦</Text>
          <Text style={styles.menuText}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('Folders')}
        >
          <Text style={styles.menuIcon}>📁</Text>
          <Text style={styles.menuText}>Folders</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.navigate('Supermarkets')}
        >
          <Text style={styles.menuIcon}>🏪</Text>
          <Text style={styles.menuText}>Supermarkets</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddProduct')}
        >
          <Text style={styles.actionText}>+ Add New Product</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddFolder')}
        >
          <Text style={styles.actionText}>+ Create New Folder</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddSupermarket')}
        >
          <Text style={styles.actionText}>+ Add Supermarket</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  quickActions: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
