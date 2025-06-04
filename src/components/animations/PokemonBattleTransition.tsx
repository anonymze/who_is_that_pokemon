import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { View, Dimensions } from "react-native";
import React from "react";

const { width, height } = Dimensions.get("window");

interface PokemonBattleTransitionProps {
  isVisible: boolean;
  onAnimationEnd: () => void;
  children: React.ReactNode;
}

export const PokemonBattleTransition: React.FC<
  PokemonBattleTransitionProps
> = ({ isVisible, onAnimationEnd, children }) => {
  const slideLeft = useSharedValue(-width);
  const slideRight = useSharedValue(width);
  const pokemonScale = useSharedValue(0);
  const pokemonOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const flashOpacity = useSharedValue(0);

  React.useEffect(() => {
    if (isVisible) {
      // Flash effect
      flashOpacity.value = withSequence(
        withTiming(0.8, { duration: 100 }),
        withTiming(0, { duration: 100 }),
        withTiming(0.6, { duration: 100 }),
        withTiming(0, { duration: 100 }),
      );

      // Background fade in
      backgroundOpacity.value = withTiming(1, { duration: 500 });

      // Sliding panels
      slideLeft.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });
      slideRight.value = withTiming(0, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });

      // Pokemon entrance with delay
      pokemonOpacity.value = withDelay(400, withTiming(1, { duration: 300 }));
      pokemonScale.value = withDelay(
        400,
        withSequence(
          withSpring(1.2, { damping: 8, stiffness: 100 }),
          withSpring(1, { damping: 12, stiffness: 150 }),
        ),
      );

      // End animation
      setTimeout(() => {
        slideLeft.value = withTiming(-width, { duration: 400 });
        slideRight.value = withTiming(width, { duration: 400 });
        backgroundOpacity.value = withTiming(0, { duration: 400 });

        setTimeout(() => {
          runOnJS(onAnimationEnd)();
        }, 500);
      }, 2000);
    }
  }, [isVisible]);

  const leftPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideLeft.value }],
  }));

  const rightPanelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideRight.value }],
  }));

  const pokemonStyle = useAnimatedStyle(() => ({
    opacity: pokemonOpacity.value,
    transform: [{ scale: pokemonScale.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 z-50">
      {/* Background */}
      <Animated.View style={[{ flex: 1 }, backgroundStyle]}>
        <LinearGradient
          colors={["#4c1d95", "#7c3aed", "#a855f7"]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Flash effect */}
      <Animated.View
        style={[
          {
            position: "absolute",
            inset: 0,
            backgroundColor: "white",
          },
          flashStyle,
        ]}
      />

      {/* Left sliding panel */}
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            width: width / 2,
            height: height,
            backgroundColor: "#dc2626",
            borderTopRightRadius: 50,
            borderBottomRightRadius: 50,
          },
          leftPanelStyle,
        ]}
      />

      {/* Right sliding panel */}
      <Animated.View
        style={[
          {
            position: "absolute",
            right: 0,
            top: 0,
            width: width / 2,
            height: height,
            backgroundColor: "#dc2626",
            borderTopLeftRadius: 50,
            borderBottomLeftRadius: 50,
          },
          rightPanelStyle,
        ]}
      />

      {/* Pokemon content */}
      <Animated.View
        style={[
          {
            position: "absolute",
            inset: 0,
            justifyContent: "center",
            alignItems: "center",
          },
          pokemonStyle,
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
};
