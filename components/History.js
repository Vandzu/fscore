import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Menu from "./Menu";

export default function History({ navigation }) {
  const [gamesState, setGamesState] = useState([]);

  const renderGames = () => {
    return gamesState
      .filter((item, index) => item.id != null && item.id !== undefined && item.id !== '' && index !== gamesState.length - 1)
      .map((item, index) => (
        <View style={styles.gameContainer} key={item.id}>
          <Text style={styles.gameText}>
            {`${item.id} - Time1: ${item.team1} X Time2: ${item.team2}`}
          </Text>
        </View>
      ));
  };

  const getGames = async () => {
    const games = await AsyncStorage.getItem("games");
    const gamesCopy = JSON.parse(games);
    setGamesState(gamesCopy);
  };

  useEffect(() => {
    getGames();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Histórico de Partidas</Text>
      </View>
      <ScrollView contentContainerStyle={styles.gamesContainer}>
        {renderGames()}
      </ScrollView>
      {/* <Menu navigation={navigation}/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  gamesContainer: {
    flexGrow: 1,
  },
  gameContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 4,
  },
  gameText: {
    fontSize: 16,
  },
});
