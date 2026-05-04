import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Document, DocumentType } from '../../models';
import { DocumentService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';
import { formatDate } from '../../utils/format';

const TYPE_ICONS: Record<DocumentType, string> = {
  course: 'book',
  exercise: 'pencil',
  correction: 'checkmark-circle',
  summary: 'list',
};

const TYPE_COLORS: Record<DocumentType, string> = {
  course: COLORS.primary,
  exercise: COLORS.secondary,
  correction: COLORS.success,
  summary: COLORS.accent,
};

const DOC_TYPES: { label: string; value: DocumentType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Course', value: 'course' },
  { label: 'Exercise', value: 'exercise' },
  { label: 'Correction', value: 'correction' },
  { label: 'Summary', value: 'summary' },
];

export const DocumentsScreen = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<DocumentType | undefined>();

  useEffect(() => {
    DocumentService.getDocuments().then((docs) => {
      setDocuments(docs);
      setLoading(false);
    });
  }, []);

  const handleDownload = (doc: Document) => {
    if (doc.restricted && user?.role === 'student') {
      Alert.alert('Restricted', 'This document is restricted. Contact your admin.');
      return;
    }
    Alert.alert('Download', `Downloading "${doc.title}"...\n(${doc.fileSize})`);
  };

  const displayed = typeFilter
    ? documents.filter((d) => d.type === typeFilter)
    : documents;

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={DOC_TYPES}
          keyExtractor={(i) => i.label}
          renderItem={({ item }) => (
            <Chip
              selected={typeFilter === item.value}
              onPress={() => setTypeFilter(item.value)}
              compact
              style={styles.chip}
            >
              {item.label}
            </Chip>
          )}
          contentContainerStyle={styles.chipList}
        />
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.docCard} onPress={() => handleDownload(item)} activeOpacity={0.7}>
            <View style={[styles.docIcon, { backgroundColor: TYPE_COLORS[item.type] + '20' }]}>
              <Ionicons name={TYPE_ICONS[item.type] as any} size={24} color={TYPE_COLORS[item.type]} />
            </View>
            <View style={styles.docInfo}>
              <View style={styles.docTitleRow}>
                <Text style={styles.docTitle} numberOfLines={1}>{item.title}</Text>
                {item.restricted && (
                  <Ionicons name="lock-closed" size={14} color={COLORS.error} />
                )}
              </View>
              <Text style={styles.docSession} numberOfLines={1}>{item.sessionTitle}</Text>
              <View style={styles.docMeta}>
                <Text style={styles.docMetaText}>{item.subject}</Text>
                <Text style={styles.docMetaSep}>•</Text>
                <Text style={styles.docMetaText}>{item.fileSize}</Text>
                <Text style={styles.docMetaSep}>•</Text>
                <Text style={styles.docMetaText}>{formatDate(item.uploadedAt)}</Text>
              </View>
            </View>
            <Ionicons name="download-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? <EmptyState icon="document-outline" message="No documents found" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  filters: { backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  chipList: { padding: 10, gap: 8 },
  chip: {},
  list: { padding: 12 },
  docCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 10, elevation: 1 },
  docIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  docInfo: { flex: 1, marginRight: 8 },
  docTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  docTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, flex: 1 },
  docSession: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  docMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  docMetaText: { fontSize: 11, color: COLORS.textSecondary },
  docMetaSep: { fontSize: 11, color: COLORS.disabled },
});
