import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { InterestSummary } from '../../models';
import { AcademicProgramService } from '../../services';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';

export const InterestAnalyticsScreen = () => {
  const [summaries, setSummaries] = useState<InterestSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AcademicProgramService.getAllInterestSummaries()
      .then(setSummaries)
      .finally(() => setLoading(false));
  }, []);

  const maxCount = summaries[0]?.interestedCount ?? 1;

  return (
    <FlatList
      data={summaries.filter((s) => s.interestedCount > 0)}
      keyExtractor={(item) => item.chapter.id}
      renderItem={({ item, index }) => (
        <View style={styles.card}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{index + 1}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.chapterTitle}>{item.chapter.title}</Text>
            <Text style={styles.chapterMeta}>{item.chapter.subject} • {item.chapter.level}</Text>
            <View style={styles.barContainer}>
              <View style={[styles.bar, { width: `${(item.interestedCount / maxCount) * 100}%` }]} />
            </View>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{item.interestedCount}</Text>
            <Text style={styles.countLabel}>students</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        !loading ? <EmptyState icon="stats-chart-outline" message="No interest data yet" /> : null
      }
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 12, backgroundColor: COLORS.background, flexGrow: 1 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1 },
  rankBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  info: { flex: 1 },
  chapterTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 2 },
  chapterMeta: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  barContainer: { height: 6, backgroundColor: COLORS.border, borderRadius: 3 },
  bar: { height: 6, backgroundColor: COLORS.primary, borderRadius: 3 },
  countBadge: { alignItems: 'center', marginLeft: 12 },
  countText: { fontSize: 22, fontWeight: '700', color: COLORS.accent },
  countLabel: { fontSize: 11, color: COLORS.textSecondary },
});
