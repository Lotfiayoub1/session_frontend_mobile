import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { FAB, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { School } from '../../models';
import { SchoolService } from '../../services';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';

export const SchoolManagementScreen = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await SchoolService.getSchools();
    setSchools(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleToggle = async (school: School) => {
    Alert.alert(
      school.active ? 'Deactivate School' : 'Activate School',
      `${school.active ? 'Deactivate' : 'Activate'} "${school.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: async () => { await SchoolService.toggleSchoolActive(school.id); await load(); } },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={schools}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.schoolCard}>
            <View style={styles.schoolHeader}>
              <Text style={styles.schoolName}>{item.name}</Text>
              <Chip
                compact
                style={[styles.statusChip, { backgroundColor: item.active ? COLORS.success + '20' : COLORS.error + '20' }]}
                textStyle={{ color: item.active ? COLORS.success : COLORS.error, fontSize: 11 }}
              >
                {item.active ? 'Active' : 'Inactive'}
              </Chip>
            </View>
            <Text style={styles.schoolCity}>{item.city} • {item.address}</Text>
            <View style={styles.schoolMeta}>
              <Text style={styles.metaText}>{item.totalStudents} students • {item.totalSessions} sessions</Text>
            </View>
            <View style={styles.schoolAdmin}>
              <Ionicons name="person" size={14} color={COLORS.textSecondary} />
              <Text style={styles.adminText}>{item.adminName} ({item.adminEmail})</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggleBtn, { backgroundColor: item.active ? COLORS.error + '15' : COLORS.success + '15' }]}
              onPress={() => handleToggle(item)}
            >
              <Text style={{ color: item.active ? COLORS.error : COLORS.success, fontWeight: '600', fontSize: 13 }}>
                {item.active ? 'Deactivate' : 'Activate'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyState icon="business-outline" message="No schools yet" />}
      />
      <FAB icon="plus" style={styles.fab} onPress={() => Alert.alert('Coming Soon', 'School creation form')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 12, paddingBottom: 80 },
  schoolCard: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1 },
  schoolHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  schoolName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, flex: 1, marginRight: 8 },
  statusChip: {},
  schoolCity: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  schoolMeta: { marginBottom: 6 },
  metaText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  schoolAdmin: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  adminText: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
  toggleBtn: { paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
});
