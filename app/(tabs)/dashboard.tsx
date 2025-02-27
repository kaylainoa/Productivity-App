import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type TasksType = {
  id: number;
  title: string;
  completed: boolean;
}

type RootStackParamList = {
  Dashboard: undefined;
  Tasks: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function Dashboard() {
  const username = "Kayla";
  const [tasks, setTasks] = useState<TasksType[]>([]);
  const [pendingTasks, setPendingTasks] = useState<TasksType[]>([]);
  const [completionRate, setCompletionRate] = useState(0);
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  
  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('my-tasks');
      if (storedTasks !== null) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
        
        // Filter unfinished tasks
        const unfinishedTasks = parsedTasks.filter((task: TasksType) => !task.completed);
        setPendingTasks(unfinishedTasks);
        
        // Calculate completion rate
        if (parsedTasks.length > 0) {
          const completedCount = parsedTasks.filter((task: TasksType) => task.completed).length;
          const rate = Math.round((completedCount / parsedTasks.length) * 100);
          setCompletionRate(rate);
        } else {
          setCompletionRate(0);
        }
      } else {
        // If no tasks exist yet, set defaults to avoid errors
        setTasks([]);
        setPendingTasks([]);
        setCompletionRate(0);
      }
    } catch (error) {
      console.log('Error loading tasks:', error);
    }
  };
  
  useEffect(() => {
    // Load tasks when component mounts
    loadTasks();
  }, []);
  
  useEffect(() => {
    // Reload tasks when the screen comes into focus
    if (isFocused) {
      loadTasks();
    }
  }, [isFocused]);
  
  const toggleTaskCompletion = async (id: number) => {
    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
      
      await AsyncStorage.setItem('my-tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      
      // Update pending tasks
      const unfinishedTasks = updatedTasks.filter(task => !task.completed);
      setPendingTasks(unfinishedTasks);
      
      // Recalculate completion rate
      if (updatedTasks.length > 0) {
        const completedCount = updatedTasks.filter(task => task.completed).length;
        const rate = Math.round((completedCount / updatedTasks.length) * 100);
        setCompletionRate(rate);
      } else {
        setCompletionRate(0);
      }
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };
  
  const navigateToTasks = () => {
    navigation.navigate('Tasks');
  };
  
  const TaskItem = ({ item }: { item: TasksType }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskLeftContent}>
        <Checkbox 
          value={item.completed} 
          onValueChange={() => toggleTaskCompletion(item.id)} 
          color={item.completed ? '#439aff' : undefined}
        />
        <Text 
          style={[
            styles.taskTitle, 
            item.completed && styles.completedTaskTitle
          ]}
        >
          {item.title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#adb5bd" />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={40} color="#439aff" />
          </TouchableOpacity>
        </View>

        {/* Stats Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pendingTasks.length}</Text>
              <Text style={styles.statLabel}>Tasks Due</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Task Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Progress</Text>
            <TouchableOpacity onPress={navigateToTasks}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressCard}>
            <View style={styles.progressCardHeader}>
              <Text style={styles.progressTitle}>Daily Tasks</Text>
              <Text style={styles.progressValue}>{completionRate}%</Text>
            </View>
            <View style={styles.customProgressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${completionRate}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressDetails}>
              You've completed {tasks.length - pendingTasks.length} out of {tasks.length} tasks
            </Text>
          </View>
        </View>

        {/* Pending Tasks Section */}
        <View style={styles.pendingTasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Tasks</Text>
            <TouchableOpacity onPress={navigateToTasks}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.tasksCard}>
            {pendingTasks.length === 0 ? (
              <View style={styles.emptyTasksContainer}>
                <Ionicons name="checkmark-circle" size={48} color="#439aff" />
                <Text style={styles.emptyTasksText}>All tasks completed!</Text>
              </View>
            ) : (
              <FlatList
                data={pendingTasks.slice(0, 3)} // Show only first 3 pending tasks
                renderItem={({ item }) => <TaskItem item={item} />}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.taskSeparator} />}
              />
            )}
          </View>
        </View>

        {/* Action Cards Section */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionCardsContainer}>
            <TouchableOpacity style={styles.actionCard} onPress={navigateToTasks}>
              <Ionicons name="add-circle" size={24} color="#439aff" />
              <Text style={styles.actionCardText}>New Task</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="calendar" size={24} color="#439aff" />
              <Text style={styles.actionCardText}>Calendar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="stats-chart" size={24} color="#439aff" />
              <Text style={styles.actionCardText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Enhanced styling
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
  },
  profileButton: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#439aff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#439aff',
  },
  divider: {
    height: 40,
    width: 1,
    backgroundColor: '#e9ecef',
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#439aff',
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#439aff',
  },
  progressBar: {
    marginBottom: 12,
  },
  customProgressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#439aff',
    borderRadius: 4,
  },
  progressDetails: {
    fontSize: 14,
    color: '#6c757d',
  },
  pendingTasksSection: {
    marginBottom: 24,
  },
  tasksCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 100,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  taskLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskTitle: {
    fontSize: 16,
    color: '#212529',
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#adb5bd',
  },
  taskSeparator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginHorizontal: 8,
  },
  emptyTasksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyTasksText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#439aff',
    marginTop: 8,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionCardText: {
    marginTop: 8,
    fontSize: 14,
    color: '#212529',
    fontWeight: '500',
  }
});