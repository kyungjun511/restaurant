// design-spec.md 3.15 바텀시트: 아래에서 올라오는 흰 영역, 배경 어둡게(40%)
// 닫기: "닫기" 버튼 또는 어두운 배경 탭 (끌어내리기 제스처는 선택 사항이라 넣지 않음)
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/src/constants/colors';
import { COMMON_MESSAGES } from '@/src/constants/messages';
import { layout, radius, space } from '@/src/constants/spacing';
import { typography } from '@/src/constants/typography';

interface BottomSheetProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ visible, title, onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={COMMON_MESSAGES.close} />
        <View style={[styles.sheet, { paddingBottom: space.lg + insets.bottom }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable accessibilityRole="button" onPress={onClose} hitSlop={space.sm} style={styles.close}>
              <Text style={styles.closeLabel}>{COMMON_MESSAGES.close}</Text>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: layout.screenPadding,
    paddingTop: space.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: layout.headerHeight,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  close: {
    minHeight: layout.minTouch,
    justifyContent: 'center',
  },
  closeLabel: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
});
