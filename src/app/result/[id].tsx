import { Redirect, router, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";
import { queryClient } from "@/api/config";

export default function Finish() {
  const { id, limit, generation, lang } = useLocalSearchParams();
  const data = queryClient.getQueryData(["finish", id]);

  if (!data || !limit || !generation || !lang) return <Redirect href="/" />;

  return (
    <View>
      <Button
        title="Recommencer"
        onPress={() =>
          router.replace({
            pathname: "/game",
            params: {
              limit: limit,
              generation: generation,
              lang: lang,
            },
          })
        }
      />
      <Button title="Reset" onPress={() => router.replace("/")} />
    </View>
  );
}
