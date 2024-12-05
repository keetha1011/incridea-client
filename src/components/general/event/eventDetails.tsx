import draftToHtml from "draftjs-to-html";
import React from "react";

import styles from "./eventDetails.module.css";
import { type RawDraftContentState } from "draft-js";

function EventDetails({ details }: { details: string }) {
  const data = JSON.parse(details) as RawDraftContentState;
  const markup = draftToHtml(data);

  return (
    <section
      className={`${styles.markup} event-description w-full`}
      dangerouslySetInnerHTML={{ __html: markup }}
    ></section>
  );
}

export default EventDetails;
