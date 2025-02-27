import { StyleSheet,Text, View } from "react-native";
import { Link } from 'expo-router';
import { TextInput } from "react-native-gesture-handler";


//test

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.intro}>Lets get productive! 🚀</Text>
      <View style={styles.login}>
        <View style={styles.username}>
          <Text>Username:</Text>
          <TextInput/>
        </View>
        <View style={styles.password}>
          <Text>Password:</Text>
          <TextInput/>
        </View>
      </View>
      <Link href="/dashboard" style={styles.link}>Submit</Link>
    </View>
  );
}


//styling 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  intro: {
    fontSize: 24,
    fontWeight: "bold",
  },
  link: {
    marginTop: 10,
    color: "blue",
    fontWeight: "bold",
  },
  login: {
    marginTop: 20,
    flexDirection: "column",
    gap: 25,
    marginBottom: 20,
    
  },
  username: {
    flexDirection: "row",
    gap: 10,

  },
  password: {
    flexDirection: "row",
    gap: 10,
  },
}
)
