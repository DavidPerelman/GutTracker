import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Slider from "@react-native-community/slider";

export default function ReportScreen() {
  // State לכל התסמינים
  const [bloating, setBloating] = useState(0);
  const [constipation, setConstipation] = useState(0);
  const [pain, setPain] = useState(0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>תסמינים</Text>

      {/* נפיחות */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>נפיחות: {bloating}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={bloating}
          onValueChange={setBloating}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#D3D3D3"
        />
      </View>

      {/* עצירות */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>עצירות: {constipation}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={constipation}
          onValueChange={setConstipation}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#D3D3D3"
        />
      </View>

      {/* כאב בטן */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>כאב בטן: {pain}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={10}
          step={1}
          value={pain}
          onValueChange={setPain}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#D3D3D3"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
