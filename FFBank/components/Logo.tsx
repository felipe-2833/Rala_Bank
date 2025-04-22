import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export function Logo() {
  return  (<View style={styles.logContainer}>
            <Text style={styles.appName}>R.</Text>
         </View>
  );
          
}
const styles = StyleSheet.create({
    logContainer: {
        backgroundColor: '#ED145B',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#ED145B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
      },
      appName: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ffffff',
        paddingHorizontal: 10,
      },
})
