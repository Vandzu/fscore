import { View, StyleSheet, Button } from "react-native";

export default function Menu({navigation}) {

    return (
        <View style={styles.menu}>
            <Button
                title="Placar"
                onPress={navigation.navigate('Score')}
            >
            </Button>
            <Button
                title='Histórico'
                onPress={navigation.navigate('History')}
            >
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    menu: {
        flexDirection: 'row'
    }
})