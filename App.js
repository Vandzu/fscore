import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Score from './components/Score';
import History from './components/History'
import Config from './components/Config'
import Toast from 'react-native-toast-message';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Score">
        <Stack.Screen name="Score" component={Score} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Config" component={Config} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  )
}


