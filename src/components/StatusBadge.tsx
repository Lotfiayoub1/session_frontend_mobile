import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../utils/theme';

type Status = 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'confirmed' | 'pending';

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string }> = {
  upcoming: { label: 'Upcoming', bg: COLORS.primary + '20', text: COLORS.primary },
  ongoing: { label: 'Ongoing', bg: COLORS.secondary + '20', text: COLORS.secondary },
  completed: { label: 'Completed', bg: COLORS.disabled + '40', text: COLORS.textSecondary },
  cancelled: { label: 'Cancelled', bg: COLORS.error + '20', text: COLORS.error },
  confirmed: { label: 'Confirmed', bg: COLORS.success + '20', text: COLORS.success },
  pending: { label: 'Pending', bg: COLORS.warning + '20', text: COLORS.warning },
};

interface Props {
  status: Status;
  size?: 'small' | 'normal';
  style?: ViewStyle;
}

export const StatusBadge = ({ status, size = 'normal', style }: Props) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.upcoming;
  return (
    <View style={[styles.badge, { backgroundColor: config.bg, paddingVertical: size === 'small' ? 2 : 4, paddingHorizontal: size === 'small' ? 6 : 10 }, style]}>
      <Text style={[styles.text, { color: config.text, fontSize: size === 'small' ? 10 : 12 }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { borderRadius: 20, alignSelf: 'flex-start' },
  text: { fontWeight: '700', textTransform: 'capitalize' },
});
