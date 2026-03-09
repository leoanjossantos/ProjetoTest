import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { RootStackParamList } from '../navigation';
import { getSupermarkets } from '../storage';
import { Supermarket } from '../types';

type SupermarketsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Supermarkets'>;
};

export default function SupermarketsScreen({ navigation }: SupermarketsScreenProps) {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const locationRef = useRef<Location.LocationObject | null>(null);

  // Load data function - defined with useCallback to avoid stale closures
  const loadData = useCallback(async () => {
    const supermarketsData = await getSupermarkets();
    
    // Use ref to always get the latest location value
    if (locationRef.current) {
      const withDistances = supermarketsData.map(supermarket => {
        if (supermarket.latitude && supermarket.longitude) {
          const distance = calculateDistance(
            locationRef.current!.coords.latitude,
            locationRef.current!.coords.longitude,
            supermarket.latitude,
            supermarket.longitude
          );
          return { ...supermarket, distance };
        }
        return supermarket;
      });
      setSupermarkets(withDistances);
    } else {
      setSupermarkets(supermarketsData);
    }
  }, []);

  useEffect(() => {
    requestLocation();
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation, loadData]);

  async function requestLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        locationRef.current = loc;
        // Reload data after getting location to calculate distances
        loadData();
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function toRad(deg: number): number {
    return deg * (Math.PI/180);
  }

  function renderSupermarket({ item }: { item: Supermarket }) {
    return (
      <View style={styles.supermarketCard}>
        <View style={styles.supermarketIcon}>
          <Text style={styles.iconText}>🏪</Text>
        </View>
        <View style={styles.supermarketInfo}>
          <Text style={styles.supermarketName}>{item.name}</Text>
          {item.address && <Text style={styles.supermarketAddress}>{item.address}</Text>}
          {item.distance !== undefined && (
            <Text style={styles.supermarketDistance}>{item.distance.toFixed(1)} km away</Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={supermarkets}
        keyExtractor={(item) => item.id}
        renderItem={renderSupermarket}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No supermarkets yet</Text>
            <Text style={styles.emptySubtext}>Add supermarkets to compare prices</Text>
          </View>
        }
        contentContainerStyle={supermarkets.length === 0 ? styles.emptyList : undefined}
      />
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddSupermarket')}
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
  supermarketCard: {
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
  supermarketIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  supermarketInfo: {
    flex: 1,
  },
  supermarketName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  supermarketAddress: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  supermarketDistance: {
    fontSize: 12,
    color: '#4CAF50',
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
