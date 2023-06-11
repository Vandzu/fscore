
import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Menu from "./Menu";

export default function History({navigation}) {
    const [gamesState, setGamesState] = useState([]);

    const renderGames = () => {
        return gamesState.map(item => (
            <View>
                <Text>
                    ${`${item.id} - Time1: ${item.team1} X Time2: ${item.team2}`}
                </Text>
            </View>
        ))
    }

    const getGames = async () => {
        const games = await AsyncStorage.getItem('games');
        const gamesCopy = JSON.parse(games);
        console.log('gamesCopy: ', gamesCopy);
        setGamesState(gamesCopy);
    }

    useEffect(() => {
        getGames();
    }, [])

    return (
        <View>
            <View>
                <Text>
                    Histórico de partidas
                </Text>
            </View>
            <View>
                {renderGames()}
            </View>
            {/* <Menu navigation={navigation}/> */}
        </View>
    )
}