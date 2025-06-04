import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Image } from "expo-image";
import React from "react";

interface PokemonEntranceProps {
  source: string;
  size?: number;
  delay?: number;
}

export const PokemonEntrance: React.FC<PokemonEntranceProps> = ({
  source,
  size = 200,
  delay = 0,
}) => {
  const translateY = useSharedValue(100);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(-10);

  React.useEffect(() => {
    // Entrance animation
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    translateY.value = withDelay(
      delay,
      withSequence(
        withSpring(-20, { damping: 8, stiffness: 100 }),
        withSpring(0, { damping: 12, stiffness: 150 }),
      ),
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withSpring(1.1, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 12, stiffness: 150 }),
      ),
    );
    rotation.value = withDelay(
      delay,
      withSequence(
        withTiming(5, { duration: 200, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) }),
      ),
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image
        source={source}
        style={{ width: size, height: size }}
        contentFit="contain"
      />
    </Animated.View>
  );
};
