import Link from "next/link";

import TextAnimation from "~/components/animation/text";
import Button from "~/components/button";

import EventsPeek from ".";

const EventsReel = () => {
  return (
    <section>
      <EventsPeek speed={5} />

      <div className="-mt-7 flex justify-center md:mt-12">
        <TextAnimation
          text="Events"
          className={`titleFont`}
          textStyle="text-2xl font-semibold lg:text-4xl text-white"
        />
      </div>
      <div className="mx-auto max-w-3xl px-4">
        <p className="bodyFont mt-5 text-center text-sm text-white md:mt-10 lg:text-lg">
          Experience a thrilling adventure that will awaken your senses to the
          core!
          <br /> With a diverse range of offerings in music, art, sports, and
          technology, there&apos;s something for everyone. Come dive into the
          deep ocean of excitement and discover unforgettable experiences.
        </p>
        <Link
          className="mx-auto mt-5 flex w-fit justify-center"
          href={"/events"}
        >
          <Button>View Events</Button>
        </Link>
      </div>
    </section>
  );
};

export default EventsReel;
