// 사진 자리: 사진 주소가 있으면 사진, 없으면 회색 배경 + 아이콘 (design-spec.md 7장 "사진 없음 대체")
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/src/constants/colors';

interface PhotoPlaceholderProps {
  uri?: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}

export function PhotoPlaceholder({ uri, icon, iconSize = 32, style }: PhotoPlaceholderProps) {
  if (uri) {
    return (
      <View style={[styles.box, style]}>
        <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityIgnoresInvertColors />
      </View>
    );
  }
  return (
    <View style={[styles.box, style]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Ionicons name={icon} size={iconSize} color={colors.textSub} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondaryPressed,
    overflow: 'hidden',
  },
});
