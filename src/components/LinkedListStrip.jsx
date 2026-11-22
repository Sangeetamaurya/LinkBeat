import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CoverImage from './CoverImage';
import { colors } from '../theme/colors';
import { styles } from './LinkedListStrip.styles';

export default function LinkedListStrip({
  nodes,
  currentIndex,
  onSelect,
  hasHead = true,
  hasTail = true,
}) {
  return (
    <View style={styles.row}>
      {nodes.map((node, i) => {
        const isCurrent = i === currentIndex;
        const isHead = i === 0;
        const isTail = i === nodes.length - 1;
        const size = isCurrent ? 76 : 64;
        const imageSize = size - 10;

        return (
          <View key={node.id} style={styles.item}>
            <Pressable
              onPress={() => onSelect(i)}
              style={[styles.nodeColumn, { width: size }]}
            >
              <View style={styles.circleBox}>
                <View
                  style={[
                    styles.ring,
                    { width: size, height: size, borderRadius: size / 2 },
                    isCurrent && styles.ringCurrent,
                  ]}
                >
                  <CoverImage
                    uri={node.image}
                    iconSize={16}
                    style={{
                      width: imageSize,
                      height: imageSize,
                      borderRadius: imageSize / 2,
                      backgroundColor: colors.glass,
                    }}
                  />
                </View>

                {node.isLive && (
                  <View style={styles.liveWrap}>
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  </View>
                )}
              </View>

              <Text style={styles.label}>
                {isHead && hasHead ? 'HEAD' : isTail && hasTail ? 'TAIL' : ' '}
              </Text>
            </Pressable>

            {!isTail && (
              <View style={styles.arrow}>
                <Ionicons name="swap-horizontal" size={14} color="rgba(255,255,255,0.4)" />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
