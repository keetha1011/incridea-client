import { SPONSORS } from "~/constants/sponsors";

const CONSTANT = {
  REGISTRATIONS_OPEN: true,
  BASE_URL: "https://incridea.in" as const,
  COLLEGE_NAME: "NMAM Institute of Technology",
  PID_FORMAT: "INC25-" as const,
  YEAR: 2025 as const,
  REG_AMOUNT_IN_INR: {
    INTERNAL: 350,
    EXTERNAL: 450,
    OTHER: 1000000000,
  },
  URL: {
    VIDEO: {
      THEME_REVEAL:
        "https://www.instagram.com/reel/DE2IY6FvbTm/?igsh=MTdsbnc1bjMyaXZuYw==",
    },
  },
  // TODO(Omkar): Needs updates
  DATE: {
    ROUND: {
      DEAFULT_START: new Date(2025, 2, 27, 9, 30),
    },
    ACCOMODATION: {
      CHECK_IN_TIME: new Date(2025, 2, 27, 9, 30),
      CHECK_OUT_TIME: new Date(2025, 3, 1, 22, 30),
    },
    INCRIDEA: {
      DAY1: new Date("2025-02-27T09:00:00"),
      DAY2: new Date("2025-02-28T09:00:00"),
      DAY3: new Date("2025-03-01T09:00:00"),
    },
  },
  PID: {
    TECH_TEAM: [11, 15, 2, 1, 10, 9, 509, 59, 4, 8, 13, 16, 291, 74],
  },
  SPONSORS: SPONSORS,
};

export { CONSTANT };
