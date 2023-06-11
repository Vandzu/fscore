import { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Timer from './Timer';
import Menu from './Menu';

export default function Score({navigation}) {
    const [goals1, setGoals1] = useState(0);
    const [goals2, setGoals2] = useState(0);
    const [gameStart, setGameStart] = useState(false);
    const [stateHistory, setStateHistory] = useState([]);
    const [pause, setPause] = useState(false);
    const [gamesState, setGamesState] = useState([]);
    const [currentGameState, setCurrentGameState] = useState(0);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const finishGame = async () => {
        try {
            setGoals1(0);
            setGoals2(0);
            const games = [...gamesState];
            const id = games[games.length - 1].id;
            games.push({
                id: id + 1,
                team1: 0,
                team2: 0,
            });
            await AsyncStorage.setItem('games', JSON.stringify(games));
            await AsyncStorage.setItem('currentGame', `${id + 1}`);
            setCurrentGameState(id + 1);
            setGameStart(false);
            setGamesState(games);
        } catch (err) {
            console.log(err);
        }
    }

    const handleGames = async (name, value) => {
        try {
            let games = [];
            if (!gamesState.length) {
                games = await AsyncStorage.getItem('games');
                if (!games) {
                    games = [{ id: 1, team1: 0, team2: 0}];
                    const arr = JSON.stringify(games);
                    await AsyncStorage.setItem('games', arr);
                } else {
                    games = JSON.parse(games);
                    setGamesState(games);
                }
            }

            if (!currentGameState) {
                const currentGame = await AsyncStorage.getItem('currentGame');
                if (!currentGame) {
                    await AsyncStorage.setItem('currentGame', '1');
                    setCurrentGameState(1);
                } else {
                    setCurrentGameState(currentGame);
                }
            }
            const gamesCopy = gamesState.length ? [...gamesState] : [...games];
            gamesCopy[gamesCopy.length - 1][name] = value;
            setGamesState(gamesCopy);
            await AsyncStorage.setItem('games', JSON.stringify(gamesCopy));
        } catch (err) {
            console.log(err);
        }
    }

    const getPreviousData = async () => {
        try {
            const games = await AsyncStorage.getItem('games');
            const currentGame = await AsyncStorage.getItem('currentGame');
            if (games) {
                const gamesCopy = JSON.parse(games);
                gamesCopy.forEach(item => {
                    if (item.id == currentGame) {
                        setGoals1(item.team1);
                        setGoals2(item.team2);
                    }
                })
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        handleGames('team1', goals1);
    }, [goals1]);

    useEffect(() => {
        handleGames('team2', goals2);
    }, [goals2]);

    useEffect(() => {
        getPreviousData();
    }, [])

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('App has come to the foreground!');
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log('AppState', appState.current);
            if (appState.current == 'background') {
                console.log('salvar o tempo...');
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const handleStateGame = () => {
        if (gameStart) {
            setPause(!pause)
        } else {
            setGameStart(true);
        }
    }

    const handleGoals = (name, value) => {
        if (stateHistory.length > 10) {
            const sHCopy = [...stateHistory];
            sHCopy.shift();
            setStateHistory(sHCopy);
        }
        switch (name) {
            case 'goals1':
                setStateHistory([...stateHistory, {
                    name: 'goals1',
                    value: goals1,
                }]);
                setGoals1(value);
                break;
            case 'goals2':
                setStateHistory([...stateHistory, {
                    name: 'goals2',
                    value: goals2,
                }]);
                setGoals2(value);
                break;
        }
    }

    const undo = () => {
        const obj = stateHistory[stateHistory.length - 1];
        switch (obj.name) {
            case 'goals1':
                setGoals1(obj.value);
                break;
            case 'goals2': {
                setGoals2(obj.value);
                break;
            }
        }
        const sHCopy = [...stateHistory];
        sHCopy.pop();
        setStateHistory(sHCopy);
    }

    return (
        <View style={styles.container}>
            <View style={styles.score}>
                <View style={styles.team}>
                    <Text>Time 1</Text>
                    <Text style={styles.goals1}>{goals1}</Text>
                    {gameStart && (
                        <TouchableOpacity
                            style={styles.btn1}
                            onPress={() => handleGoals('goals1', goals1 + 1)}
                        >
                            <Text style={{ color: "#fff" }}>
                                Gol
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.team}>
                    <Text>Time 2</Text>
                    <Text style={styles.goals2}>{goals2}</Text>
                    {gameStart && (
                        <TouchableOpacity
                            style={styles.btn2}
                            onPress={() => handleGoals('goals2', goals2 + 1)}
                        >
                            <Text>
                                Gol
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                {gameStart && (
                    <Timer pause={pause} />
                )}
            </View>
            <View style={styles.actionBtns}>
                <TouchableOpacity
                    style={styles.playBtn}
                    onPress={handleStateGame}
                >
                    <Text style={styles.playText}>
                        {`${gameStart ? (pause ? 'Retomar' : 'Pausar') : 'Começar'} jogo`}
                    </Text>
                </TouchableOpacity>
                {gameStart && (
                    <TouchableOpacity
                        style={styles.undoBtn}
                        disabled={!stateHistory.length}
                        onPress={undo}
                    >
                        <Text style={styles.undoText}>
                            Desfazer ação
                        </Text>
                    </TouchableOpacity>
                )}
                {gameStart && (
                    <TouchableOpacity
                        style={styles.finishGame}
                        onPress={finishGame}
                    >
                        <Text>
                            Finalizar jogo
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            {/* <Menu navigation={navigation}/> */}
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    score: {
        marginTop: 25,
        marginBottom: 10,
        borderRadius: 5,
        borderColor: "#ddd",
        borderWidth: 2,
        width: '90%',
        height: 200,
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    team: {
        flex: 1,
        alignItems: 'center'
    },
    btn1: {
        padding: 15,
        backgroundColor: '#293394',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    btn2: {
        padding: 15,
        backgroundColor: '#E0BE43',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    goals1: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#293394',
    },
    goals2: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#E0BE43'
    },
    actionBtns: {
    },
    playBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'green',
        marginBottom: 10
    },
    playText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    undoBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 4,
        borderColor: 'gray',
        borderWidth: 2,
        marginBottom: 10
    },
    undoText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'gray'
    },
    finishGame: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 4,
        borderColor: 'red',
        borderWidth: 2,
        marginBottom: 10
    }
});
