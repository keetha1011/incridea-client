import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { FC, useState } from "react";
import { MdModeEditOutline } from "react-icons/md";

import Button from "~/components/button";
import Modal from "~/components/modal";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import {
  GetAllHotelsDocument,
  UpdateAccommodationStatusDocument,
} from "~/generated/generated";

enum AccommodationStatus {
  pending = "PENDING",
  complete = "CONFIRMED",
  cancelled = "CANCELLED",
}
const AddAccommodateDetails: FC<{
  accId: String;
}> = ({ accId }) => {
  const [showModal, setShowModal] = useState(false);
  const [hotelDetails, setHotelDetails] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [status, setStatus] = useState("");

  const {
    data: allHotels,
    loading: hotelLoading,
    refetch: hotelRefetch,
  } = useQuery(GetAllHotelsDocument);

  const [updateStatus, { data: updateStatusResult }] = useMutation(
    UpdateAccommodationStatusDocument,
  );
  const handleUpdate = () => {
    const promise = updateStatus({
      variables: {
        hotelId: hotelDetails,
        room: roomNo,
        bookingId: accId as string,
        status,
      },
    }).then((res) => {
      if (res.data?.updateStatus.__typename !== "MutationUpdateStatusSuccess") {
        if (res.data?.updateStatus.message !== undefined) {
          createToast(
            Promise.reject(res.data?.updateStatus.message),
            res.data?.updateStatus.message,
          );
        }
        return Promise.reject("Error could update status");
      }
    });
    createToast(promise, "Updating Status...");
  };
  return (
    <>
      <Button
        intent={"info"}
        className="flex items-center justify-center gap-2"
        size={"medium"}
        onClick={() => setShowModal(true)}
      >
        <MdModeEditOutline />
        Edit
      </Button>
      <Modal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        title={"Edit Accommodation Details"}
        size="medium"
      >
        <div className="h-50 m-4 flex flex-col items-center justify-evenly gap-2.5 rounded-t-lg bg-white bg-opacity-20 bg-clip-padding p-4 text-base font-bold backdrop-blur-lg backdrop-filter">
          <div className="mt-2 flex w-full flex-col items-start">
            <label className="m-2" htmlFor="hotelName">
              Choose the Hotels
            </label>
            <select
              onChange={(e) => {
                setHotelDetails(e.target.value);
              }}
              value={hotelDetails}
              id="hotelName"
              className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
            >
              {allHotels?.getAllHotels.map((hot) => (
                <option key={hot.id} value={hot.id}>
                  {hot.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-full flex-col items-start">
            <p className="m-2">Room No.</p>
            <input
              type="text"
              id="name"
              className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
              placeholder="Room No..."
              onChange={(e) => {
                setRoomNo(e.target.value);
              }}
              value={roomNo}
              required
            />
          </div>

          <div className="mt-2 flex w-full flex-col items-start">
            <label className="m-2" htmlFor="status">
              Change the Status
            </label>
            <select
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              value={status}
              id="status"
              className="block w-11/12 rounded-lg border border-gray-600 bg-gray-600 p-2.5 text-sm text-white placeholder-gray-400 ring-gray-500 focus:outline-none focus:ring-2"
            >
              {Object.values(AccommodationStatus).map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <Button
              intent={"info"}
              className="mt-4 flex items-center justify-center gap-2"
              size={"medium"}
              onClick={() => handleUpdate()}
            >
              <MdModeEditOutline />
              submit
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddAccommodateDetails;
