import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import TodoItem from '../components/TodoItem';
import AddItemModal from '../components/AddItemModal';
import AlertModal from '../components/AlertModal';

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
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameName, setRenameName] = useState(list.name || '');
  const [renameDescription, setRenameDescription] = useState(list.description || '');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [deleteListAlert, setDeleteListAlert] = useState(false);
  const [deleteItemAlert, setDeleteItemAlert] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const getSortedItems = () => {
    const items = list.items || [];
    const incomplete = items.filter(i => !i.completed);
    const completed = items.filter(i => i.completed);

    const compareFn = (a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    };

    incomplete.sort(compareFn);
    completed.sort(compareFn);

    return [...incomplete, ...completed];
  };

  const items = list.items || [];
  const completedCount = items.filter(item => item.completed).length;

  const openEditItem = (item) => {
    setEditingItem(item);
    setEditingText(item.name || '');
    setShowEditModal(true);
  };

  const saveEditedItem = () => {
    if (!editingText.trim()) {
      alert('Item name cannot be empty');
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
      alert('List name cannot be empty');
      return;
    }
    onRenameList(renameName.trim(), (renameDescription || '').trim());
    setShowRenameModal(false);
  };

  const handleDeleteList = () => {
    setDeleteListAlert(true);
  };

  const confirmDeleteList = () => {
    onDeleteList();
    onBack();
  };

  const handleDeleteItem = (itemId) => {
    setDeleteItemId(itemId);
    setDeleteItemAlert(true);
  };

  const confirmDeleteItem = () => {
    if (deleteItemId) {
      onDeleteItem(deleteItemId);
      setDeleteItemId(null);
    }
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
          <TouchableOpacity onPress={openRenameList} style={{ marginRight: 12 }}>
            <MaterialIcons name="edit" size={22} color="#7ed957" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteList}
            style={{ padding: 6 }}
          >
            <MaterialIcons name="delete-outline" size={24} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>

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

      <FlatList
        data={getSortedItems()}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={() => onToggleItem(item.id)}
            onDelete={() => handleDeleteItem(item.id)}
            onEdit={() => openEditItem(item)}
          />
        )
        }
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
        <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Edit Item</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={24} color="#7ed957" />
              </TouchableOpacity>
            </View>
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
        <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={modalStyles.overlay}>
          <View style={modalStyles.modal}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Edit List</Text>
              <TouchableOpacity onPress={() => setShowRenameModal(false)}>
                <MaterialIcons name="close" size={24} color="#7ed957" />
              </TouchableOpacity>
            </View>
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

      {/* Delete List Alert */}
      <AlertModal
        visible={deleteListAlert}
        title="Delete List"
        message={`Are you sure you want to delete "${list.name}"? This action cannot be undone.`}
        buttons={[
          { text: 'Cancel', onPress: () => {} },
          { text: 'Delete', type: 'destructive', onPress: confirmDeleteList },
        ]}
        onDismiss={() => setDeleteListAlert(false)}
      />

      {/* Delete Item Alert */}
      <AlertModal
        visible={deleteItemAlert}
        title="Delete Item"
        message="Are you sure you want to remove this item? This action cannot be undone."
        buttons={[
          { text: 'Cancel', onPress: () => {} },
          { text: 'Delete', type: 'destructive', onPress: confirmDeleteItem },
        ]}
        onDismiss={() => setDeleteItemAlert(false)}
      />

    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
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
    maxWidth: 350,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    flex: 1,
  },
  input: {
    backgroundColor: '#000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    marginBottom: 12,
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