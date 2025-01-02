import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import Dashboard from "~/components/layout/dashboard";
import { EventByOrganizerDocument } from "~/generated/generated";
import Spinner from "~/components/spinner";
import { useAuth } from "~/hooks/useAuth";
import { Role } from "~/generated/generated";
import Quiz from "~/components/general/dashboard/organizer/quiz/quiz";

const QuizPage = () => {
  const router = useRouter();
  const { user, loading: loading2 } = useAuth();
  const { slug } = router.query;
  if (user && user.role !== Role.Organizer) {
    router.push("/profile").catch((err) => {
      console.error("Failed to redirect to profile", err);
    });
  }
  const { data, loading } = useQuery(EventByOrganizerDocument, {
    variables: {
      organizerId: user?.id ?? "0",
    },
  });
  if (loading2) {
    <div className="flex h-screen w-screen justify-center">
      <Spinner />
    </div>;
  }
  if (loading) {
    return <Spinner />;
  }
  if (!data || data.eventByOrganizer.length == 0)
    return (
      <Dashboard>
        <div className="text-center flex flex-row font-medium text-lg">
          No Events Found
        </div>
      </Dashboard>
    );

  const [eventId, roundId] = slug?.toString().split("-") ?? [];
  const roundInt = parseInt(roundId ?? "0");

  const event = data.eventByOrganizer.find((event) => event.id === eventId);
  const round = event?.rounds.find((round) => round.roundNo === roundInt);

  if (!event || !round) {
    return (
      <Dashboard>
        <div className="text-center flex flex-row font-medium text-lg">
          Event or Round not found
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="mx-4 my-4 flex flex-row font-medium justify-around text-2xl">
        <p>Event Name: {event.name}</p>
        <p>Round: {roundId}</p>
      </div>
      <Quiz event={event} round={[round]} />
    </Dashboard>
  );
};

export default QuizPage;
