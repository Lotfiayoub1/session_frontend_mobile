import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminMoreStackParamList } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

type Nav = NativeStackNavigationProp<AdminMoreStackParamList, 'MoreMenu'>;

const MENU_ITEMS = [
  { key: 'InterestAnalytics', icon: 'stats-chart', label: 'Interest Analytics', description: 'See which chapters students want' },
  { key: 'DocumentUpload', icon: 'cloud-upload', label: 'Upload Document', description: 'Add documents to sessions' },
] as const;

export const MoreMenuScreen = () => {
  const navigation = useNavigation<Nav>();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      {MENU_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.key)}
        >
          <View style={styles.menuIcon}>
            <Ionicons name={item.icon as any} size={22} color={COLORS.primary} />
          </View>
          <View style={styles.menuText}>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuDesc}>{item.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={COLORS.disabled} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={logout}>
        <View style={[styles.menuIcon, { backgroundColor: COLORS.error + '20' }]}>
          <Ionicons name="log-out" size={22} color={COLORS.error} />
        </View>
        <View style={styles.menuText}>
          <Text style={[styles.menuLabel, { color: COLORS.error }]}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 10, elevation: 1 },
  menuIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  menuDesc: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  logoutItem: { marginTop: 16 },
});
