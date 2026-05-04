import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { SessionsStackParamList } from '../../navigation/types';
import { Session } from '../../models';
import { SessionService } from '../../services';
import { SessionCard } from '../../components/SessionCard';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';

type Nav = NativeStackNavigationProp<SessionsStackParamList, 'SessionCalendar'>;

export const SessionCalendarScreen = () => {
  const navigation = useNavigation<Nav>();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    SessionService.getSessions().then(setSessions);
  }, []);

  const markedDates = sessions.reduce<Record<string, any>>((acc, s) => {
    const key = format(new Date(s.date), 'yyyy-MM-dd');
    if (!acc[key]) acc[key] = { dots: [], marked: true };
    acc[key].dots.push({ color: COLORS.primary });
    return acc;
  }, {});

  if (markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: COLORS.primary,
    };
  } else {
    markedDates[selectedDate] = { selected: true, selectedColor: COLORS.primary };
  }

  const sessionsForDate = sessions.filter(
    (s) => format(new Date(s.date), 'yyyy-MM-dd') === selectedDate
  );

  return (
    <View style={styles.container}>
      <Calendar
        markingType="multi-dot"
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          todayTextColor: COLORS.primary,
          selectedDayBackgroundColor: COLORS.primary,
          arrowColor: COLORS.primary,
          dotColor: COLORS.primary,
        }}
      />

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {sessionsForDate.length} session{sessionsForDate.length !== 1 ? 's' : ''} on {selectedDate}
        </Text>
      </View>

      <FlatList
        data={sessionsForDate}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() => navigation.navigate('SessionDetail', { sessionId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState icon="calendar-outline" message="No sessions on this day" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listHeader: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  listTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  list: { padding: 12 },
});
