import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  Text, 
  View, 
  StyleSheet,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import GlassAlert from './components/GlassAlert';

const STORAGE_KEY = '@todos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});

  // Load todos from storage when app starts
  useEffect(() => {
    loadTodos();
  }, []);

  // Save todos to storage whenever todos change
  useEffect(() => {
    saveTodos();
  }, [todos]);

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTodos !== null) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const showGlassAlert = (title, message, buttons) => {
    setAlertConfig({ title, message, buttons });
    setAlertVisible(true);
  };

  const addTodo = () => {
    if (inputText.trim() === '') {
      showGlassAlert('Error', 'Please enter grocery item', [
        { text: 'OK', style: 'cancel' }
      ]);
      return;
    }
    
    const newTodo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
    };
    
    setTodos([...todos, newTodo]);
    setInputText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    showGlassAlert(
      'Delete Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setTodos(todos.filter(todo => todo.id !== id))
        }
      ]
    );
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image 
            source={require('./assets/icon.png')} 
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.title}>GrocerLyst</Text>
        </View>
      </View>

      <View style={styles.counterContainer}>
        <View style={styles.counterCard}>
          <Text style={styles.counterText}>
            {completedCount} of {totalCount} items added
          </Text>
        </View>
      </View>

      <AddTodo 
        inputText={inputText} 
        onChangeText={setInputText} 
        onSubmit={addTodo} 
      />

      <TodoList 
        todos={todos} 
        onToggle={toggleTodo} 
        onDelete={deleteTodo} 
      />

      <GlassAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={() => setAlertVisible(false)}
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
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  counterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  counterCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 16,
    color: '#7ed957',
    fontWeight: '600',
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
    borderRadius: 7,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7ed957',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 5,
  },
});
