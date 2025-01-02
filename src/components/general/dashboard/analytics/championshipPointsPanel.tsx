import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  GetChampionshipPointsDocument,
  GetChampionshipQueryDocument,
  CreateWinnerDocument,
  WinnerType,
} from "~/generated/generated";

const ChampionshipPointsPanel = () => {
  const { data: subscriptionData } = useSubscription(
    GetChampionshipPointsDocument,
  );
  const { data: queryData } = useQuery(GetChampionshipQueryDocument);
  const [createWinner] = useMutation(CreateWinnerDocument);

  const [points, setPoints] = useState<number>(0);

  // Mock data for development or fallback
  const mockData = {
    getChampionshipPoints: {
      __typename: "SubscriptionGetChampionshipPointsSuccess",
      data: [
        {
          id: 1,
          name: "NMAM Institute of Technology",
          championshipPoints: 0,
          goldCount: { winner: 0, runner_up: 0, second_runner_up: 0 },
          silverCount: { winner: 0, runner_up: 0, second_runner_up: 0 },
          bronzeCount: { winner: 0, runner_up: 0, second_runner_up: 0 },
        },
        {
          id: 3,
          name: "College 2",
          championshipPoints: 200,
          goldCount: { winner: 0, runner_up: 0, second_runner_up: 0 },
          silverCount: { winner: 0, runner_up: 0, second_runner_up: 0 },
          bronzeCount: { winner: 1, runner_up: 0, second_runner_up: 0 },
        },
      ],
    },
  };

  const fallbackData = subscriptionData ?? queryData ?? mockData;

  useEffect(() => {
    if (
      fallbackData?.getChampionshipPoints.__typename ===
      "SubscriptionGetChampionshipPointsSuccess"
    ) {
      const firstCollegePoints =
        fallbackData.getChampionshipPoints.data[0]?.championshipPoints;
      if (firstCollegePoints) setPoints(firstCollegePoints);
      console.log("Points Updated:", firstCollegePoints);
    }
  }, [fallbackData]);

  useEffect(() => {
    console.log(subscriptionData?.getChampionshipPoints.__typename);
  }, [subscriptionData]);

  const handleCreateWinner = async () => {
    await createWinner({
      variables: {
        eventId: "3",
        teamId: "6",
        type: WinnerType.Winner,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      {!fallbackData ? (
        <div>Loading...</div>
      ) : fallbackData?.getChampionshipPoints.__typename ===
        "SubscriptionGetChampionshipPointsSuccess" ? (
        <div>
          <h1>Championship Points</h1>
          {fallbackData.getChampionshipPoints.data.map((college) => (
            <div key={college.id}>
              <h2>{college.name}</h2>
              <p>Championship Points: {college.championshipPoints}</p>
            </div>
          ))}
          <div>
            <strong>First College Points: </strong>
            {points ?? "N/A"}
          </div>
        </div>
      ) : (
        <div>Error fetching data</div>
      )}
      <button onClick={handleCreateWinner}>Create Winner</button>
    </div>
  );
};

export default ChampionshipPointsPanel;
