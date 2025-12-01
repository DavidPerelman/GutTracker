import { useEffect, useState } from "react";
import { View, Text, StyleSheet, I18nManager } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { initDatabase } from "./src/database/database";
import ReportScreen from "./src/screens/ReportScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Tab = createBottomTabNavigator();

// קומפוננטה פנימית שיש לה גישה ל-insets
function AppNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          paddingBottom: insets.bottom + 5,
          paddingTop: 5,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "דשבורד",
          tabBarLabel: "דשבורד",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: "דיווח יומי",
          tabBarLabel: "דיווח חדש",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>➕</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
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
  }, []);

  if (!isDbInitialized) {
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <Text>טוען את בסיס הנתונים...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    direction: "rtl",
  },
});
