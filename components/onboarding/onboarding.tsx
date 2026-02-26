import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

import { ThemedText } from "@/components/ui/themed-text";
import { ThemedView } from "@/components/ui/themed-view";
import { STORAGE_KEYS } from "@/constants/storage";
import { useThemedColors } from "@/hooks/use-themed-colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type OnboardingSlide = {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descriptionKey: string;
};

export function Onboarding() {
  const { t } = useTranslation();
  const { tint, icon } = useThemedColors("tint", "icon");
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides: OnboardingSlide[] = [
    {
      id: "parking",
      icon: <MaterialIcons name="map" size={120} color={tint} />,
      titleKey: "onboarding.parking.title",
      descriptionKey: "onboarding.parking.description",
    },
    {
      id: "fuel",
      icon: <FontAwesome6 name="gas-pump" size={120} color={tint} />,
      titleKey: "onboarding.fuel.title",
      descriptionKey: "onboarding.fuel.description",
    },
    {
      id: "driver",
      icon: (
        <MaterialCommunityIcons
          name="truck-fast"
          size={120}
          color={tint}
        />
      ),
      titleKey: "onboarding.driver.title",
      descriptionKey: "onboarding.driver.description",
    },
  ];

  const handleScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const goToNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleComplete = async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ONBOARDING_COMPLETE,
      "true"
    );
    router.replace("/(tabs)");
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={styles.iconContainer}>{item.icon}</View>
      <ThemedText style={styles.title}>{t(item.titleKey)}</ThemedText>
      <ThemedText style={styles.description}>
        {t(item.descriptionKey)}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    currentIndex === index ? tint : icon,
                  width: currentIndex === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          {currentIndex < slides.length - 1 ? (
            <>
              <Pressable
                onPress={handleComplete}
                style={styles.skipButton}
              >
                <ThemedText style={styles.skipText}>
                  {t("onboarding.skip")}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={goToNext}
                style={[styles.nextButton, { backgroundColor: tint }]}
              >
                <ThemedText style={styles.nextText}>
                  {t("onboarding.next")}
                </ThemedText>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={handleComplete}
              style={[
                styles.getStartedButton,
                { backgroundColor: tint },
              ]}
            >
              <ThemedText style={styles.getStartedText}>
                {t("onboarding.getStarted")}
              </ThemedText>
            </Pressable>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 36,
    paddingTop: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 16,
    opacity: 0.6,
  },
  nextButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  getStartedButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});

export const checkOnboardingComplete = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(
    STORAGE_KEYS.ONBOARDING_COMPLETE
  );
  return value === "true";
};
