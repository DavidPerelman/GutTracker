import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { initDatabase } from "./src/database/database";

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    // זה ירוץ פעם אחת כשהאפליקציה נטענת
    const setupDatabase = async () => {
      try {
        await initDatabase();
        setIsDbInitialized(true);
        console.log("✅ Database ready!");
      } catch (error) {
        console.error("❌ Database initialization failed:", error);
      }
    };

    setupDatabase();
  }, []); // [] = רק פעם אחת

  // אם הדאטאבייס עדיין נטען...
  if (!isDbInitialized) {
    return (
      <View style={styles.container}>
        <Text>טוען את בסיס הנתונים...</Text>
      </View>
    );
  }

  // אחרי שהדאטאבייס מוכן
  return (
    <View style={styles.container}>
      <Text>GutTracker - בקרוב!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
