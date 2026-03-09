# SupermarketPriceCompare

A cross-platform mobile application for collecting and organizing supermarket product information. Users can gather product data from nearby supermarkets, organize them into folders, and categorize all products for easy comparison and reference.

## Features

- Discover nearby supermarkets using location services
- Collect and store product information from supermarket websites
- Organize products into custom folders
- Categorize products for easy browsing
- Offline access to all collected data
- Cross-platform support (iOS, Android, Web)

## Prerequisites

### Required Software

- **Node.js** (LTS version 18 or higher)
- **npm** or **yarn** (npm comes with Node.js)
- **Xcode** (for iOS development) - Available on Mac App Store
- **CocoaPods** (`sudo gem install cocoapods`)
- **Watchman** (`brew install watchman`)

### Apple Developer Account (for iOS Simulator)

- Free Apple ID works for running on iOS Simulator
- Paid developer account required for physical device deployment

## Installation

### 1. Clone the Repository

```bash
cd /Users/leandro/ProjetoTest
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages defined in `package.json`:
- Expo SDK 55
- React Navigation 7
- AsyncStorage
- expo-location

### 3. Install iOS Dependencies (macOS only)

```bash
cd ios && pod install && cd ..
```

## Running the Application

### Option 1: Start Development Server

```bash
npm start
```

This opens the Expo developer tools in your browser. Press the keys below to run on different platforms:

- **i**: Run on iOS Simulator
- **a**: Run on Android Emulator
- **w**: Run on Web

### Option 2: Run Directly

#### iOS Simulator

```bash
npm run ios
```

#### Android Emulator

```bash
npm run android
```

Note: You need to have Android Studio installed with an emulator configured.

#### Web Browser

```bash
npm run web
```

## Project Structure

```
/Users/leandro/ProjetoTest
├── App.tsx                 # Main app component
├── app.json               # Expo configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── index.ts               # Entry point
├── assets/                # Images and icons
└── src/
    ├── types/             # TypeScript type definitions
    │   └── index.ts       # Product, Folder, Category, Supermarket models
    ├── storage/           # Local data persistence
    │   └── index.ts       # AsyncStorage wrapper
    ├── navigation/        # React Navigation setup
    │   └── index.tsx      # Stack navigator
    ├── screens/           # App screens
    │   ├── HomeScreen.tsx
    │   ├── ProductsScreen.tsx
    │   ├── FoldersScreen.tsx
    │   ├── SupermarketsScreen.tsx
    │   ├── AddProductScreen.tsx
    │   ├── AddFolderScreen.tsx
    │   ├── AddSupermarketScreen.tsx
    │   └── FolderDetailScreen.tsx
    ├── components/        # Reusable UI components
    └── utils/             # Utility functions
```

## Tech Stack

- **Framework**: React Native with Expo SDK 55
- **Language**: TypeScript
- **State Management**: Local state with AsyncStorage
- **Navigation**: React Navigation 7 (native-stack)
- **Location**: expo-location

## Troubleshooting

### Metro Bundler Issues

If you encounter Metro bundler errors, try:

```bash
npx expo start --clear
```

### iOS Build Errors

Ensure CocoaPods are up to date:

```bash
cd ios && pod deintegrate && pod install && cd ..
```

### Location Permission Issues

The app requests location permission on first launch. If denied, enable manually in:
- **iOS**: Settings > Privacy > Location Services

### Node.js Version Issues

Use nvm to manage Node versions:

```bash
nvm install 18
nvm use 18
```

## License

Private - All rights reserved
