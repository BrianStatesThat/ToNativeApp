import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';

export default function ListManager({
  visible,
  lists,
  onCreateList,
  onDeleteList,
  onRenameList,
  onClose,
}) {
  const [newListName, setNewListName] = useState('');
  const [renamingId, setRenamingId] = useState(null);
  const [renamingText, setRenamingText] = useState('');

  const handleCreateList = () => {
    if (newListName.trim() === '') {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }
    onCreateList(newListName.trim());
    setNewListName('');
  };

  const handleRename = (id, currentName) => {
    setRenamingId(id);
    setRenamingText(currentName);
  };

  const saveRename = (id) => {
    if (renamingText.trim() === '') {
      Alert.alert('Error', 'Please enter a list name');
      return;
    }
    onRenameList(id, renamingText.trim());
    setRenamingId(null);
    setRenamingText('');
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>Manage Lists</Text>

          {/* Create New List */}
          <View style={styles.createSection}>
            <TextInput
              style={styles.input}
              placeholder="New list name..."
              placeholderTextColor="#666"
              value={newListName}
              onChangeText={setNewListName}
              maxLength={30}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateList}
            >
              <Text style={styles.createButtonText}>Create List</Text>
            </TouchableOpacity>
          </View>

          {/* Lists */}
          <FlatList
            data={lists}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                {renamingId === item.id ? (
                  <TextInput
                    style={styles.renameInput}
                    value={renamingText}
                    onChangeText={setRenamingText}
                    maxLength={30}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.listName}>{item.name}</Text>
                )}
                <View style={styles.actions}>
                  {renamingId === item.id ? (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={() => saveRename(item.id)}
                      >
                        <Text style={styles.actionButtonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() => setRenamingId(null)}
                      >
                        <Text style={styles.actionButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => handleRename(item.id, item.name)}
                      >
                        <Text style={styles.actionButtonText}>Rename</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => {
                          Alert.alert(
                            'Delete List',
                            `Delete "${item.name}"? This cannot be undone.`,
                            [
                              { text: 'Cancel', style: 'cancel' },
                              {
                                text: 'Delete',
                                style: 'destructive',
                                onPress: () => onDeleteList(item.id),
                              },
                            ]
                          );
                        }}
                      >
                        <Text style={styles.actionButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            )}
            keyExtractor={item => item.id}
            scrollEnabled={true}
            style={styles.listFlatList}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
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
  },
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    width: '85%',
    maxHeight: '80%',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  createSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.9)',
    paddingBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    color: '#fff',
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#7ed957',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  listFlatList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  listName: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  renameInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7ed957',
    padding: 10,
    color: '#000',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'rgba(126, 217, 87, 0.9)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
  },
  saveButton: {
    backgroundColor: 'rgba(126, 217, 87, 0.5)',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 100, 100, 0.3)',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#7ed957',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});