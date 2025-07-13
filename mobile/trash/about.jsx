import { View, Text } from "react-native";
import { Image } from "expo-image";
import Rose1 from "./../assets/images/rose1.jpg";
import React from "react";

const About = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "aqua",
      }}
    >
      <Text>About</Text>
      <Image source={Rose1} style={{ width: 100, height: 100 }}></Image>
    </View>
  );
};

export default About;
