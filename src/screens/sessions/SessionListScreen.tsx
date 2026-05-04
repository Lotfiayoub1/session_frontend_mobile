import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
} from 'react-native';
import { Searchbar, Chip, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SessionsStackParamList } from '../../navigation/types';
import { Session, Subject, SessionStatus } from '../../models';
import { SessionService } from '../../services';
import { SessionCard } from '../../components/SessionCard';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';

type Nav = NativeStackNavigationProp<SessionsStackParamList, 'SessionList'>;

const SUBJECTS: Subject[] = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature', 'English', 'Computer Science'];
const STATUSES: SessionStatus[] = ['upcoming', 'ongoing', 'completed', 'cancelled'];

export const SessionListScreen = () => {
  const navigation = useNavigation<Nav>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus | undefined>();

  const load = useCallback(async () => {
    const data = await SessionService.getSessions({
      search: search || undefined,
      subject: selectedSubject,
      status: selectedStatus,
    });
    setSessions(data);
  }, [search, selectedSubject, selectedStatus]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search sessions..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchbar}
      />

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ label: 'All', value: undefined }, ...SUBJECTS.map((s) => ({ label: s, value: s }))]}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <Chip
              selected={selectedSubject === item.value}
              onPress={() => setSelectedSubject(item.value as Subject | undefined)}
              style={styles.chip}
              compact
            >
              {item.label}
            </Chip>
          )}
          contentContainerStyle={styles.chipList}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ label: 'All Status', value: undefined }, ...STATUSES.map((s) => ({ label: s, value: s }))]}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <Chip
              selected={selectedStatus === item.value}
              onPress={() => setSelectedStatus(item.value as SessionStatus | undefined)}
              style={styles.chip}
              compact
            >
              {item.label}
            </Chip>
          )}
          contentContainerStyle={styles.chipList}
        />
      </View>

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="calendar-outline" message="No sessions found" />
          ) : null
        }
      />

      <FAB
        icon="calendar"
        style={styles.fab}
        onPress={() => navigation.navigate('SessionCalendar')}
        label="Calendar"
        size="small"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchbar: { margin: 12, marginBottom: 0, borderRadius: 10 },
  filtersContainer: { paddingTop: 8 },
  chipList: { paddingHorizontal: 12, paddingVertical: 4, gap: 8 },
  chip: { marginRight: 0 },
  list: { padding: 12, paddingBottom: 80 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
});
