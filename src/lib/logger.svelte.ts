import {
  ConsoleFormattedStream,
  createLogger,
  DEBUG,
  INFO,
  stdSerializers,
} from "browser-bunyan";

export const log = $state(
  createLogger({
    name: "TabPro",
    streams: [
      {
        level: DEBUG, // or use the string 'info'
        stream: new ConsoleFormattedStream(),
      },
    ],
    serializers: stdSerializers,
    src: true,
  }),
);

log.info("Logger initialized!");

