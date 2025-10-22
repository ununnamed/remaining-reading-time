import ReadTime from "./lib/reading-time";
import PrettyMilliseconds from "pretty-ms";
import ReadingTime from "./main";
import { ReadingTimeFormat } from "./settings";

export function readingTimeText(text: string, plugin: ReadingTime) {
  const result = ReadTime(text, {
    wordsPerMinute: plugin.settings.readingSpeed,
  });
  let options: PrettyMilliseconds.Options = { secondsDecimalDigits: 0 };

  switch (plugin.settings.format) {
    case ReadingTimeFormat.Simple:
      break;
    case ReadingTimeFormat.Default: // 🔁 swapped: now behaves like old Compact
      if (result.time > 3600000) {
        options = { ...options, unitCount: 2 };
      } else {
        options = { ...options, compact: true };
      }
      break;
    case ReadingTimeFormat.Verbose:
      options = { ...options, verbose: true };
      break;
    case ReadingTimeFormat.Digital:
      options = { ...options, colonNotation: true };
      break;
    case ReadingTimeFormat.Compact: // 🔁 swapped: now behaves like old Default
    default:
      return plugin.settings.appendText
        ? `${result.minutes} min left`
        : `${result.minutes} min`;
  }

  const output = PrettyMilliseconds(result.time, options);
  return plugin.settings.appendText
    ? `${output} ${plugin.settings.appendText}`
    : output;
}
