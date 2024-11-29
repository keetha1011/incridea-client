import draftToHtml from "draftjs-to-html";
import React from "react";

import styles from "./eventDetails.module.css";

function EventDetails({ details }: { details: string }) {
  const data = JSON.parse(details);
  const markup = draftToHtml(data);

  return (
    <section
      className={`${styles.markup} event-description w-full`}
      dangerouslySetInnerHTML={{ __html: markup }}
    ></section>
  );
}

export default EventDetails;
