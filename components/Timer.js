import { useState, useEffect } from "react";
import { View, Text } from "react-native";

export default function Timer ({pause}) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        if (!pause) {
            const interval = setInterval(() => {
                if (!pause) {
                    setTime((prevTime) => prevTime + 1);
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [pause]);

    const handleTime = () => {
        let timeParsed = '';
        let seconds = time;

        if (time > 59) {
            const minutes = parseInt(time / 60);
            seconds = parseInt(seconds % 60);
            seconds = `${seconds < 10 ? '0' : ''}${seconds}`;
            timeParsed = `${minutes < 10 ? '0' : ''}${minutes}:${seconds}`;
        } else {
            seconds = `${seconds < 10 ? '0' : ''}${seconds}`
            timeParsed = `00:${seconds}`
        }
        return timeParsed;
    }

    return (
        <View styles={{width: 200}}>
            <Text>
                {handleTime()}
            </Text>
        </View>
    )
}