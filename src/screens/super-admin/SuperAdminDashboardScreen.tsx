import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SchoolService, StudentService, SessionService } from '../../services';
import { COLORS } from '../../utils/theme';

export const SuperAdminDashboardScreen = () => {
  const [stats, setStats] = useState({ schools: 0, activeSchools: 0, students: 0, sessions: 0 });

  useEffect(() => {
    Promise.all([
      SchoolService.getSchools(),
      StudentService.getAllStudents(),
      SessionService.getSessions(),
    ]).then(([schools, students, sessions]) => {
      setStats({
        schools: schools.length,
        activeSchools: schools.filter((s) => s.active).length,
        students: students.length,
        sessions: sessions.length,
      });
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Platform Overview</Text>
        <Text style={styles.headerSub}>All schools • Super Admin</Text>
      </View>

      <View style={styles.grid}>
        <StatCard icon="business" label="Total Schools" value={stats.schools} color={COLORS.primary} />
        <StatCard icon="checkmark-circle" label="Active Schools" value={stats.activeSchools} color={COLORS.success} />
        <StatCard icon="people" label="All Students" value={stats.students} color={COLORS.secondary} />
        <StatCard icon="calendar" label="All Sessions" value={stats.sessions} color={COLORS.accent} />
      </View>
    </ScrollView>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Ionicons name={icon as any} size={26} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  header: { backgroundColor: COLORS.primary, borderRadius: 16, padding: 20, marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, elevation: 1, flex: 1, minWidth: '45%', borderLeftWidth: 4 },
  statValue: { fontSize: 32, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8 },
  statLabel: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
});
