import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

export default function TermsModal({ visible, onAccept }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Terms & Conditions</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
            <Text style={styles.sectionTitle}>Welcome to Lyst</Text>
            <Text style={styles.text}>
              Lyst is a list management application designed to help you organize your shopping.
            </Text>

            <Text style={styles.sectionTitle}>Data & Privacy</Text>
            <Text style={styles.text}>
              • All your data is stored locally on your device{'\n'}
              • We do not collect, store, or transmit your personal information{'\n'}
              • We do not use analytics or tracking{'\n'}
              • Your lists and items remain completely private
            </Text>

            <Text style={styles.sectionTitle}>Use License</Text>
            <Text style={styles.text}>
              You are granted a limited, non-exclusive, non-transferable license to use Lyst for personal grocery list management. You may not:
              {'\n'}• Reverse engineer, decompile, or disassemble the app{'\n'}
              • Sell, rent, or lease the app{'\n'}• Remove or alter copyright notices
            </Text>

            <Text style={styles.sectionTitle}>Disclaimer</Text>
            <Text style={styles.text}>
              Lyst is provided "as is" without warranties of any kind. We are not liable for any damages or losses resulting from your use of this app.
            </Text>

            <Text style={styles.sectionTitle}>Changes to Terms</Text>
            <Text style={styles.text}>
              We reserve the right to modify these terms at any time. Your continued use of the app constitutes acceptance of updated terms.
            </Text>

            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.text}>
              For questions about these terms, please contact us through the app store.
            </Text>
          </ScrollView>

          <View style={styles.checkboxContainer}>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.customCheckbox, accepted && styles.customCheckboxChecked]}
                onPress={() => setAccepted(!accepted)}
              >
                {accepted && (
                  <MaterialIcons name="check" size={16} color="#000" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxText} onPress={() => setAccepted(!accepted)}>
                I agree to the Terms & Conditions
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.acceptButton,
              !accepted && styles.acceptButtonDisabled,
            ]}
            onPress={handleAccept}
            disabled={!accepted}
          >
            <Text style={styles.acceptButtonText}>Accept & Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#7ed957',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7ed957',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 13,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 12,
  },
  checkboxContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCheckboxChecked: {
    backgroundColor: '#7ed957',
    borderColor: '#7ed957',
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#7ed957',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  acceptButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
});