import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onDelete }) {
  return (
    <FlatList
      data={todos}
      renderItem={({ item }) => (
        <TodoItem item={item} onToggle={onToggle} onDelete={onDelete} />
      )}
      keyExtractor={item => item.id}
      style={styles.todoList}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No grocery items yet!</Text>
          <Text style={styles.emptySubtext}>Add your first grocery item above</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  todoList: {
    flex: 1,
    paddingHorizontal: 20,
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
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
});


