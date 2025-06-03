import type { CSSRuleObject } from "tailwindcss/types/config.d.ts";
import type { Config } from "tailwindcss";

import colors from "./src/components/ui/colors.ts";

const variables: { [key: string]: string } = {};
const colorMap: { [key: string]: string } = {};

for (const [name, color] of Object.entries(colors)) {
  variables[`--${name}`] = color;
  colorMap[name] = `var(--${name})`;
}

export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ["./src/**/*.{js,ts,tsx}"],
  plugins: [
    ({
      addBase,
    }: {
      addBase: (base: CSSRuleObject | Array<CSSRuleObject>) => void;
    }) =>
      addBase({
        ":root": variables,
      }),
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: colorMap,
    },
  },
} satisfies Config;
