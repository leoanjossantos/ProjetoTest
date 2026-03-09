import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { RootStackParamList } from '../navigation';
import { addSupermarket, generateId } from '../storage';

type AddSupermarketScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddSupermarket'>;
};

export default function AddSupermarketScreen({ navigation }: AddSupermarketScreenProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  async function getCurrentLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        setUseCurrentLocation(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());
    } catch (error) {
      Alert.alert('Error', 'Failed to get current location');
      setUseCurrentLocation(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a supermarket name');
      return;
    }

    const lat = latitude ? parseFloat(latitude) : undefined;
    const lng = longitude ? parseFloat(longitude) : undefined;

    if ((latitude && !lng) || (!latitude && lng)) {
      Alert.alert('Error', 'Please enter both latitude and longitude, or leave both empty');
      return;
    }

    const supermarket = {
      id: generateId(),
      name: name.trim(),
      address: address.trim() || undefined,
      websiteUrl: websiteUrl.trim() || undefined,
      latitude: lat,
      longitude: lng,
    };

    const success = await addSupermarket(supermarket);
    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save supermarket');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Supermarket Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter supermarket name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Address (optional)</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Website URL (optional)</Text>
        <TextInput
          style={styles.input}
          value={websiteUrl}
          onChangeText={setWebsiteUrl}
          placeholder="Enter website URL"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <TouchableOpacity 
          style={[styles.locationButton, useCurrentLocation && styles.locationButtonActive]}
          onPress={() => setUseCurrentLocation(!useCurrentLocation)}
        >
          <Text style={[styles.locationText, useCurrentLocation && styles.locationTextActive]}>
            {useCurrentLocation ? '✓ Use Current Location' : '📍 Use Current Location'}
          </Text>
        </TouchableOpacity>

        {!useCurrentLocation && (
          <>
            <Text style={styles.label}>Latitude (optional)</Text>
            <TextInput
              style={styles.input}
              value={latitude}
              onChangeText={setLatitude}
              placeholder="Enter latitude"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />

            <Text style={styles.label}>Longitude (optional)</Text>
            <TextInput
              style={styles.input}
              value={longitude}
              onChangeText={setLongitude}
              placeholder="Enter longitude"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Add Supermarket</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  locationButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  locationTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});