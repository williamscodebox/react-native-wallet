import { Href, Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  const About = "/about" as Href;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "aqua",
      }}
    >
      <Text style={{ color: "gray" }}>
        Edit app/index.tsx to edit this screen.
      </Text>
      <Link href={About}>About</Link>
    </View>
  );
}
