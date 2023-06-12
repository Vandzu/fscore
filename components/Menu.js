import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React, { useEffect,useState } from 'react';


export default function Menu({ navigation, gameStart }) {
  const route = useRoute();
  const [showConfigButton, setShowConfigButton] = useState(true);

  useEffect(() => {
    setShowConfigButton(!gameStart);
  }, [gameStart]);
  
  return (
    <View style={styles.menu}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={styles.buttonText}>Resultados</Text>
      </TouchableOpacity>
      {showConfigButton  && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Config')}
        >
          <Text style={styles.buttonText}>Configurações</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#2196f3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    elevation: 3,
    marginBottom: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hideButton: {
    display: 'none',
  }
  
});
