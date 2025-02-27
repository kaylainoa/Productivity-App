import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';

export default function ProgressBar() {
    const [value, setValue] = useState(0);

    return (
        <View style={styles.container}>
           <CircularProgress
            value={60}
            radius={120}
            inActiveStrokeOpacity={0.5}
            activeStrokeWidth={20}
            inActiveStrokeWidth={20}
            progressValueStyle={{ fontWeight: '100', color: 'black' }}
            />

            <StatusBar style="auto" />
        </View>
    );
}

//styling

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});