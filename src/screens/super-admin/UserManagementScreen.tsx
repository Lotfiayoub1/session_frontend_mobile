import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../models';
import { StudentService } from '../../services';
import { USERS } from '../../data/mock-data';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';

export const UserManagementScreen = () => {
  const admins = USERS.filter((u) => u.role === 'admin');
  const [students, setStudents] = useState<User[]>([]);
  const [tab, setTab] = useState<'admins' | 'students'>('admins');

  useEffect(() => {
    StudentService.getAllStudents().then(setStudents);
  }, []);

  const displayed = tab === 'admins' ? admins : students;

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {(['admins', 'students'] as const).map((t) => (
          <Chip
            key={t}
            selected={tab === t}
            onPress={() => setTab(t)}
            style={styles.tab}
          >
            {t === 'admins' ? `Admins (${admins.length})` : `Students (${students.length})`}
          </Chip>
        ))}
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.firstName[0]}{item.lastName[0]}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              {item.schoolId && <Text style={styles.userSchool}>School #{item.schoolId}</Text>}
            </View>
            <View style={[styles.roleBadge, { backgroundColor: item.role === 'admin' ? COLORS.primary + '20' : COLORS.secondary + '20' }]}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: item.role === 'admin' ? COLORS.primary : COLORS.secondary }}>
                {item.role.toUpperCase()}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="people-outline" message="No users found" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  tabs: { flexDirection: 'row', gap: 10, padding: 12, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tab: {},
  list: { padding: 12 },
  userCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 10, elevation: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  userEmail: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  userSchool: { fontSize: 12, color: COLORS.primary, marginTop: 2 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
});
