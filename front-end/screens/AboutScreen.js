import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function AboutScreen({ onBack, onShowTerms }) {
  const appVersion = '1.0.2';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow-back" size={28} color="#7ed957" />
        </TouchableOpacity>
        <Text style={styles.title}>About</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <Text style={styles.appName}>Lyst</Text>
          <Text style={styles.version}>v{appVersion}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the App</Text>
          <Text style={styles.description}>
            Lyst is a simple, lightweight list manager that keeps all your shopping organized. Your data stays on your device — nothing is shared or tracked.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Legal</Text>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={onShowTerms}
          >
            <MaterialIcons name="description" size={20} color="#7ed957" />
            <Text style={styles.linkText}>Terms & Conditions</Text>
            <MaterialIcons name="chevron-right" size={20} color="#7ed957" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Open Source</Text>
          <Text style={styles.description}>
            This app is built with:
          </Text>
          <View style={styles.libraryList}>
            <View style={styles.libraryItem}>
              <Text style={styles.libraryName}>React Native</Text>
              <Text style={styles.libraryDesc}>JavaScript framework</Text>
            </View>
            <View style={styles.libraryItem}>
              <Text style={styles.libraryName}>Expo</Text>
              <Text style={styles.libraryDesc}>Mobile app platform</Text>
            </View>
            <View style={styles.libraryItem}>
              <Text style={styles.libraryName}>AsyncStorage</Text>
              <Text style={styles.libraryDesc}>Local data persistence</Text>
            </View>
            <View style={styles.libraryItem}>
              <Text style={styles.libraryName}>expo-blur</Text>
              <Text style={styles.libraryDesc}>Blur effect component</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <Text style={styles.description}>
            Found a bug or have feedback? Please leave a review on the App Store or Play Store.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made by @BrianStatesThat</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7ed957',
  },
  version: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7ed957',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  libraryList: {
    gap: 10,
  },
  libraryItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    padding: 12,
  },
  libraryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7ed957',
    marginBottom: 4,
  },
  libraryDesc: {
    fontSize: 12,
    color: '#888',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
  },
});