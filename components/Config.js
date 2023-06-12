import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


export default function Config({ navigation }) {
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        title: 'Configurações',
      });
    }, [])
  );

  useEffect(() => {
    retrieveTeamNames();
  }, []);

  const retrieveTeamNames = async () => {
    try {
      const value = await AsyncStorage.getItem('teamNames');
      if (value !== null) {
        const namesArray = JSON.parse(value);
        setTeam1Name(namesArray[namesArray.length - 2]);
        setTeam2Name(namesArray[namesArray.length - 1]);
      }
    } catch (error) {
      console.log('Erro ao recuperar os nomes dos times:', error);
    }
  };

  const handleSave = async () => {
    if (!team1Name || !team2Name) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await AsyncStorage.setItem('teamNames', JSON.stringify([team1Name, team2Name]));
      setErrorMessage('');
      Toast.show({
        type: 'success',
        text1: 'Nomes dos times salvos',
        text2: 'Os nomes dos times foram salvos com sucesso.',
      });
      navigation.navigate('Score');
    } catch (error) {
      console.log('Erro ao salvar os nomes dos times:', error);
      Toast.show({
        type: 'error',
        text1: 'Nomes dos times não foram salvos',
        text2: 'Erro ao salvar os nomes dos times.',
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do Time 1"
        value={team1Name}
        onChangeText={text => setTeam1Name(text)}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do Time 2"
        value={team2Name}
        onChangeText={text => setTeam2Name(text)}
        required
      />
      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2196f3',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});
