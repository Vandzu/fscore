import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default function Menu({ navigation }) {
  return (
    <View style={styles.menu}>
      <Button
        title="Resultados"
        onPress={() => navigation.navigate('History')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
