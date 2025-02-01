import { useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  type ChampionshipPoint,
  GetChampionshipPointsDocument,
  GetChampionshipPointsQueryDocument,
} from "~/generated/generated";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import Button from "~/components/button";

const ChampionshipPointsPanel = () => {
  const { data: subscriptionData } = useSubscription(
    GetChampionshipPointsDocument,
  );
  const { data: queryData } = useQuery(GetChampionshipPointsQueryDocument);
  const [tableData, setTableData] = useState<ChampionshipPoint[]>();

  useEffect(() => {
    if (
      queryData?.getChampionshipPoints.__typename ===
      "QueryGetChampionshipPointsSuccess"
    ) {
      const data = queryData.getChampionshipPoints.data;
      data.sort((a, b) => b.championshipPoints - a.championshipPoints);
      setTableData(data);
    }
  }, [queryData]);

  useEffect(() => {
    console.log(subscriptionData?.getChampionshipPoints.__typename);
  }, [subscriptionData]);

  return (
    <div>
      {queryData?.getChampionshipPoints.__typename ===
      "QueryGetChampionshipPointsSuccess" ? (
        <div>
          <Input
            placeholder="Search for college..."
            className="bg-[#1c1b16] w-[70%] text-xl justify-self-center my-4 border-0 text-white h-12"
          ></Input>
          <Table className="w-[70%] justify-self-center rounded-md bg-[#1c1b16] text-white">
            <TableHeader>
              <TableRow className="text-lg">
                <TableHead className="text-center w-[20%]">College</TableHead>
                <TableHead className="text-center">
                  Championship Points
                </TableHead>
                <TableHead className="text-center">Gold</TableHead>
                <TableHead className="text-center">Silver</TableHead>
                <TableHead className="text-center">Bronze</TableHead>
                <TableHead className="text-center">Technical</TableHead>
                <TableHead className="text-center">Non-Technical</TableHead>
                <TableHead className="text-center">Core</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center text-lg">
              {tableData ? (
                tableData.map((college, index) => (
                  <TableRow
                    key={college.id}
                    className={`${college.id === tableData[0]?.id ? "bg-[#b49709]" : college.id === tableData[1]?.id ? "bg-[#b4b4b4]" : college.id === tableData[2]?.id ? "bg-[#cd7f32]" : ""}`}
                  >
                    <TableCell>{college.name}</TableCell>
                    <TableCell>{college.championshipPoints}</TableCell>
                    <TableCell>{college.goldCount}</TableCell>
                    <TableCell>{college.silverCount}</TableCell>
                    <TableCell>{college.bronzeCount}</TableCell>
                    <TableCell>{college.techCount}</TableCell>
                    <TableCell>{college.nonTechCount}</TableCell>
                    <TableCell>{college.coreCount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div>Error fetching data</div>
      )}
    </div>
  );
};

export default ChampionshipPointsPanel;
