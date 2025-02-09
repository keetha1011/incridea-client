import React from "react";

import styles from "./eventDetails.module.css";

function EventDetails({ details }: { details: string }) {
  return (
    // TODO(Omkar): check if styles are getting added properly, urgent
    <section
      className={`${styles.markup} event-description w-full`}
      dangerouslySetInnerHTML={{ __html: details }}
    ></section>
  );
}

export default EventDetails;
