import AsyncStorage from "@react-native-async-storage/async-storage";

export const dumpAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);
    console.log("=== ALL ASYNC STORAGE DATA ===");
    data.forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
    console.log("=== END ASYNC STORAGE DATA ===");
    return data;
  } catch (error) {
    console.error("Error reading AsyncStorage:", error);
    return null;
  }
};

export const dumpReactQueryCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const reactQueryKeys = keys.filter(
      (key) => key.includes("react-query") || key.includes("REACT_QUERY")
    );

    if (reactQueryKeys.length === 0) {
      console.log("No React Query cache data found in AsyncStorage");
      console.log(
        "Note: Some queries may be excluded from persistence (meta.persist = false)"
      );
      return [];
    }

    const data = await AsyncStorage.multiGet(reactQueryKeys);
    console.log("=== REACT QUERY PERSISTED CACHE DATA ===");
    console.log(`Found ${data.length} persisted queries:`);
    data.forEach(([key, value]) => {
      console.log(`${key}:`);
      try {
        const parsed = JSON.parse(value || "{}");
        console.log(JSON.stringify(parsed, null, 2));
      } catch {
        console.log(value);
      }
    });
    console.log("=== END REACT QUERY CACHE DATA ===");
    console.log(
      "Note: Queries with meta.persist = false are excluded from persistence"
    );
    return data;
  } catch (error) {
    console.error("Error reading React Query cache:", error);
    return null;
  }
};

export const clearAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys);
    console.log("All AsyncStorage data cleared");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

export const clearReactQueryCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const reactQueryKeys = keys.filter(
      (key) => key.includes("react-query") || key.includes("REACT_QUERY")
    );
    await AsyncStorage.multiRemove(reactQueryKeys);
    console.log("React Query cache cleared from AsyncStorage");
  } catch (error) {
    console.error("Error clearing React Query cache:", error);
  }
};
