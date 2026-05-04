import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Chip } from 'react-native-paper';
import { Booking, BookingStatus } from '../../models';
import { BookingService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { BookingCard } from '../../components/BookingCard';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../utils/theme';

const STATUSES: { label: string; value: BookingStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const MyBookingsScreen = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<BookingStatus | undefined>();

  const load = useCallback(async () => {
    if (!user) return;
    const data = await BookingService.getBookingsForUser(user.id);
    setBookings(data);
  }, [user]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleCancel = async (bookingId: number) => {
    await BookingService.cancelBooking(bookingId);
    await load();
  };

  const displayed = filter ? bookings.filter((b) => b.status === filter) : bookings;

  return (
    <View style={styles.container}>
      <View style={styles.filtersRow}>
        {STATUSES.map((s) => (
          <Chip
            key={s.label}
            selected={filter === s.value}
            onPress={() => setFilter(s.value)}
            style={styles.chip}
            compact
          >
            {s.label}
          </Chip>
        ))}
      </View>

      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookingCard booking={item} onCancel={handleCancel} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading ? (
            <EmptyState icon="bookmark-outline" message="No bookings found" />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  chip: {},
  list: { padding: 12 },
});
