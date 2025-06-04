import {
  Dimensions,
  Pressable,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { CircleXIcon, SearchIcon } from "lucide-react-native";
import config from "tailwind.config";
import { cn } from "@/libs/tailwind";
import React from "react";

const widthTextInput = Dimensions.get("window").width - 80;
const widthTextInputAnimated = widthTextInput - 56;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

interface InputSearchProps extends TextInputProps {
  onClear?: () => void;
  clearable?: boolean;
  state?: "error" | "almost" | "close";
}

export type InputSearchRef = {
  clear: () => void;
};

const InputSearch = React.forwardRef<InputSearchRef, InputSearchProps>(
  ({ onClear, clearable = true, state, ...props }, ref) => {
    const inputRef = React.useRef<TextInput>(null);
    const [value, setValue] = React.useState("");

    // const inputAnimatedStyle = useAnimatedStyle(() => {
    //   if (!clearable) return { width: "100%" };
    //   return {
    //     width: withSpring(
    //       value.length > 0 ? widthTextInputAnimated : widthTextInput,
    //       {
    //         damping: 23,
    //         stiffness: 225,
    //       },
    //     ),
    //   };
    // });

    const handleClear = () => {
      inputRef.current?.clear();
      setValue("");
      onClear?.();
    };

    React.useImperativeHandle(ref, () => ({
      clear: handleClear,
    }));

    return (
      <View className="flex-row items-center justify-center">
        <View className="w-full">
          <TextInput
            id="id"
            ref={inputRef}
            returnKeyType="search"
            autoCapitalize="none"
            keyboardType="default"
            textContentType="oneTimeCode"
            autoCorrect={false}
            placeholder={props.placeholder ?? "Rechercher..."}
            onChangeText={(text) => {
              setValue(text);
              props.onChangeText?.(text);
            }}
            className={cn(
              "flex-grow rounded-xl bg-darkGray pl-12 pr-12 h-16 pr-12thrthrh text-primary placeholder:text-primaryLight bg-white border-4 focus:border-black border-transparent outline-none",
              !clearable && "py-4",
              state === "error" && "border-red-700 focus:border-red-700",
              state === "almost" && "border-orange-500 focus:border-orange-500",
              state === "close" && "border-yellow-400 focus:border-yellow-400",
              props.className,
            )}
            {...props}
          />
          <View className="absolute left-4 top-0 h-full items-center justify-center">
            <SearchIcon size={18} color={config.theme.extend.colors.primary} />
          </View>
          {value.length > 0 && (
            <AnimatedPressable
              entering={FadeIn.duration(150)}
              exiting={FadeOut.duration(150)}
              className="absolute right-2 h-full w-10 items-center justify-center rounded-full"
              onPress={handleClear}
            >
              <CircleXIcon
                size={18}
                color={config.theme.extend.colors.defaultGray}
              />
            </AnimatedPressable>
          )}
        </View>
        {/* {clearable && value.length > 0 && (
          <AnimatedPressable
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(150)}
            className="ml-2"
            onPress={handleClear}
          >
            <Text className="text-sm text-primary">Annuler</Text>
          </AnimatedPressable>
        )} */}
      </View>
    );
  },
);

InputSearch.displayName = "InputSearch";

export default InputSearch;
