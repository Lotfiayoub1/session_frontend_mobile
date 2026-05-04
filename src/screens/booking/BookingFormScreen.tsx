import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { SessionsStackParamList } from '../../navigation/types';
import { Session } from '../../models';
import { SessionService, BookingService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/StatusBadge';
import { COLORS } from '../../utils/theme';
import { formatFullDate, formatTimeRange } from '../../utils/format';

type Route = RouteProp<SessionsStackParamList, 'BookingForm'>;

export const BookingFormScreen = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [session, setSession] = useState<Session | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    SessionService.getSessionById(params.sessionId).then(setSession);
  }, [params.sessionId]);

  const handleConfirm = async () => {
    if (!session || !user) return;
    setSubmitting(true);
    try {
      await BookingService.createBooking({ sessionId: session.id, userId: user.id });
      Alert.alert('Confirmed!', 'Your session has been booked.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Confirm your booking</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sessionTitle}>{session.title}</Text>
          <StatusBadge status={session.status} style={{ alignSelf: 'flex-start', marginTop: 6 }} />
          <View style={styles.detailsGrid}>
            <DetailItem label="Teacher" value={session.teacher} />
            <DetailItem label="Date" value={formatFullDate(session.date)} />
            <DetailItem label="Time" value={formatTimeRange(session.startTime, session.endTime)} />
            <DetailItem label="Room" value={session.room} />
            <DetailItem label="Available Seats" value={`${session.totalSeats - session.bookedSeats}`} />
          </View>
        </Card.Content>
      </Card>

      {user && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Booking for</Text>
            <Text style={styles.studentName}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.studentEmail}>{user.email}</Text>
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        onPress={handleConfirm}
        loading={submitting}
        disabled={submitting}
        style={styles.confirmBtn}
        contentStyle={{ paddingVertical: 8 }}
        icon="check"
      >
        Confirm Booking
      </Button>

      <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelBtn}>
        Cancel
      </Button>
    </ScrollView>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  heading: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  card: { marginBottom: 16, borderRadius: 12 },
  sessionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.primary, marginBottom: 8 },
  detailsGrid: { marginTop: 12, gap: 10 },
  detailItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabel: { fontSize: 14, color: COLORS.textSecondary },
  detailValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  sectionTitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6 },
  studentName: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  studentEmail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  confirmBtn: { borderRadius: 12, marginBottom: 12 },
  cancelBtn: { borderRadius: 12 },
});
