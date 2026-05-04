import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons, Text } from 'react-native-paper';
import { DocumentType } from '../../models';
import { COLORS } from '../../utils/theme';

export const DocumentUploadScreen = () => {
  const [title, setTitle] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [type, setType] = useState<DocumentType>('course');
  const [restricted, setRestricted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUpload = async () => {
    if (!title || !sessionId) {
      Alert.alert('Error', 'Title and Session ID are required');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      Alert.alert('Uploaded', 'Document metadata saved. (File upload requires backend integration.)');
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput label="Document Title *" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />
      <TextInput label="Session ID *" value={sessionId} onChangeText={setSessionId} mode="outlined" keyboardType="numeric" style={styles.input} />
      <Text style={styles.fieldLabel}>Document Type</Text>
      <SegmentedButtons
        value={type}
        onValueChange={(v) => setType(v as DocumentType)}
        buttons={[
          { value: 'course', label: 'Course' },
          { value: 'exercise', label: 'Exercise' },
          { value: 'correction', label: 'Correction' },
          { value: 'summary', label: 'Summary' },
        ]}
        style={styles.segment}
      />
      <SegmentedButtons
        value={restricted ? 'restricted' : 'public'}
        onValueChange={(v) => setRestricted(v === 'restricted')}
        buttons={[
          { value: 'public', label: 'Public' },
          { value: 'restricted', label: 'Restricted' },
        ]}
        style={styles.segment}
      />
      <Button
        mode="contained"
        onPress={handleUpload}
        loading={submitting}
        disabled={submitting}
        icon="upload"
        style={styles.uploadBtn}
        contentStyle={{ paddingVertical: 6 }}
      >
        Upload Document
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  input: { marginBottom: 14, backgroundColor: COLORS.surface },
  fieldLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8 },
  segment: { marginBottom: 16 },
  uploadBtn: { borderRadius: 12, marginTop: 8 },
});
