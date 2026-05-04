import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { FAB, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AdminStudentsStackParamList } from '../../navigation/types';
import { User } from '../../models';
import { StudentService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';

type Nav = NativeStackNavigationProp<AdminStudentsStackParamList, 'StudentList'>;

export const StudentListScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await StudentService.getStudentsBySchool(user?.schoolId ?? 0);
    setStudents(data);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = search
    ? students.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      )
    : students;

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search students..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchbar}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.studentCard}
            onPress={() => navigation.navigate('StudentProfile', { studentId: item.id })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.firstName[0]}{item.lastName[0]}</Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.studentEmail}>{item.email}</Text>
              <Text style={styles.studentLevel}>{item.level}</Text>
            </View>
            <View style={styles.creditBadge}>
              <Text style={styles.creditText}>{item.sessionCredits ?? 0}</Text>
              <Text style={styles.creditLabel}>credits</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.disabled} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyState icon="people-outline" message="No students found" />}
      />
      <FAB icon="plus" style={styles.fab} onPress={() => navigation.navigate('CreateStudent')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchbar: { margin: 12, borderRadius: 10 },
  list: { padding: 12, paddingTop: 0, paddingBottom: 80 },
  studentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, marginBottom: 10, elevation: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  studentEmail: { fontSize: 12, color: COLORS.textSecondary, marginTop: 1 },
  studentLevel: { fontSize: 12, color: COLORS.primary, marginTop: 2, fontWeight: '500' },
  creditBadge: { alignItems: 'center', marginRight: 8 },
  creditText: { fontSize: 18, fontWeight: '700', color: COLORS.accent },
  creditLabel: { fontSize: 10, color: COLORS.textSecondary },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
});
