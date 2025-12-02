import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import PlotlyChart from "../components/PlotlyChart";
import { getAllReports } from "../database/database";
import { SymptomReport } from "../models/SymptomReport";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const [reports, setReports] = useState<SymptomReport[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const allReports = await getAllReports("user1");
      const sorted = allReports.sort(
        (a, b) =>
          new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
      );
      setReports(sorted);
      setLoading(false);
    } catch (error) {
      console.error("Error loading reports:", error);
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (reports.length === 0) return null;

    const bloatingAvg =
      reports.reduce((sum, r) => sum + r.bloating, 0) / reports.length;
    const constipationAvg =
      reports.reduce((sum, r) => sum + r.constipation, 0) / reports.length;
    const painAvg =
      reports.reduce((sum, r) => sum + r.pain, 0) / reports.length;

    return {
      bloating: bloatingAvg.toFixed(1),
      constipation: constipationAvg.toFixed(1),
      pain: painAvg.toFixed(1),
      total: reports.length,
    };
  };

  const calculateChartWidth = () => {
    // רוחב דינמי לפי כמות נקודות
    const pointsCount = reports.length;
    const minWidth = screenWidth - 30;
    const dynamicWidth = Math.max(minWidth, pointsCount * 100);
    return dynamicWidth;
  };

  const prepareTimeSeriesData = () => {
    // קיבוץ לפי תאריך ושעה
    const uniqueReports = reports.map((r, index) => ({
      ...r,
      displayDate: new Date(r.reportedAt).toISOString(),
    }));

    return [
      {
        x: uniqueReports.map((r) => r.displayDate),
        y: uniqueReports.map((r) => r.bloating),
        type: "scatter",
        mode: "lines+markers",
        name: "נפיחות",
        line: { color: "#FF6384", width: 3 },
        marker: { size: 8 },
      },
      {
        x: uniqueReports.map((r) => r.displayDate),
        y: uniqueReports.map((r) => r.constipation),
        type: "scatter",
        mode: "lines+markers",
        name: "עצירות",
        line: { color: "#36A2EB", width: 3 },
        marker: { size: 8 },
      },
      {
        x: uniqueReports.map((r) => r.displayDate),
        y: uniqueReports.map((r) => r.pain),
        type: "scatter",
        mode: "lines+markers",
        name: "כאב בטן",
        line: { color: "#FFCE56", width: 3 },
        marker: { size: 8 },
      },
    ];
  };

  const prepareDailyAveragesData = () => {
    // קיבוץ לפי תאריך (יום)
    const dailyData: {
      [key: string]: {
        bloating: number[];
        constipation: number[];
        pain: number[];
      };
    } = {};

    reports.forEach((r) => {
      const date = new Date(r.reportedAt).toISOString().split("T")[0];
      if (!dailyData[date]) {
        dailyData[date] = { bloating: [], constipation: [], pain: [] };
      }
      dailyData[date].bloating.push(r.bloating);
      dailyData[date].constipation.push(r.constipation);
      dailyData[date].pain.push(r.pain);
    });

    const dates = Object.keys(dailyData).sort();

    return [
      {
        x: dates,
        y: dates.map(
          (d) =>
            dailyData[d].bloating.reduce((a, b) => a + b, 0) /
            dailyData[d].bloating.length
        ),
        type: "scatter",
        mode: "lines+markers",
        name: "נפיחות",
        line: { color: "#FF6384", width: 3 },
        marker: { size: 8 },
      },
      {
        x: dates,
        y: dates.map(
          (d) =>
            dailyData[d].constipation.reduce((a, b) => a + b, 0) /
            dailyData[d].constipation.length
        ),
        type: "scatter",
        mode: "lines+markers",
        name: "עצירות",
        line: { color: "#36A2EB", width: 3 },
        marker: { size: 8 },
      },
      {
        x: dates,
        y: dates.map(
          (d) =>
            dailyData[d].pain.reduce((a, b) => a + b, 0) /
            dailyData[d].pain.length
        ),
        type: "scatter",
        mode: "lines+markers",
        name: "כאב בטן",
        line: { color: "#FFCE56", width: 3 },
        marker: { size: 8 },
      },
    ];
  };

  const prepareWeeklyAveragesData = () => {
    // קיבוץ לפי שבועות
    const weeklyData: {
      [key: string]: {
        bloating: number[];
        constipation: number[];
        pain: number[];
      };
    } = {};

    reports.forEach((r) => {
      const date = new Date(r.reportedAt);
      // חישוב מספר שבוע בשנה
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const dayOfYear = Math.floor(
        (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weekNum = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
      const weekKey = `${date.getFullYear()}-W${weekNum}`;

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = { bloating: [], constipation: [], pain: [] };
      }
      weeklyData[weekKey].bloating.push(r.bloating);
      weeklyData[weekKey].constipation.push(r.constipation);
      weeklyData[weekKey].pain.push(r.pain);
    });

    const weeks = Object.keys(weeklyData).sort();

    return [
      {
        x: weeks,
        y: weeks.map(
          (w) =>
            weeklyData[w].bloating.reduce((a, b) => a + b, 0) /
            weeklyData[w].bloating.length
        ),
        type: "scatter",
        mode: "lines+markers",
        name: "נפיחות",
        line: { color: "#FF6384", width: 3 },
        marker: { size: 10 },
      },
      {
        x: weeks,
        y: weeks.map(
          (w) =>
            weeklyData[w].constipation.reduce((a, b) => a + b, 0) /
            weeklyData[w].constipation.length
        ),
        type: "scatter",
        mode: "lines+markers",
        name: "עצירות",
        line: { color: "#36A2EB", width: 3 },
        marker: { size: 10 },
      },
      {
        x: weeks,
        y: weeks.map(
          (w) =>
            weeklyData[w].pain.reduce((a, b) => a + b, 0) /
            weeklyData[w].pain.length
        ),
        type: "scatter",
        mode: "lines+markers",
        name: "כאב בטן",
        line: { color: "#FFCE56", width: 3 },
        marker: { size: 10 },
      },
    ];
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>טוען נתונים...</Text>
      </SafeAreaView>
    );
  }

  if (reports.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>אין מספיק נתונים לניתוח</Text>
          <Text style={styles.emptySubtext}>התחל למלא דיווחים יומיים!</Text>
        </View>
      </SafeAreaView>
    );
  }

  const timeSeriesLayout = {
    xaxis: {
      title: {
        text: "תאריך ושעה",
        standoff: 20,
        font: { size: 12 },
      },
      type: "date",
      tickformat: "%d/%m<br>%H:%M",
      tickangle: -45,
      tickfont: { size: 10 },
      side: "bottom",
    },
    yaxis: {
      title: {
        text: "רמה (0-10)",
        font: { size: 12 },
      },
      range: [0, 10],
      fixedrange: false,
      tickfont: { size: 10 },
      side: "right", // ← ציר Y מימין!
    },
    font: { family: "Arial, sans-serif", size: 11 },
    plot_bgcolor: "#f9f9f9",
    paper_bgcolor: "#ffffff",
    margin: { l: 30, r: 60, t: 20, b: 100 }, // ← שנה: l=30, r=60
    showlegend: true,
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: -0.35,
      font: { size: 11 },
    },
    dragmode: "pan",
  };

  const dailyAveragesLayout = {
    xaxis: {
      title: {
        text: "תאריך",
        standoff: 20,
        font: { size: 12 },
      },
      type: "date",
      tickformat: "%d/%m",
      tickangle: -45,
      tickfont: { size: 10 },
      side: "bottom",
    },
    yaxis: {
      title: {
        text: "ממוצע (0-10)",
        font: { size: 12 },
      },
      range: [0, 10],
      fixedrange: false,
      tickfont: { size: 10 },
      side: "right", // ← ציר Y מימין!
    },
    font: { family: "Arial, sans-serif", size: 11 },
    plot_bgcolor: "#f9f9f9",
    paper_bgcolor: "#ffffff",
    margin: { l: 30, r: 60, t: 20, b: 100 }, // ← שנה: l=30, r=60
    showlegend: true,
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: -0.35,
      font: { size: 11 },
    },
    dragmode: "pan",
  };

  const weeklyAveragesLayout = {
    xaxis: {
      title: {
        text: "שבוע",
        standoff: 20,
        font: { size: 12 },
      },
      tickangle: -45,
      tickfont: { size: 10 },
      side: "bottom",
    },
    yaxis: {
      title: {
        text: "ממוצע (0-10)",
        font: { size: 12 },
      },
      range: [0, 10],
      fixedrange: false,
      tickfont: { size: 10 },
      side: "right", // ← ציר Y מימין!
    },
    font: { family: "Arial, sans-serif", size: 11 },
    plot_bgcolor: "#f9f9f9",
    paper_bgcolor: "#ffffff",
    margin: { l: 30, r: 60, t: 20, b: 100 }, // ← שנה: l=30, r=60
    showlegend: true,
    legend: {
      orientation: "h",
      x: 0.5,
      xanchor: "center",
      y: -0.35,
      font: { size: 11 },
    },
    dragmode: "pan",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>ניתוח וגרפים</Text>

        {/* סטטיסטיקות */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>סטטיסטיקות כלליות</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats?.total}</Text>
              <Text style={styles.statLabel}>דיווחים</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: "#FFE6E6" }]}>
              <Text style={[styles.statValue, { color: "#FF6384" }]}>
                {stats?.bloating}
              </Text>
              <Text style={styles.statLabel}>ממוצע נפיחות</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: "#E6F2FF" }]}>
              <Text style={[styles.statValue, { color: "#36A2EB" }]}>
                {stats?.constipation}
              </Text>
              <Text style={styles.statLabel}>ממוצע עצירות</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: "#FFF9E6" }]}>
              <Text style={[styles.statValue, { color: "#FFCE56" }]}>
                {stats?.pain}
              </Text>
              <Text style={styles.statLabel}>ממוצע כאב</Text>
            </View>
          </View>
        </View>

        {/* גרף 1: כל הדיווחים */}
        {reports.length >= 2 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>תסמיני בטן — כל הדיווחים</Text>
            <Text style={styles.chartNote}>
              💡 החלק את הגרף ימינה/שמאלה לראות עוד תאריכים
            </Text>
            <PlotlyChart
              data={prepareTimeSeriesData()}
              layout={timeSeriesLayout}
              width={calculateChartWidth()}
            />
          </View>
        )}

        {/* גרף 2: ממוצעים יומיים */}
        {reports.length >= 2 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>ממוצעים יומיים של תסמינים</Text>
            <Text style={styles.chartNote}>
              💡 החלק את הגרף ימינה/שמאלה לראות עוד תאריכים
            </Text>
            <PlotlyChart
              data={prepareDailyAveragesData()}
              layout={dailyAveragesLayout}
              width={calculateChartWidth()}
            />
          </View>
        )}

        {/* גרף 3: ממוצעים שבועיים */}
        {reports.length >= 7 && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>ממוצעים שבועיים של תסמינים</Text>
            <Text style={styles.chartNote}>
              💡 החלק את הגרף ימינה/שמאלה לראות עוד שבועות
            </Text>
            <PlotlyChart
              data={prepareWeeklyAveragesData()}
              layout={weeklyAveragesLayout}
              width={calculateChartWidth()}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#bbb",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  statsContainer: {
    padding: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartNote: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 10,
    fontStyle: "italic",
  },
});
