import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllReports, deleteReport } from "../database/database";
import { SymptomReport } from "../models/SymptomReport";
import { useFocusEffect } from "@react-navigation/native";

export default function DashboardScreen() {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  // טעינת דיווחים כשהמסך נטען
  useFocusEffect(
    React.useCallback(() => {
      loadReports();
    }, [])
  );

  const loadReports = async () => {
    try {
      const allReports = await getAllReports("user1");
      setReports(allReports);
      setLoading(false);
    } catch (error) {
      console.error("Error loading reports:", error);
      setLoading(false);
    }
  };

  const handleDelete = (reportId: string) => {
    Alert.alert("מחיקת דיווח", "האם אתה בטוח שברצונך למחוק את הדיווח?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteReport(reportId);
            loadReports(); // רענון הרשימה
            Alert.alert("הדיווח נמחק בהצלחה");
          } catch (error) {
            Alert.alert("שגיאה במחיקת הדיווח");
          }
        },
      },
    ]);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderReport = ({ item }: { item: SymptomReport }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportDate}>{formatDate(item.reportedAt)}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reportBody}>
        <View style={styles.symptomRow}>
          <Text style={styles.symptomLabel}>נפיחות:</Text>
          <Text style={styles.symptomValue}>{item.bloating}/10</Text>
        </View>
        <View style={styles.symptomRow}>
          <Text style={styles.symptomLabel}>עצירות:</Text>
          <Text style={styles.symptomValue}>{item.constipation}/10</Text>
        </View>
        <View style={styles.symptomRow}>
          <Text style={styles.symptomLabel}>כאב:</Text>
          <Text style={styles.symptomValue}>{item.pain}/10</Text>
        </View>

        {item.stoolFrequency > 0 && (
          <View style={styles.symptomRow}>
            <Text style={styles.symptomLabel}>יציאות:</Text>
            <Text style={styles.symptomValue}>
              כמות: {item.stoolFrequency}, איכות: {item.stoolQuality}/7
            </Text>
          </View>
        )}

        {item.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>הערות:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>טוען דיווחים...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>היסטוריית דיווחים</Text>

      {reports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>עדיין אין דיווחים</Text>
          <Text style={styles.emptySubtext}>התחל למלא דיווח יומי!</Text>
        </View>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReport}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#007AFF"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#bbb",
  },
  listContainer: {
    padding: 15,
  },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  reportDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  reportBody: {
    gap: 8,
  },
  symptomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  symptomLabel: {
    fontSize: 14,
    color: "#666",
  },
  symptomValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  notesContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
  },
  notesText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});
