import { useQuery } from "@apollo/client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import { AccommodationRequestsByUserDocument } from "~/generated/generated";

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  inAccommodation?: boolean;
};

const ViewUserAccommodation: React.FunctionComponent<Props> = ({
  showModal,
  setShowModal,
  inAccommodation,
}) => {
  const {
    data: userdetails,
    loading: userLoading,
    refetch: userRefetch,
  } = useQuery(AccommodationRequestsByUserDocument);

  const dataRef = useRef<{
    name: string;
    price: number | string;
    room: string;
    checkIn: string;
    checkOut: string;
    status: string;
  }>();

  useEffect(() => {
    dataRef.current = {
      name:
        userdetails?.accommodationRequestsByUser[0]?.hotel?.name ||
        "Unavailable",
      price:
        userdetails?.accommodationRequestsByUser[0]?.hotel?.price ||
        "Unavailable",
      room: userdetails?.accommodationRequestsByUser[0]?.room || "Unavailable",
      checkIn: new Date(
        userdetails?.accommodationRequestsByUser[0]?.checkIn,
      ).toLocaleString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      checkOut: new Date(
        userdetails?.accommodationRequestsByUser[0]?.checkOut,
      ).toLocaleString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      status:
        userdetails?.accommodationRequestsByUser[0]?.status || "Unavailable",
    };
  });

  return (
    <Modal
      showModal={showModal}
      onClose={() => setShowModal(false)}
      title={"View User Details"}
      size="medium"
    >
      <div className="m-4 flex h-80 items-center justify-center gap-2.5 rounded-lg bg-white bg-opacity-20 bg-clip-padding p-1 backdrop-blur-lg backdrop-filter">
        <div className="m-4 flex flex-col items-start justify-center gap-3 text-lg">
          {/* FIXME : fix ui of modal */}
          {userLoading ? (
            <Spinner className="text-[#dd5c6e]" />
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col text-lg font-bold">
                  <div>Hotel Name</div>
                  <div>Price</div>
                  <div>Room</div>
                  <div>Check In</div>
                  <div>Check Out</div>
                  <div>Status</div>
                </div>
                <div className="flex flex-col text-lg font-semibold">
                  <div>{dataRef.current?.name}</div>
                  <div>{dataRef.current?.price}</div>
                  <div>{dataRef.current?.room}</div>
                  <div>{dataRef.current?.checkIn}</div>
                  <div>{dataRef.current?.checkOut}</div>
                  <div>{dataRef.current?.status}</div>
                </div>
              </div>
            </div>
          )}
          {!inAccommodation && (
            <div className="text-sm">
              For more information, checkout{" "}
              <Link
                onClick={() => {
                  setShowModal(false);
                }}
                href={"/accommodation"}
                className="underline hover:font-medium"
              >
                accommodation guidelines
              </Link>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewUserAccommodation;
