import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AdminSessionsStackParamList } from '../../navigation/types';
import { Session, Subject, SessionLevel } from '../../models';
import { SessionService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

type Route = RouteProp<AdminSessionsStackParamList, 'EditSession'>;

const LEVELS: SessionLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export const CreateEditSessionScreen = () => {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const sessionId = (route.params as any)?.sessionId;
  const isEdit = !!sessionId;

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalSeats, setTotalSeats] = useState('20');
  const [level, setLevel] = useState<SessionLevel>('Intermediate');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      SessionService.getSessionById(sessionId).then((s) => {
        if (!s) return;
        setTitle(s.title);
        setSubject(s.subject);
        setTeacher(s.teacher);
        setRoom(s.room);
        setDate(s.date.toString().split('T')[0]);
        setStartTime(s.startTime);
        setEndTime(s.endTime);
        setTotalSeats(s.totalSeats.toString());
        setLevel(s.level);
        setDescription(s.description);
      });
    }
  }, [isEdit, sessionId]);

  const handleSubmit = async () => {
    if (!title || !teacher || !room || !date || !startTime || !endTime) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit) {
        await SessionService.updateSession(sessionId, {
          title, subject, teacher, room, date: new Date(date),
          startTime, endTime, totalSeats: Number(totalSeats), level, description,
        });
        Alert.alert('Updated', 'Session updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await SessionService.createSession({
          title, subject, teacher, teacherId: 0, room,
          date: new Date(date), startTime, endTime,
          totalSeats: Number(totalSeats), price: 0, level, description,
          schoolId: user?.schoolId ?? 0,
        });
        Alert.alert('Created', 'Session created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput label="Title *" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
      <TextInput label="Teacher *" value={teacher} onChangeText={setTeacher} mode="outlined" style={styles.input} />
      <TextInput label="Room *" value={room} onChangeText={setRoom} mode="outlined" style={styles.input} />
      <TextInput label="Date (YYYY-MM-DD) *" value={date} onChangeText={setDate} mode="outlined" style={styles.input} />
      <View style={styles.row}>
        <TextInput label="Start Time" value={startTime} onChangeText={setStartTime} mode="outlined" style={[styles.input, styles.half]} placeholder="09:00" />
        <TextInput label="End Time" value={endTime} onChangeText={setEndTime} mode="outlined" style={[styles.input, styles.half]} placeholder="11:00" />
      </View>
      <TextInput label="Total Seats" value={totalSeats} onChangeText={setTotalSeats} mode="outlined" keyboardType="numeric" style={styles.input} />
      <Text style={styles.fieldLabel}>Level</Text>
      <SegmentedButtons
        value={level}
        onValueChange={(v) => setLevel(v as SessionLevel)}
        buttons={LEVELS.map((l) => ({ value: l, label: l }))}
        style={styles.segment}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={submitting}
        disabled={submitting}
        style={styles.submitBtn}
        contentStyle={{ paddingVertical: 6 }}
      >
        {isEdit ? 'Update Session' : 'Create Session'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  input: { marginBottom: 14, backgroundColor: COLORS.surface },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  fieldLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  segment: { marginBottom: 16 },
  submitBtn: { borderRadius: 12, marginTop: 8 },
});
