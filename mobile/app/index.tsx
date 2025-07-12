import { Href, Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const About = "/about" as Href;

  return (
    <View style={styles.container}>
      <Text style={{ color: "gray" }}>
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href={About}>About</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "aqua",
  },
});
