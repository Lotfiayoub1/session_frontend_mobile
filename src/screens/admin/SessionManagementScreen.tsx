import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminSessionsStackParamList } from '../../navigation/types';
import { Session } from '../../models';
import { SessionService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { SessionCard } from '../../components/SessionCard';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';

type Nav = NativeStackNavigationProp<AdminSessionsStackParamList, 'SessionManagement'>;

export const SessionManagementScreen = () => {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await SessionService.getSessions(
      user?.schoolId ? { schoolId: user.schoolId } : {}
    );
    setSessions(data);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Session', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await SessionService.deleteSession(id);
          await load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}
            onLongPress={() =>
              Alert.alert('Options', item.title, [
                { text: 'View Details', onPress: () => navigation.navigate('SessionDetail', { sessionId: item.id }) },
                { text: 'Classroom', onPress: () => navigation.navigate('ClassroomView', { sessionId: item.id }) },
                { text: 'Edit', onPress: () => navigation.navigate('EditSession', { sessionId: item.id }) },
                { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<EmptyState icon="calendar-outline" message="No sessions yet" />}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreateSession')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 12, paddingBottom: 80 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: COLORS.primary },
});
