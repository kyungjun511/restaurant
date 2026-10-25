// design-spec.md 3.14 모달(확인창): 가운데 흰 상자, 제목 + 설명 + 버튼 2개(취소 / 확인)
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/src/constants/colors';
import { COMMON_MESSAGES } from '@/src/constants/messages';
import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';
import { Button } from './Button';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;   // 되돌릴 수 없는 동작이면 확인 버튼을 위험 버튼으로
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  description,
  confirmLabel,
  cancelLabel = COMMON_MESSAGES.cancel,
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={loading ? undefined : onCancel} accessible={false} />
        <View style={styles.box} accessibilityViewIsModal>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          <View style={styles.actions}>
            <Button title={cancelLabel} variant="secondary" onPress={onCancel} disabled={loading} style={styles.action} />
            <Button
              title={confirmLabel}
              variant={danger ? 'danger' : 'primary'}
              onPress={onConfirm}
              loading={loading}
              style={styles.action}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  box: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: layout.cardPadding + space.sm,
    gap: space.sm,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  description: {
    ...typography.sub,
    color: colors.textSub,
  },
  actions: {
    flexDirection: 'row',
    gap: space.sm,
    marginTop: space.md,
  },
  action: {
    flex: 1,
  },
});
