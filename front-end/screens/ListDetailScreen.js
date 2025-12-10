import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import TodoItem from '../components/TodoItem';
import AddItemModal from '../components/AddItemModal';

export default function ListDetailScreen({
  list,
  onBack,
  onAddItem,
  onDeleteItem,
  onToggleItem,
  onEditItem,
  onRenameList,
  onDeleteList,
  addItemVisible,
  onCloseAddItem,
  onConfirmAddItem,
  listId,
}) {
  const [sortOrder, setSortOrder] = useState('newest');

  // RENAME LIST modal state
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameName, setRenameName] = useState(list.name || '');
  const [renameDescription, setRenameDescription] = useState(list.description || '');

  // EDIT ITEM modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingText, setEditingText] = useState('');

  const getSortedItems = () => {
    const items = list.items || [];

    // keep completed items at the bottom
    const incomplete = items.filter(i => !i.completed);
    const completed = items.filter(i => i.completed);

    const compareFn = (a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    };

    incomplete.sort(compareFn);
    completed.sort(compareFn);

    // show incomplete first (sorted), then completed (sorted)
    return [...incomplete, ...completed];
  };

  const items = list.items || [];
  const completedCount = items.filter(item => item.completed).length;

  const handleDeleteList = () => {
    Alert.alert(
      'Delete List',
      `Are you sure you want to delete "${list.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDeleteList();
            onBack();
          }
        }
      ]
    );
  };

  // Open edit item modal
  const openEditItem = (item) => {
    setEditingItem(item);
    setEditingText(item.name || '');
    setShowEditModal(true);
  };

  const saveEditedItem = () => {
    if (!editingText.trim()) {
      Alert.alert('Error', 'Item name cannot be empty');
      return;
    }
    onEditItem(editingItem.id, editingText.trim());
    setShowEditModal(false);
    setEditingItem(null);
    setEditingText('');
  };

  const openRenameList = () => {
    setRenameName(list.name || '');
    setRenameDescription(list.description || '');
    setShowRenameModal(true);
  };

  const saveRenameList = () => {
    if (!renameName.trim()) {
      Alert.alert('Error', 'List name cannot be empty');
      return;
    }
    onRenameList(renameName.trim(), (renameDescription || '').trim());
    setShowRenameModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow-back" size={28} color="#7ed957" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.listTitle}>{list.name}</Text>
          {list.description && (
            <Text style={styles.description}>{list.description}</Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={openRenameList} style={{ marginRight: 12 }} accessibilityLabel="Edit list" accessibilityHint="Edit the list name and description">
            <MaterialIcons name="edit" size={22} color="#7ed957" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteList}
            accessibilityLabel="Delete list"
            accessibilityHint="Permanently deletes this list after confirmation"
            style={{ padding: 6 }}
          >
            <MaterialIcons name="delete-outline" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort and Counter */}
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
        >
          <MaterialIcons name="sort" size={18} color="#7ed957" />
          <Text style={styles.sortText}>
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.counterCard}>
          <Text style={styles.counterText}>
            {completedCount} of {items.length} done
          </Text>
        </View>
      </View>

      {/* Items List */}
      <FlatList
        data={getSortedItems()}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={() => onToggleItem(item.id)}
            onDelete={() => onDeleteItem(item.id)}
            onEdit={() => openEditItem(item)}
          />
        )}
        keyExtractor={item => item.id}
        style={styles.itemsList}
        contentContainerStyle={styles.itemsContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items yet</Text>
            <Text style={styles.emptySubtext}>Tap + to add your first item</Text>
          </View>
        }
      />

      {/* Add Item Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={onAddItem}
      >
        <MaterialIcons name="add" size={32} color="#000" />
      </TouchableOpacity>

      <AddItemModal
        visible={addItemVisible}
        onClose={onCloseAddItem}
        onConfirm={(itemName) => {
          onConfirmAddItem(listId, itemName);
          onCloseAddItem();
        }}
      />

      {/* Edit Item Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.title}>Edit Item</Text>
            <TextInput
              style={modalStyles.input}
              value={editingText}
              onChangeText={setEditingText}
              placeholder="Item name"
              placeholderTextColor="#666"
            />
            <View style={modalStyles.buttons}>
              <TouchableOpacity style={modalStyles.cancelButton} onPress={() => setShowEditModal(false)}>
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modalStyles.saveButton} onPress={saveEditedItem}>
                <Text style={modalStyles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rename List Modal */}
      <Modal visible={showRenameModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <Text style={modalStyles.title}>Edit List</Text>
            <TextInput
              style={modalStyles.input}
              value={renameName}
              onChangeText={setRenameName}
              placeholder="List name"
              placeholderTextColor="#666"
            />
            <TextInput
              style={[modalStyles.input, { minHeight: 80 }]}
              value={renameDescription}
              onChangeText={setRenameDescription}
              placeholder="Description (optional)"
              placeholderTextColor="#666"
              multiline
            />
            <View style={modalStyles.buttons}>
              <TouchableOpacity style={modalStyles.cancelButton} onPress={() => setShowRenameModal(false)}>
                <Text style={modalStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={modalStyles.saveButton} onPress={saveRenameList}>
                <Text style={modalStyles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
    padding: 16,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  cancelText: { color: '#fff', fontWeight: '600' },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#7ed957',
  },
  saveText: { color: '#000', fontWeight: '700' },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statsContainer: {
    padding: 20,
    gap: 12,
  },
  sortButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sortText: {
    color: '#7ed957',
    fontWeight: '600',
    fontSize: 14,
  },
  counterCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    padding: 12,
  },
  counterText: {
    color: '#7ed957',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
  itemsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemsContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 20,
    color: '#7ed957',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7ed957',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7ed957',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
});