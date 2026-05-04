import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';

interface Props {
  icon: string;
  message: string;
  subMessage?: string;
}

export const EmptyState = ({ icon, message, subMessage }: Props) => (
  <View style={styles.container}>
    <Ionicons name={icon as any} size={56} color={COLORS.disabled} />
    <Text style={styles.message}>{message}</Text>
    {subMessage && <Text style={styles.subMessage}>{subMessage}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 40, flex: 1 },
  message: { fontSize: 16, fontWeight: '600', color: COLORS.textSecondary, marginTop: 16, textAlign: 'center' },
  subMessage: { fontSize: 13, color: COLORS.disabled, marginTop: 6, textAlign: 'center' },
});
