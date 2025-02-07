import React from "react";

import styles from "./eventDetails.module.css";

function EventDetails({ details }: { details: string }) {
  return (
    <section
      className={`${styles.markup} event-description w-full`}
      dangerouslySetInnerHTML={{ __html: details }}
    ></section>
  );
}

export default EventDetails;
