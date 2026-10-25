// design-spec.md 3.17 로딩: 목록 처음 불러올 때 화면 가운데
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/src/constants/colors';

export function Loading() {
  return (
    <View style={styles.container} accessibilityLabel="불러오는 중">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
