import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { addFolder, generateId } from '../storage';

type AddFolderScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddFolder'>;
};

export default function AddFolderScreen({ navigation }: AddFolderScreenProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    const folder = {
      id: generateId(),
      name: name.trim(),
      description: description.trim() || undefined,
      productIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const success = await addFolder(folder);
    if (success) {
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Failed to save folder');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Folder Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter folder name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Description (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter folder description"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Create Folder</Text>
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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