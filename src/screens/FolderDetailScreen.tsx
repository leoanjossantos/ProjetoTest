import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { getFolders, getProducts, updateFolder, deleteFolder } from '../storage';
import { Folder, Product } from '../types';

type FolderDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FolderDetail'>;
  route: RouteProp<RootStackParamList, 'FolderDetail'>;
};

export default function FolderDetailScreen({ navigation, route }: FolderDetailScreenProps) {
  const { folderId } = route.params;
  const [folder, setFolder] = useState<Folder | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation, folderId]);

  async function loadData() {
    const folders = await getFolders();
    const foundFolder = folders.find(f => f.id === folderId);
    setFolder(foundFolder || null);

    if (foundFolder) {
      const allProducts = await getProducts();
      const folderProducts = allProducts.filter(p => foundFolder.productIds.includes(p.id));
      setProducts(folderProducts);
    }
  }

  async function handleRemoveProduct(productId: string) {
    if (!folder) return;
    
    const updatedProductIds = folder.productIds.filter(id => id !== productId);
    const updatedFolder = { ...folder, productIds: updatedProductIds, updatedAt: Date.now() };
    
    const success = await updateFolder(updatedFolder);
    if (success) {
      loadData();
    }
  }

  async function handleDeleteFolder() {
    Alert.alert(
      'Delete Folder',
      'Are you sure you want to delete this folder?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteFolder(folderId);
            if (success) {
              navigation.goBack();
            }
          }
        },
      ]
    );
  }

  function renderProduct({ item }: { item: Product }) {
    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveProduct(item.id)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!folder) {
    return (
      <View style={styles.container}>
        <Text>Folder not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.folderName}>{folder.name}</Text>
        {folder.description && (
          <Text style={styles.folderDescription}>{folder.description}</Text>
        )}
        <Text style={styles.productCount}>{products.length} products</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products in this folder</Text>
            <Text style={styles.emptySubtext}>Add products from the Products screen</Text>
          </View>
        }
        contentContainerStyle={products.length === 0 ? styles.emptyList : undefined}
      />

      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteFolder}>
        <Text style={styles.deleteButtonText}>Delete Folder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  folderName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  folderDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  productCount: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 8,
    fontWeight: '600',
  },
  productCard: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  removeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffebee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});