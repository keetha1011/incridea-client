import { SPONSORS } from "~/constants/sponsors";

const CONSTANT = {
  BASE_URL: "https://incridea.in" as const,
  PID_FORMAT: "INC24-" as const,
  YEAR: 2025 as const,
  URL: {
    VIDEO: {
      THEME_REVEAL:
        "https://www.instagram.com/reel/DE2IY6FvbTm/?igsh=MTdsbnc1bjMyaXZuYw==",
    },
  },
  // TODO(Omkar): Needs updates
  DATE: {
    ROUND: {
      DEAFULT_START: new Date(2024, 1, 22, 9, 30),
    },
    ACCOMODATION: {
      CHECK_IN_TIME: new Date(2024, 2, 22, 9, 30),
      CHECK_OUT_TIME: new Date(2024, 2, 24, 22, 30),
    },
    INCRIDEA: {
      DAY1: new Date("2024-02-22T09:00:00"),
      DAY2: new Date("2024-02-23T09:00:00"),
      DAY3: new Date("2024-02-24T09:00:00"),
    },
  },
  PID: {
    TECH_TEAM: [11, 15, 2, 1, 10, 9, 509, 59, 4, 8, 13, 16, 291, 74],
  },
  SPONSORS: SPONSORS,
};

export { CONSTANT };
