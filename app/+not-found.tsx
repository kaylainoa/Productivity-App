import { View, StyleSheet, Text } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
    <Stack.Screen options={{ title: 'Oops! Page not found'}}/>
        <View style={styles.container}>
            <Text style={styles.header}>Whoops, we've got distracted 😟</Text>
            <Link href="/dashboard" style={styles.link}>Let's get back on Track!</Link>
        </View>
    </>
  );
}

//styling

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
},
    header: {
    fontSize: 24,
    fontWeight: 'bold',
},
  link: {
    marginTop: 10,
    color: "red",
  },
}
)
