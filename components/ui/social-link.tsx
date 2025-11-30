import { NetworkType } from "@/constants/social.config";
import { type ComponentProps } from "react";
import { Alert, Linking, Pressable } from "react-native";

type Props = Omit<ComponentProps<typeof Pressable>, "onPress"> & {
  network: NetworkType;
};

export function SocialLink({ network, children, ...rest }: Props) {
  const handlePress = async () => {
    try {
      await Linking.openURL(network.webLink);
    } catch (error) {
      Alert.alert("Error", `Could not open ${network.name}`);
    }
  };

  return (
    <Pressable onPress={handlePress} {...rest}>
      {children}
    </Pressable>
  );
}
