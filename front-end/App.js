import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  Text, 
  View, 
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import ListDetailScreen from './screens/ListDetailScreen';
import CreateListModal from './components/CreateListModal';

const STORAGE_KEY = '@grocerylists';

export default function App() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    loadLists();
  }, []);

  useEffect(() => {
    saveLists();
  }, [lists]);

  useEffect(() => {
    // focus the input when it becomes visible
    if (searchVisible && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchVisible]);

  const saveLists = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (error) {
      console.error('Error saving lists:', error);
    }
  };

  const loadLists = async () => {
    try {
      const savedLists = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLists !== null) {
        const parsed = JSON.parse(savedLists);
        setLists(parsed || []);
        setSelectedListId(null);
      } else {
        const defaultList = {
          id: Date.now().toString(),
          name: 'Grocery Shopping',
          description: '',
          items: [],
          createdAt: new Date().toISOString(),
        };
        setLists([defaultList]);
        setSelectedListId(null);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
      setLists([]);
      setSelectedListId(null);
    }
  };

  const createList = (name, description) => {
    const newList = {
      id: Date.now().toString(),
      name,
      description,
      items: [],
      createdAt: new Date().toISOString(),
    };
    setLists([...lists, newList]);
    setShowCreateList(false);
  };

  const deleteList = (listId) => {
    setLists(lists.filter(l => l.id !== listId));
    if (selectedListId === listId) {
      setSelectedListId(null);
    }
  };

  const updateList = (listId, updates = {}) => {
    setLists(prev =>
      prev.map(l => (l.id === listId ? { ...l, ...updates } : l))
    );
  };

  const addItem = (listId, itemName) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: [
            ...(list.items || []),
            {
              id: Date.now().toString(),
              name: itemName,
              completed: false,
              createdAt: new Date().toISOString(),
            }
          ]
        };
      }
      return list;
    }));
    setShowAddItem(false);
  };

  const deleteItem = (listId, itemId) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: (list.items || []).filter(item => item.id !== itemId)
        };
      }
      return list;
    }));
  };

  const toggleItem = (listId, itemId) => {
    setLists(prevLists =>
      prevLists.map(list => {
        if (list.id !== listId) return list;

        const items = [...(list.items || [])];
        const idx = items.findIndex(i => i.id === itemId);
        if (idx === -1) return list;

        const toggled = { ...items[idx], completed: !items[idx].completed };
        items.splice(idx, 1);
        if (toggled.completed) items.push(toggled);
        else items.unshift(toggled);

        return { ...list, items };
      })
    );
  };

  const editItem = (listId, itemId, newName) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: (list.items || []).map(item =>
            item.id === itemId 
              ? { ...item, name: newName }
              : item
          )
        };
      }
      return list;
    }));
  };

  const selectedList = lists.find(l => l.id === selectedListId);
  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If a list is selected, show detail view
  if (selectedList) {
    return (
      <ListDetailScreen
        list={selectedList}
        onBack={() => setSelectedListId(null)}
        onAddItem={() => setShowAddItem(true)}
        onDeleteItem={(itemId) => deleteItem(selectedListId, itemId)}
        onToggleItem={(itemId) => toggleItem(selectedListId, itemId)}
        onEditItem={(itemId, newName) => editItem(selectedListId, itemId, newName)}
        onRenameList={(name, description) => updateList(selectedListId, { name, description })}
        onDeleteList={() => deleteList(selectedListId)}
        addItemVisible={showAddItem}
        onCloseAddItem={() => setShowAddItem(false)}
        onConfirmAddItem={addItem}
        listId={selectedListId}
      />
    );
  }

  // Lists view (Landing Page)
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lyst</Text>
        <TouchableOpacity
          onPress={() => {
            // toggle search visibility
            setSearchVisible(v => !v);
            // clear query when hiding
            if (searchVisible) setSearchQuery('');
          }}
          accessibilityLabel="Search"
          accessibilityHint="Show search input"
        >
          <MaterialIcons name={searchVisible ? "close" : "search"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {searchVisible ? (
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            ref={searchRef}
            key={searchVisible ? 'search-on' : 'search-off'}
            style={styles.searchInput}
            placeholder="Search your lists..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            returnKeyType="search"
          />
        </View>
      ) : null}

      <FlatList
        data={filteredLists}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listCard}
            onPress={() => setSelectedListId(item.id)}
          >
            <View>
              <Text style={styles.listName}>{item.name}</Text>
              <Text style={styles.listCount}>
                {(item.items || []).length} items
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#7ed957" />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No lists yet</Text>
            <Text style={styles.emptySubtext}>Create your first list</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateList(true)}
      >
        <MaterialIcons name="add" size={32} color="#000" />
      </TouchableOpacity>

      <CreateListModal
        visible={showCreateList}
        onClose={() => setShowCreateList(false)}
        onCreate={createList}
      />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7ed957',
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  listCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  listName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  listCount: {
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
});
