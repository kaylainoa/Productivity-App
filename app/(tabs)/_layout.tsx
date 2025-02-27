import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs 
        screenOptions={{
        tabBarActiveTintColor: '#439aff', // Highlight active tab
        headerStyle: { backgroundColor: '#b5b5b5' },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#ececec' },
      }}
    >
      <Tabs.Screen name="dashboard" 
      options={{ 
        title: 'Dashboard', 
        tabBarIcon: ({color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />), }} />
      
      <Tabs.Screen name="tasks"
       options={{ title: 'Tasks',
        tabBarIcon: ({color, focused }) => (
            <Ionicons name={focused ? 'checkmark-circle' : 'checkmark-circle-outline'} size={24} color={color} />), }} />

      <Tabs.Screen name="calendar" 
      options={{ title: 'Calendar',
        tabBarIcon: ({color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={24} color={color} />), }} />
     </Tabs>

     
  );
}

//styling

