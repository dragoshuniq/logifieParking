import { NetworkType } from "@/constants/social.config";
import { type ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking, Pressable } from "react-native";

type Props = Omit<ComponentProps<typeof Pressable>, "onPress"> & {
  network: NetworkType;
};

export function SocialLink({ network, children, ...rest }: Props) {
  const { t } = useTranslation();

  const handlePress = async () => {
    try {
      await Linking.openURL(network.webLink);
    } catch {
      Alert.alert(
        t("common.error"),
        t("common.couldNotOpen", { name: network.name })
      );
    }
  };

  return (
    <Pressable onPress={handlePress} {...rest}>
      {children}
    </Pressable>
  );
}
