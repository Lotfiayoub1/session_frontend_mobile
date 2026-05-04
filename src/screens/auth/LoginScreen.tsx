import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

export const LoginScreen = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (e: any) {
      Alert.alert('Login Failed', e.message ?? 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (role: string) => {
    const demos: Record<string, { email: string; password: string }> = {
      student: { email: 'alice@student.com', password: 'password' },
      admin: { email: 'admin@jean-moulin.edu', password: 'admin123' },
      superAdmin: { email: 'superadmin@app.com', password: 'super123' },
    };
    const d = demos[role];
    if (d) { setEmail(d.email); setPassword(d.password); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.logo}>📚</Text>
            <Text style={styles.title}>Session Booking</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              left={<TextInput.Icon icon="email" />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword((v) => !v)}
                />
              }
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginBtn}
              contentStyle={{ paddingVertical: 6 }}
            >
              Sign In
            </Button>
          </View>

          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>Quick Demo Login</Text>
            <View style={styles.demoRow}>
              {[{ key: 'student', label: 'Student' }, { key: 'admin', label: 'Admin' }, { key: 'superAdmin', label: 'Super Admin' }].map(
                ({ key, label }) => (
                  <Button
                    key={key}
                    mode="outlined"
                    onPress={() => fillDemo(key)}
                    style={styles.demoBtn}
                    compact
                  >
                    {label}
                  </Button>
                )
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 64, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.primary, marginBottom: 6 },
  subtitle: { fontSize: 16, color: COLORS.textSecondary },
  form: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, elevation: 2, marginBottom: 24 },
  input: { marginBottom: 16, backgroundColor: COLORS.surface },
  loginBtn: { marginTop: 8, borderRadius: 8 },
  demoSection: { alignItems: 'center' },
  demoTitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12 },
  demoRow: { flexDirection: 'row', gap: 8 },
  demoBtn: { flex: 1 },
});
