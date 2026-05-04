import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

export const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {user.role === 'student' && (
          <>
            <ProfileRow icon="school" label="Level" value={user.level ?? '-'} />
            <Divider style={styles.divider} />
            <ProfileRow icon="wallet" label="Session Credits" value={`${user.sessionCredits ?? 0} credits`} />
            {user.phone && (
              <>
                <Divider style={styles.divider} />
                <ProfileRow icon="call" label="Phone" value={user.phone} />
              </>
            )}
            {user.parentName && (
              <>
                <Divider style={styles.divider} />
                <ProfileRow icon="people" label="Parent" value={user.parentName} />
              </>
            )}
          </>
        )}
        {user.schoolId && (
          <>
            {user.role === 'student' && <Divider style={styles.divider} />}
            <ProfileRow icon="business" label="School ID" value={`School #${user.schoolId}`} />
          </>
        )}
      </View>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutBtn}
        icon="logout"
        textColor={COLORS.error}
      >
        Sign Out
      </Button>
    </ScrollView>
  );
};

const ProfileRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.profileRow}>
    <Ionicons name={icon as any} size={18} color={COLORS.primary} style={styles.profileIcon} />
    <Text style={styles.profileLabel}>{label}</Text>
    <Text style={styles.profileValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  avatarSection: { alignItems: 'center', marginBottom: 24, paddingTop: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 4 },
  email: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 10 },
  roleBadge: { backgroundColor: COLORS.primary + '20', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  roleText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 16, marginBottom: 20, elevation: 1 },
  divider: { marginVertical: 12 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  profileIcon: { marginRight: 12 },
  profileLabel: { flex: 1, fontSize: 14, color: COLORS.textSecondary },
  profileValue: { fontSize: 14, fontWeight: '500', color: COLORS.textPrimary },
  logoutBtn: { borderColor: COLORS.error, borderRadius: 12 },
});
