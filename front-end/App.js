import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  Text, 
  View, 
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import ListDetailScreen from './screens/ListDetailScreen';
import CreateListModal from './components/CreateListModal';
import TermsModal from './components/TermsModal';

const STORAGE_KEY = '@grocerylists';
const TERMS_ACCEPTED_KEY = '@termsAccepted';

export default function App() {
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    checkTermsAndLoadApp();
  }, []);

  useEffect(() => {
    // Only save if lists exist AND terms accepted
    if (lists.length > 0 && termsAccepted) {
      saveLists();
    }
  }, [lists]);

  useEffect(() => {
    if (searchVisible && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchVisible]);

  const checkTermsAndLoadApp = async () => {
    try {
      setIsLoading(true);
      const termsAcceptedBefore = await AsyncStorage.getItem(TERMS_ACCEPTED_KEY);
      
      if (!termsAcceptedBefore) {
        // First launch - show terms
        setShowTerms(true);
      } else {
        // User already accepted - load app
        setTermsAccepted(true);
        loadLists();
      }
    } catch (error) {
      console.error('Error checking terms:', error);
      setIsLoading(false);
    }
  };

  const handleTermsAccepted = async () => {
    try {
      await AsyncStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
      setTermsAccepted(true);
      setShowTerms(false);
      setIsLoading(true);
      await loadLists();
    } catch (error) {
      console.error('Error accepting terms:', error);
      setIsLoading(false);
    }
  };

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
      } else {
        const defaultList = {
          id: Date.now().toString(),
          name: 'Grocery Shopping',
          description: '',
          items: [],
          createdAt: new Date().toISOString(),
        };
        setLists([defaultList]);
      }
    } catch (error) {
      console.error('Error loading lists:', error);
      setLists([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createList = useCallback((name, description) => {
    const newList = {
      id: Date.now().toString(),
      name,
      description,
      items: [],
      createdAt: new Date().toISOString(),
    };
    setLists(prev => [...prev, newList]);
    setShowCreateList(false);
  }, []);

  const deleteList = useCallback((listId) => {
    setLists(prev => prev.filter(l => l.id !== listId));
    if (selectedListId === listId) {
      setSelectedListId(null);
    }
  }, [selectedListId]);

  const updateList = useCallback((listId, updates = {}) => {
    setLists(prev =>
      prev.map(l => (l.id === listId ? { ...l, ...updates } : l))
    );
  }, []);

  const addItem = useCallback((listId, itemName) => {
    setLists(prev => prev.map(list => {
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
  }, []);

  const deleteItem = useCallback((listId, itemId) => {
    setLists(prev => prev.map(list => {
      if (list.id === listId) {
        return {
          ...list,
          items: (list.items || []).filter(item => item.id !== itemId)
        };
      }
      return list;
    }));
  }, []);

  const toggleItem = useCallback((listId, itemId) => {
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
  }, []);

  const editItem = useCallback((listId, itemId, newName) => {
    setLists(prev => prev.map(list => {
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
  }, []);

  const selectedList = useMemo(() => 
    lists.find(l => l.id === selectedListId),
    [lists, selectedListId]
  );

  const filteredLists = useMemo(() => 
    lists.filter(list =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [lists, searchQuery]
  );

  // Show terms modal on first launch
  if (showTerms) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <TermsModal visible={showTerms} onAccept={handleTermsAccepted} />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7ed957" />
          <Text style={styles.loadingText}>Loading Lyst...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lyst</Text>
        <TouchableOpacity
          onPress={() => {
            setSearchVisible(v => !v);
            if (searchVisible) setSearchQuery('');
          }}
          accessibilityLabel="Search"
          accessibilityHint="Show search input"
        >
          <MaterialIcons name={searchVisible ? "close" : "search"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {searchVisible && (
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
      )}

      <FlatList
        data={filteredLists}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listCard}
            onPress={() => setSelectedListId(item.id)}
            activeOpacity={0.7}
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
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
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
        activeOpacity={0.8}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#7ed957',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
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
