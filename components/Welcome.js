import { StyleSheet, Text } from "react-native"

export default function Welcome({ name, mail }) {
    return <Text style={styles.text}>Hello, {name} Your email is {mail}.</Text>;
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        marginBottom: 20
    }
})