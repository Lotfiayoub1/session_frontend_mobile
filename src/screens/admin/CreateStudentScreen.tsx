import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StudentLevel } from '../../models';
import { StudentService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

const LEVELS: StudentLevel[] = ['6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale', 'Prépa 1', 'Prépa 2'];

export const CreateStudentScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState<StudentLevel>('Terminale');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Error', 'First name, last name and email are required');
      return;
    }
    setSubmitting(true);
    try {
      await StudentService.createStudent({
        firstName,
        lastName,
        email,
        phone,
        level,
        parentName,
        parentPhone,
        schoolId: user?.schoolId,
        createdByAdminId: user?.id,
      });
      Alert.alert('Success', 'Student created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput label="First Name *" value={firstName} onChangeText={setFirstName} mode="outlined" style={styles.input} />
      <TextInput label="Last Name *" value={lastName} onChangeText={setLastName} mode="outlined" style={styles.input} />
      <TextInput label="Email *" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
      <TextInput label="Phone" value={phone} onChangeText={setPhone} mode="outlined" keyboardType="phone-pad" style={styles.input} />
      <Text style={styles.fieldLabel}>Level</Text>
      <View style={styles.levelGrid}>
        {LEVELS.map((l) => (
          <Button
            key={l}
            mode={level === l ? 'contained' : 'outlined'}
            onPress={() => setLevel(l)}
            compact
            style={styles.levelBtn}
          >
            {l}
          </Button>
        ))}
      </View>
      <TextInput label="Parent Name" value={parentName} onChangeText={setParentName} mode="outlined" style={styles.input} />
      <TextInput label="Parent Phone" value={parentPhone} onChangeText={setParentPhone} mode="outlined" keyboardType="phone-pad" style={styles.input} />
      <Button
        mode="contained"
        onPress={handleCreate}
        loading={submitting}
        disabled={submitting}
        style={styles.submitBtn}
        contentStyle={{ paddingVertical: 6 }}
      >
        Create Student
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  input: { marginBottom: 14, backgroundColor: COLORS.surface },
  fieldLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 10 },
  levelGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  levelBtn: { borderRadius: 8 },
  submitBtn: { borderRadius: 12, marginTop: 8 },
});
