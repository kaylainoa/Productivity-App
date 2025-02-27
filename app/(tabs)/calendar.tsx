import { Text, View, StyleSheet } from 'react-native';


export default function Calendar() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Schedule at a Glance</Text>
      <Text style={styles.subheader}>Stay on top of your tasks and events</Text>
    </View>
  );
}

//styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subheader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },
  }
  )
  