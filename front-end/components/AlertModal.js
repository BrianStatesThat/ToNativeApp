import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

export default function AlertModal({
  visible,
  title,
  message,
  buttons = [],
  onDismiss,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onDismiss}>
              <MaterialIcons name="close" size={24} color="#7ed957" />
            </TouchableOpacity>
          </View>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {buttons.map((btn, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.button,
                  btn.type === 'destructive' ? styles.destructiveButton : styles.cancelButton,
                ]}
                onPress={() => {
                  btn.onPress?.();
                  onDismiss();
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    btn.type === 'destructive' ? styles.destructiveText : styles.cancelText,
                  ]}
                >
                  {btn.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  alertBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
    width: '100%',
    maxWidth: 350,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  message: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: '#000',
    borderColor: '#333',
  },
  destructiveButton: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelText: {
    color: '#fff',
  },
  destructiveText: {
    color: '#fff',
  },
});