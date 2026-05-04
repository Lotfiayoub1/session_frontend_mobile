import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { CreditService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

interface StudentBalance { studentId: number; name: string; balance: number; }

export const CreditManagementScreen = () => {
  const { user } = useAuth();
  const [balances, setBalances] = useState<StudentBalance[]>([]);
  const [selected, setSelected] = useState<StudentBalance | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [mode, setMode] = useState<'add' | 'deduct'>('add');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const data = await CreditService.getAllStudentBalances();
    setBalances(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openModal = (student: StudentBalance, creditMode: 'add' | 'deduct') => {
    setSelected(student);
    setMode(creditMode);
    setAmount('');
    setReason('');
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!selected || !amount || !reason) return;
    setSubmitting(true);
    try {
      if (mode === 'add') {
        await CreditService.addCredits(selected.studentId, Number(amount), reason, user?.id ?? 0);
      } else {
        await CreditService.deductCredit(selected.studentId, 0, reason, user?.id ?? 0);
      }
      setModalVisible(false);
      await load();
      Alert.alert('Success', `Credits ${mode === 'add' ? 'added' : 'deducted'} successfully`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={balances}
        keyExtractor={(item) => item.studentId.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.balance}>{item.balance} credits</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => openModal(item, 'add')} style={[styles.actionBtn, styles.addBtn]}>
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openModal(item, 'deduct')} style={[styles.actionBtn, styles.deductBtn]}>
                <Ionicons name="remove" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {mode === 'add' ? 'Add Credits' : 'Deduct Credit'} — {selected?.name}
            </Text>
            {mode === 'add' && (
              <TextInput label="Amount" value={amount} onChangeText={setAmount} mode="outlined" keyboardType="numeric" style={styles.modalInput} />
            )}
            <TextInput label="Reason" value={reason} onChangeText={setReason} mode="outlined" style={styles.modalInput} />
            <View style={styles.modalBtns}>
              <Button mode="outlined" onPress={() => setModalVisible(false)} style={{ flex: 1 }}>Cancel</Button>
              <Button mode="contained" onPress={handleSubmit} loading={submitting} style={{ flex: 1 }}>Confirm</Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 12, padding: 14, marginBottom: 10, elevation: 1 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  balance: { fontSize: 13, color: COLORS.accent, fontWeight: '500', marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 34, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  addBtn: { backgroundColor: COLORS.success },
  deductBtn: { backgroundColor: COLORS.error },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 16 },
  modalInput: { marginBottom: 14 },
  modalBtns: { flexDirection: 'row', gap: 12 },
});
