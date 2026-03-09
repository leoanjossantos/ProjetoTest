import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { addProduct, getSupermarkets, getCategories, generateId } from '../storage';
import { Supermarket, Category } from '../types';

type AddProductScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddProduct'>;
};

// URL validation helper
function isValidUrl(urlString: string): boolean {
  try {
    new URL(urlString);
    return true;
  } catch {
    return false;
  }
}

export default function AddProductScreen({ navigation }: AddProductScreenProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [supermarketsData, categoriesData] = await Promise.all([
      getSupermarkets(),
      getCategories(),
    ]);
    setSupermarkets(supermarketsData);
    setCategories(categoriesData);
    if (supermarketsData.length > 0) {
      setSelectedSupermarket(supermarketsData[0].id);
    }
    if (categoriesData.length > 0) {
      setSelectedCategory(categoriesData[0].id);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a product name');
      return;
    }
    const priceValue = parseFloat(price);
    if (!price.trim() || isNaN(priceValue)) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    if (priceValue < 0) {
      Alert.alert('Error', 'Price cannot be negative');
      return;
    }
    if (!selectedSupermarket) {
      Alert.alert('Error', 'Please select a supermarket');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    // Validate URL if provided
    const trimmedUrl = websiteUrl.trim();
    if (trimmedUrl && !isValidUrl(trimmedUrl)) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    const product = {
      id: generateId(),
      name: name.trim(),
      price: priceValue,
      supermarketId: selectedSupermarket,
      categoryId: selectedCategory,
      websiteUrl: trimmedUrl || undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const success = await addProduct(product);
    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save product');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Price *</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price"
          placeholderTextColor="#999"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Supermarket *</Text>
        <View style={styles.optionsContainer}>
          {supermarkets.map(supermarket => (
            <TouchableOpacity
              key={supermarket.id}
              style={[
                styles.optionButton,
                selectedSupermarket === supermarket.id && styles.optionButtonSelected
              ]}
              onPress={() => setSelectedSupermarket(supermarket.id)}
            >
              <Text style={[
                styles.optionText,
                selectedSupermarket === supermarket.id && styles.optionTextSelected
              ]}>
                {supermarket.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {supermarkets.length === 0 && (
          <Text style={styles.noOptions}>No supermarkets available. Add one first.</Text>
        )}

        <Text style={styles.label}>Category *</Text>
        <View style={styles.optionsContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.optionButton,
                selectedCategory === category.id && styles.optionButtonSelected
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.optionText,
                selectedCategory === category.id && styles.optionTextSelected
              ]}>
                {category.icon} {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Website URL (optional)</Text>
        <TextInput
          style={styles.input}
          value={websiteUrl}
          onChangeText={setWebsiteUrl}
          placeholder="Enter product URL"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextSelected: {
    color: 'white',
  },
  noOptions: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});