import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Marker } from "react-native-maps";
import { useThemedColors } from "../../hooks/use-themed-colors";

type ClusterMarkerProps = {
  id: string | number;
  onPress: () => void;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  points: number;
};

export const ClusterMarker = ({
  id,
  onPress,
  coordinate,
  points,
}: ClusterMarkerProps) => {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const { primary } = useThemedColors("primary");

  useEffect(() => {
    setTracksViewChanges(true);
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [points]);

  return (
    <Marker
      key={`cluster-${id}`}
      coordinate={coordinate}
      onPress={onPress}
      tracksViewChanges={tracksViewChanges}
      style={{ width: 40, height: 40 }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 200,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: primary.DEFAULT,
        }}
      >
        <Text style={{ color: primary.foreground }}>{points}</Text>
      </View>
    </Marker>
  );
};
