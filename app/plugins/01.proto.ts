import { extendPrototypes } from "~~/shared/prototypes";

export default definePayloadPlugin({
  // order: 1,
  enforce: "pre", // HACK - clientside loaded before this plugin did...
  setup: extendPrototypes,
});
