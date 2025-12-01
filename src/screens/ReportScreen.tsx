import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { createReport } from "../database/database";
import { SymptomReport } from "../models/SymptomReport";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";

export default function ReportScreen() {
  //   State לכל התסמינים
  const [bloating, setBloating] = useState(0);
  const [constipation, setConstipation] = useState(0);
  const [pain, setPain] = useState(0);

  // יציאות
  const [hadStool, setHadStool] = useState(false);
  const [stoolQuality, setStoolQuality] = useState(0); // 1-7 Bristol scale

  // מדדים כלליים
  const [appetite, setAppetite] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [waterCups, setWaterCups] = useState(0);

  // שינה
  const [reportedSleepToday, setReportedSleepToday] = useState(false); // האם כבר דווח היום
  const [sleepHours, setSleepHours] = useState(0); // slider 0-12

  // תזונה ופעילות
  const [hadMeals, setHadMeals] = useState(false); // האם אכל
  const [meals, setMeals] = useState("");
  const [hadActivity, setHadActivity] = useState(false); // האם התאמן
  const [activity, setActivity] = useState("");

  // הערות
  const [notes, setNotes] = useState("");
  const navigation = useNavigation();

  const handleSaveReport = async () => {
    try {
      // בניית אובייקט הדיווח
      const report: SymptomReport = {
        id: uuid.v4() as string,
        userId: "user1", // כרגע משתמש קבוע
        reportedAt: new Date(),

        // תסמינים
        bloating,
        constipation,
        pain,

        // יציאות
        stoolFrequency: hadStool ? 1 : 0, // אם היתה יציאה = 1, אחרת = 0
        stoolQuality: hadStool ? stoolQuality : undefined,

        // מדדים כלליים
        appetite,
        stressLevel,
        waterCups,

        // תזונה ופעילות
        mealsSinceLastReport: hadMeals ? meals : undefined,
        physicalActivitySinceLastReport: hadActivity ? activity : undefined,

        // שינה
        sleepHours: reportedSleepToday ? undefined : sleepHours,
        sleepReportedToday: !reportedSleepToday, // אם דיווחנו עכשיו = true

        // הערות
        notes: notes.trim() || undefined,

        // מטא-דאטה
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // שמירה לדאטאבייס
      await createReport(report);

      // הודעת הצלחה
      alert("הדיווח נשמר בהצלחה! ✅");

      // איפוס הטופס (אופציונלי)
      resetForm();

      navigation.navigate("Dashboard" as never);
    } catch (error) {
      console.error("Error saving report:", error);
      alert("שגיאה בשמירת הדיווח ❌");
    }
  };

  const resetForm = () => {
    setBloating(0);
    setConstipation(0);
    setPain(0);
    setHadStool(false);
    setStoolQuality(0);
    setAppetite(0);
    setStressLevel(0);
    setWaterCups(0);
    setSleepHours(0);
    setReportedSleepToday(false);
    setHadMeals(false);
    setMeals("");
    setHadActivity(false);
    setActivity("");
    setNotes("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>תסמינים</Text>

        {/* נפיחות */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>מה רמת הנפיחות בבטן? {bloating}</Text>
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
          <Text style={styles.label}>מה רמת תחושת העצירות? {constipation}</Text>
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
          <Text style={styles.label}>מה רמת כאב הבטן? {pain}</Text>
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

        {/* יציאות */}
        <Text style={styles.sectionTitle}>יציאות</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>האם הייתה יציאה מאז הדיווח הקודם?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, hadStool && styles.buttonSelected]}
              onPress={() => setHadStool(true)}
            >
              <Text
                style={[
                  styles.buttonText,
                  hadStool && styles.buttonTextSelected,
                ]}
              >
                כן
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, !hadStool && styles.buttonSelected]}
              onPress={() => setHadStool(false)}
            >
              <Text
                style={[
                  styles.buttonText,
                  !hadStool && styles.buttonTextSelected,
                ]}
              >
                לא
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {hadStool && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              איך הייתה איכות הצואה? (סולם ברסטול) - {stoolQuality}/7
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={7}
              step={1}
              value={stoolQuality}
              onValueChange={setStoolQuality}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#D3D3D3"
            />
            <Text style={styles.helperText}>
              1-2: קשה (עצירות) | 3-4: תקין | 5-7: רך/נוזלי (שלשול)
            </Text>
          </View>
        )}

        {/* מדדים כלליים */}
        <Text style={styles.sectionTitle}>מדדים כלליים</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>מה רמת התיאבון שלך כרגע? {appetite}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={appetite}
            onValueChange={setAppetite}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#D3D3D3"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>מה רמת הסטרס שלך כרגע? {stressLevel}</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={stressLevel}
            onValueChange={setStressLevel}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#D3D3D3"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            כמה כוסות מים שתית מאז הדיווח הקודם? {waterCups}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={20}
            step={1}
            value={waterCups}
            onValueChange={setWaterCups}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#D3D3D3"
          />
        </View>

        {/* שינה */}
        <Text style={styles.sectionTitle}>שינה</Text>

        {!reportedSleepToday ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              כמה שעות ישנת הלילה? - {sleepHours} שעות
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={12}
              step={0.5}
              value={sleepHours}
              onValueChange={setSleepHours}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#D3D3D3"
            />
            <Text style={styles.helperText}>
              ניתן לדווח על שינה פעם אחת ביום בלבד
            </Text>
          </View>
        ) : (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              ✅ כבר דיווחת על שינה היום ({sleepHours} שעות)
            </Text>
            <Text style={styles.helperText}>
              ניתן לדווח על שינה פעם אחת ביום בלבד
            </Text>
          </View>
        )}

        {/* תזונה */}
        <Text style={styles.sectionTitle}>תזונה ופעילות</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>האם אכלת משהו מאז הדיווח הקודם?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, hadMeals && styles.buttonSelected]}
              onPress={() => setHadMeals(true)}
            >
              <Text
                style={[
                  styles.buttonText,
                  hadMeals && styles.buttonTextSelected,
                ]}
              >
                כן
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, !hadMeals && styles.buttonSelected]}
              onPress={() => setHadMeals(false)}
            >
              <Text
                style={[
                  styles.buttonText,
                  !hadMeals && styles.buttonTextSelected,
                ]}
              >
                לא
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {hadMeals && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>מה אכלת?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="למשל: בוקר - ביצים ולחם, צהריים - עוף עם אורז..."
              multiline
              numberOfLines={4}
              value={meals}
              onChangeText={setMeals}
              textAlign="right"
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>האם עשית פעילות גופנית?</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, hadActivity && styles.buttonSelected]}
              onPress={() => setHadActivity(true)}
            >
              <Text
                style={[
                  styles.buttonText,
                  hadActivity && styles.buttonTextSelected,
                ]}
              >
                כן
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, !hadActivity && styles.buttonSelected]}
              onPress={() => setHadActivity(false)}
            >
              <Text
                style={[
                  styles.buttonText,
                  !hadActivity && styles.buttonTextSelected,
                ]}
              >
                לא
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {hadActivity && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>איזו פעילות?</Text>
            <TextInput
              style={styles.input}
              placeholder="למשל: ריצה 30 דקות, חדר כושר..."
              value={activity}
              onChangeText={setActivity}
              textAlign="right"
            />
          </View>
        )}

        {/* הערות */}
        <Text style={styles.sectionTitle}>הערות</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>הערות / תובנות / תחושות נוספות</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="למשל: היום הרגשתי טוב יותר, שמתי לב שכשאני אוכל X..."
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            textAlign="right"
          />
        </View>

        {/* כפתור שמירה */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveReport}>
          <Text style={styles.saveButtonText}>שמור דיווח 💾</Text>
        </TouchableOpacity>

        {/* רווח בתחתית */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    direction: "rtl",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
    color: "#333",
    textAlign: "right",
    writingDirection: "rtl",
    alignSelf: "flex-start",
  },
  inputGroup: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
    textAlign: "right",
    writingDirection: "rtl",
    alignSelf: "flex-start",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  helperText: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    fontStyle: "italic",
    textAlign: "right",
    alignSelf: "flex-start",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
  },
  buttonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  buttonTextSelected: {
    color: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    textAlign: "right",
    alignSelf: "flex-start",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  rtlContainer: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
