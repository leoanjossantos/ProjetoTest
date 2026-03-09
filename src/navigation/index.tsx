import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import FoldersScreen from '../screens/FoldersScreen';
import SupermarketsScreen from '../screens/SupermarketsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import AddFolderScreen from '../screens/AddFolderScreen';
import AddSupermarketScreen from '../screens/AddSupermarketScreen';
import FolderDetailScreen from '../screens/FolderDetailScreen';

export type RootStackParamList = {
  Home: undefined;
  Products: undefined;
  Folders: undefined;
  Supermarkets: undefined;
  AddProduct: undefined;
  AddFolder: undefined;
  AddSupermarket: undefined;
  FolderDetail: { folderId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Products" component={ProductsScreen} />
        <Stack.Screen name="Folders" component={FoldersScreen} />
        <Stack.Screen name="Supermarkets" component={SupermarketsScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="AddFolder" component={AddFolderScreen} />
        <Stack.Screen name="AddSupermarket" component={AddSupermarketScreen} />
        <Stack.Screen name="FolderDetail" component={FolderDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
