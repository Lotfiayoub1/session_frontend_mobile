import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Chip, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AcademicProgram, Chapter } from '../../models';
import { AcademicProgramService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';

export const ProgramsScreen = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.level) return;
    const [progs, studentInterests] = await Promise.all([
      AcademicProgramService.getProgramsForLevel(user.level),
      AcademicProgramService.getInterestsForStudent(user.id),
    ]);
    setPrograms(progs);
    setInterests(new Set(studentInterests.map((i) => i.chapterId)));
  }, [user]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const handleToggleInterest = async (chapter: Chapter) => {
    if (!user) return;
    const wasInterested = interests.has(chapter.id);
    const nowInterested = await AcademicProgramService.toggleInterest(user.id, chapter);
    setInterests((prev) => {
      const next = new Set(prev);
      if (nowInterested) next.add(chapter.id);
      else next.delete(chapter.id);
      return next;
    });
    const msg = nowInterested
      ? 'You\'ll be auto-booked when a session for this chapter is created.'
      : 'Interest removed.';
    Alert.alert(nowInterested ? 'Interest Added' : 'Interest Removed', msg);
  };

  const sections = programs.map((p) => ({
    title: p.title,
    data: p.chapters,
  }));

  if (!user?.level) {
    return <EmptyState icon="book-outline" message="No programs available for your level" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Ionicons name="information-circle" size={16} color={COLORS.primary} />
        <Text style={styles.bannerText}>
          Mark your interests — you\'ll be automatically booked when related sessions are created.
        </Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <ChapterItem
            chapter={item}
            interested={interests.has(item.id)}
            onToggle={() => handleToggleInterest(item)}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={!loading ? <EmptyState icon="book-outline" message="No programs found" /> : null}
      />
    </View>
  );
};

const ChapterItem = ({
  chapter,
  interested,
  onToggle,
}: {
  chapter: Chapter;
  interested: boolean;
  onToggle: () => void;
}) => (
  <View style={[styles.chapterCard, interested && styles.chapterCardInterested]}>
    <View style={styles.chapterOrder}>
      <Text style={styles.chapterOrderText}>{chapter.order}</Text>
    </View>
    <View style={styles.chapterInfo}>
      <Text style={styles.chapterTitle}>{chapter.title}</Text>
      <Text style={styles.chapterDesc}>{chapter.description}</Text>
      <Text style={styles.chapterSessions}>{chapter.estimatedSessions} estimated sessions</Text>
    </View>
    <TouchableOpacity onPress={onToggle} style={[styles.starBtn, interested && styles.starBtnActive]}>
      <Ionicons
        name={interested ? 'star' : 'star-outline'}
        size={22}
        color={interested ? COLORS.accent : COLORS.textSecondary}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  banner: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#E3F2FD', padding: 12, gap: 8 },
  bannerText: { flex: 1, fontSize: 13, color: COLORS.primary, lineHeight: 18 },
  sectionHeader: { backgroundColor: COLORS.background, paddingHorizontal: 16, paddingVertical: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  list: { paddingBottom: 24 },
  chapterCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 12, marginBottom: 8, borderRadius: 12, padding: 12, elevation: 1, borderWidth: 1, borderColor: 'transparent' },
  chapterCardInterested: { borderColor: COLORS.accent, backgroundColor: '#FFFDE7' },
  chapterOrder: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  chapterOrderText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  chapterInfo: { flex: 1 },
  chapterTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  chapterDesc: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 4 },
  chapterSessions: { fontSize: 11, color: COLORS.primary },
  starBtn: { padding: 6 },
  starBtnActive: {},
});
