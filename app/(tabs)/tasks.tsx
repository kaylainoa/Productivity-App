import { Text, TextInput, View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TasksType = {
    id: number;
    title: string;
    completed: boolean;
}

export default function TasksPage() {
    const todoData = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
        { id: 3, title: 'Task 3', completed: false },
        { id: 4, title: 'Task 4', completed: false },
        { id: 5, title: 'Task 5', completed: false },
        { id: 6, title: 'Task 6', completed: false },
        { id: 7, title: 'Task 7', completed: false },
        { id: 8, title: 'Task 8', completed: false },
    ];    

    const [tasks, setTasks] = useState<TasksType[]>(todoData);
    const [tasksText, setTasksText] = useState<string>('');
    const [showArchived, setShowArchived] = useState<boolean>(false);
    
    useEffect(() => {
        const getTasks = async () => {
            try {
                const tasks = await AsyncStorage.getItem('my-tasks');
                if (tasks !== null) {
                    setTasks(JSON.parse(tasks));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getTasks();
    }, []);

    const addTask = async () => {
        if (!tasksText.trim()) return;
        
        try {
            const newTask = {
                id: Math.random(),
                title: tasksText,
                completed: false,
            };
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            await AsyncStorage.setItem('my-tasks', JSON.stringify(updatedTasks));
            setTasksText("");
            Keyboard.dismiss();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTask = async (id: number) => {
        try {
            const newTasks = tasks.filter((task) => task.id !== id);
            await AsyncStorage.setItem('my-tasks', JSON.stringify(newTasks));
            setTasks(newTasks);
        }
        catch (error) {
            console.log(error);
        }
    }

    const completion = async (id: number) => {
        try {
            const newTasks = tasks.map((task) => {
                if (task.id === id) {
                    return {
                        ...task,
                        completed: !task.completed,
                    };
                }
                return task;
            });
            await AsyncStorage.setItem('my-tasks', JSON.stringify(newTasks));
            setTasks(newTasks);
        } catch (error) {
            console.log(error);
        }
    };

    // Get active (uncompleted) tasks
    const activeTasks = tasks.filter(task => !task.completed);
    // Get archived (completed) tasks
    const archivedTasks = tasks.filter(task => task.completed);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headertext}>
                {activeTasks.length === 0 ? (
                    <Text style={styles.completeheader}>Great job! All tasks are complete 😄</Text>
                ) : ( 
                    <>
                        <Text style={styles.header}>You Have {activeTasks.length} Tasks Pending</Text>
                        <Text style={styles.subheader}>Let's Get Things Done! ✅</Text>   
                    </>
                )}
            </View>
            {/* Search Bar */}
            <View style={styles.searchBar}> 
                <Ionicons name="search" size={24} color="#333"/>
                <TextInput placeholder="Search" 
                style={styles.searchInput} 
                clearButtonMode='always'/>
            </View>

            {/* Active Tasks */}
            <FlatList 
                data={[...activeTasks].reverse()} 
                keyExtractor={(item) => item.id.toString()} 
                renderItem={({item}) => <Tasks item={item} deleteTask={deleteTask} completion={completion} />}
                ListEmptyComponent={<Text style={styles.emptyText}>No pending tasks</Text>}
                ListFooterComponent={
                    archivedTasks.length > 0 ? (
                        <TouchableOpacity 
                            style={styles.toggleArchiveButton} 
                            onPress={() => setShowArchived(!showArchived)}
                        >
                            <Text style={styles.toggleArchiveText}>
                                {showArchived ? 'Hide Archived Tasks' : `Show Archived Tasks (${archivedTasks.length})`}
                            </Text>
                            <Ionicons 
                                name={showArchived ? "chevron-up" : "chevron-down"} 
                                size={20} 
                                color="#4630EB"
                            />
                        </TouchableOpacity>
                    ) : null
                }
            />

            {/* Archived Tasks Section (Conditionally rendered) */}
            {showArchived && archivedTasks.length > 0 && (
                <View style={styles.archivedSection}>
                    <Text style={styles.archivedHeader}>Archived Tasks</Text>
                    <FlatList 
                        data={[...archivedTasks].reverse()} 
                        keyExtractor={(item) => item.id.toString()} 
                        renderItem={({item}) => <Tasks item={item} deleteTask={deleteTask} completion={completion} />}
                        style={styles.archivedList}
                    />
                </View>
            )}

            <KeyboardAvoidingView style={styles.addTaskFooter} behavior="padding" keyboardVerticalOffset={15}>
                <TextInput 
                    placeholder='Add a New Task' 
                    value={tasksText} 
                    onChangeText={(text) => setTasksText(text)} 
                    style={styles.addTaskInput}
                />
                <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
                    <Ionicons name="add" size={24} color="#fff"/>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

//component 
const Tasks = ({ item, deleteTask, completion } : {
    item: TasksType, 
    deleteTask: (id: number) => void;
    completion: (id: number) => void;
}) => (
    <View style={styles.tasks}>
        <View style={styles.tasksInfo}>
            <Checkbox value={item.completed} onValueChange={() => completion(item.id)} color={item.completed ? '#4630EB' : undefined}/>
            <Text 
                style={[
                    styles.tasksText, 
                    item.completed && {textDecorationLine: 'line-through', color: '#888'}
                ]}
            >
                {item.title}
            </Text>   
        </View>
        <TouchableOpacity 
            onPress={() => {
                deleteTask(item.id);
                alert("Deleted " + item.title);
            }}>
            <Ionicons name="trash" size={20} color="#333"/>
        </TouchableOpacity>
    </View>
);

//styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    //header
    headertext: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 20,
        paddingTop: 20,
    },
    header: {
        fontSize: 24,   
        fontWeight: 'bold',
    },
    subheader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    completeheader: {
        fontSize: 24,   
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tasks: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tasksInfo: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        gap: 10, 
        marginHorizontal: 15,
        marginBottom: 10,
    }, 
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    tasksText: {
        fontSize: 16,
        color: '#333',
    },
    addTaskFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 10,
    },
    addTaskInput: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    addTaskButton: {
        backgroundColor: '#4630EB',
        padding: 8,
        borderRadius: 10,
        marginRight: 15,
    },
    archivedSection: {
        marginTop: 10,
    },
    archivedHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
        marginBottom: 5,
        color: '#555',
    },
    archivedList: {
        maxHeight: 250,
    },
    toggleArchiveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
    },
    toggleArchiveText: {
        color: '#4630EB',
        fontWeight: 'bold',
        marginRight: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontStyle: 'italic',
    }
})