import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { getFolders } from '../storage';
import { Folder } from '../types';

type FoldersScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Folders'>;
};

export default function FoldersScreen({ navigation }: FoldersScreenProps) {
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  async function loadData() {
    const foldersData = await getFolders();
    setFolders(foldersData);
  }

  function renderFolder({ item }: { item: Folder }) {
    return (
      <TouchableOpacity 
        style={styles.folderCard}
        onPress={() => navigation.navigate('FolderDetail', { folderId: item.id })}
      >
        <View style={styles.folderIcon}>
          <Text style={styles.iconText}>📁</Text>
        </View>
        <View style={styles.folderInfo}>
          <Text style={styles.folderName}>{item.name}</Text>
          <Text style={styles.folderCount}>{item.productIds.length} products</Text>
          {item.description && (
            <Text style={styles.folderDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={renderFolder}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No folders yet</Text>
            <Text style={styles.emptySubtext}>Create a folder to organize your products</Text>
          </View>
        }
        contentContainerStyle={folders.length === 0 ? styles.emptyList : undefined}
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddFolder')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  folderCard: {
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
  folderIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  folderInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  folderCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  folderDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: 'white',
    fontWeight: '300',
  },
});
