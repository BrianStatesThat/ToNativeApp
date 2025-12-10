import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

const MAX_LENGTH = 50;

export default function AddItemModal({ visible, onClose, onConfirm }) {
  const [itemName, setItemName] = useState('');

  const handleConfirm = () => {
    if (itemName.trim() === '') {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }
    onConfirm(itemName.trim());
    setItemName('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
      
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="arrow-back" size={28} color="#7ed957" />
            </TouchableOpacity>
            <Text style={styles.title}>Add Item</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Item Name (Required)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="e.g., Buy groceries"
                placeholderTextColor="#666"
                value={itemName}
                onChangeText={(text) => setItemName(text.slice(0, MAX_LENGTH))}
                maxLength={MAX_LENGTH}
              />
              <Text style={styles.charCount}>
                {itemName.length}/{MAX_LENGTH}
              </Text>
            </View>

            <Text style={styles.label}>Optional Notes</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Add details about the item..."
              placeholderTextColor="#666"
              multiline
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleConfirm}>
              <MaterialIcons name="add" size={18} color="#000" />
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
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
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    padding: 20,
    width: '100%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 12,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  notesInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginBottom: 12,
    paddingRight: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7ed957',
    borderRadius: 10,
    gap: 6,
  },
  addText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
});