import { useMutation, useQuery } from "@apollo/client";
import { Combobox, Transition, Switch } from "@headlessui/react";
import Link from "next/link";
import {
  useState,
  FunctionComponent,
  FormEventHandler,
  Fragment,
  useRef,
} from "react";
import { BsChevronExpand } from "react-icons/bs";
import { IoEye } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { TbArrowBackUp } from "react-icons/tb";

import Button from "~/components/button";
import ViewUserAccommodation from "~/components/general/profile/viewUserAccommodation";
import Spinner from "~/components/spinner";
import createToast from "~/components/toast";
import {
  AddAccommodationRequestDocument,
  GetAllHotelsDocument,
  AccommodationRequestsByUserDocument,
} from "~/generated/generated";

const AccommodationForm: FunctionComponent = () => {
  const [
    addAccommodation,
    { data, loading: emailVerificationLoading, error: emailVerificationError },
  ] = useMutation(AddAccommodationRequestDocument, {
    refetchQueries: [AccommodationRequestsByUserDocument],
  });

  const { data: allHotels } = useQuery(GetAllHotelsDocument);
  const {
    data: accommodationData,
    loading: accommodationLoading,
    refetch: userRefetch,
  } = useQuery(AccommodationRequestsByUserDocument);

  const [uploading, setUploading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const genders = ["Male", "Female", "Other"];
  const [gender, setGender] = useState("");
  const [genderQuery, setGenderQuery] = useState("");
  const filteredGenders =
    genderQuery === ""
      ? genders
      : genders.filter((gender) => {
          return gender.toLowerCase().includes(genderQuery.toLowerCase());
        });

  const hotels = allHotels?.getAllHotels;
  const [hotel, setHotel] = useState("");
  const [hotelQuery, setHotelQuery] = useState("");
  const filteredHotels =
    hotelQuery === ""
      ? hotels
      : (hotels?.filter((hotel) => {
          return hotel.name.toLowerCase().includes(hotelQuery.toLowerCase());
        }) ?? []);

  // FIXME: No AC rooms??
  // const [AC, setAC] = useState<boolean>(false);

  const toISOStringWithTimezone = (date: Date) => {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? "+" : "-";
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
    return (
      date.getFullYear() +
      "-" +
      pad(date.getMonth()) +
      "-" +
      pad(date.getDate()) +
      "T" +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds()) +
      diff +
      pad(tzOffset / 60) +
      pad(tzOffset % 60)
    );
  };

  const checkOutTimeRef = useRef<HTMLInputElement>(null);

  const [AccommodationInfo, setAccommodationInfo] = useState({
    hotelId: 1,
    gender: "",
    checkInTime: new Date(2024, 2, 22, 9, 30).toString(),
    checkOutTime: new Date(2024, 2, 24, 22, 30).toString(),
    id: "",
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const url = `https://incridea-pai3.onrender.com/id/upload`;
    setUploading(true);
    const promise = fetch(url, {
      method: "POST",
      body: formData,
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setAccommodationInfo((prevValue) => {
          return { ...prevValue, id: res.url };
        });
        setUploading(false);
      })
      .catch((err) => {
        setUploading(false);
      });
    await createToast(promise, "Uploading image...");
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await addAccommodation({
      variables: AccommodationInfo,
    });
    setFormSubmitted(true);
  };

  return (
    <>
      {showModal && (
        <ViewUserAccommodation
          inAccommodation={true}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
      <div className="mb-4 mt-10 h-max min-w-[350px] max-w-[350px] rounded-md bg-[#561e98] px-6 py-8 text-accent-200 transition-all ease-suck-in md:min-w-[450px] md:max-w-[450px]">
        {accommodationLoading ? (
          <div className="flex w-full flex-col md:flex-row">
            <Spinner className="text-[#dd5c6e]" intent={"white"} />
          </div>
        ) : formSubmitted ? (
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center">
              We will get back to you within 2 working days.
            </div>
            <Link
              href="/profile"
              className="flex w-full items-center justify-center"
            >
              <Button size={"small"} className="mt-3 w-max md:mt-0">
                <TbArrowBackUp />
                Go Back
              </Button>
            </Link>
          </div>
        ) : accommodationData?.accommodationRequestsByUser[0]?.status ? (
          <div className="flex flex-col md:flex-row">
            <div className="flex justify-center">
              We are processing your request. Please bear with us.
            </div>
            <Button
              onClick={() => {
                setShowModal(true);
              }}
              size={"small"}
              className="ml-3 mt-3 w-max self-center md:mt-0"
            >
              <IoEye />
              View Request
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`relative flex min-h-full flex-col justify-center gap-5 px-3 py-3`}
          >
            {(uploading || emailVerificationLoading) && (
              <div className="absolute inset-0 z-10 flex h-full w-full cursor-not-allowed flex-col rounded-lg bg-[#561e98]/80 md:flex-row">
                <Spinner className="text-[#dd5c6e]" intent={"white"} />
              </div>
            )}
            <p className="mb-3 text-center text-2xl font-semibold">
              Accommodation Request
            </p>
            <Combobox
              value={gender}
              onChange={(value) => {
                setAccommodationInfo((prev) => {
                  return { ...prev, gender: value?.toUpperCase() ?? "" };
                });
                setGender(value ?? "");
              }}
            >
              <div className="relative">
                <div className="relative w-full cursor-default overflow-hidden border-b border-gray-400 md:focus-within:border-[#dd5c6e] md:focus:border-[#dd5c6e]">
                  <Combobox.Input
                    required
                    placeholder="Gender"
                    displayValue={(gender: string) => {
                      return gender;
                    }}
                    className="w-full bg-transparent py-2 pl-1 pr-10 text-sm outline-none placeholder:text-slate-400 md:text-base"
                    onChange={(e) => setGenderQuery(e.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <BsChevronExpand
                      className="h-5 w-5 text-gray-100 md:text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setGenderQuery("")}
                >
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredGenders?.length === 0 && genderQuery !== "" ? (
                      <div className="relative select-none px-4 py-2 text-xs font-semibold text-gray-600 md:text-base">
                        Please select from dropdown
                      </div>
                    ) : (
                      filteredGenders?.map((gender) => (
                        <Combobox.Option
                          className={({ active }) =>
                            `relative cursor-pointer select-none px-4 py-2 text-xs md:text-base ${
                              active
                                ? "bg-[#dd5c6e] text-white"
                                : "text-gray-900"
                            }`
                          }
                          key={gender}
                          value={gender}
                        >
                          {gender}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
            {/* <Combobox
              value={hotel}
              onChange={(id: string) => {
                setAccommodationInfo((prev) => {
                  return {
                    ...prev,
                    hotelId: parseInt(id),
                  };
                });
                setHotel(hotels?.find((hotel) => hotel.id === id)?.name || "");
              }}
            >
              <div className="relative">
                <div className="relative w-full md:focus-within:border-[#dd5c6e] md:focus:border-[#dd5c6e] border-gray-400 cursor-default overflow-hidden border-b ">
                  <Combobox.Input
                    required
                    placeholder="Hotel"
                    className="w-full bg-transparent outline-none text-sm md:text-base py-2 pl-1 pr-10 placeholder:text-slate-400"
                    onChange={(e) => setHotelQuery(e.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <BsChevronExpand
                      className="h-5 w-5 text-gray-100 md:text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setHotelQuery("")}
                >
                  <Combobox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 border text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredHotels?.length === 0 && hotelQuery !== "" ? (
                      <div className="relative font-semibold md:text-base text-xs select-none py-2 px-4 text-gray-600">
                        Hotel not found. Please{" "}
                        <Link
                          href="/contact"
                          className="underline hover:text-gray-700 cursor-pointer"
                        >
                          contact admin.
                        </Link>
                      </div>
                    ) : (
                      filteredHotels?.map((hotel) => (
                        <Combobox.Option
                          className={({ active }) =>
                            `relative select-none py-2 text-xs md:text-base cursor-pointer px-4 ${
                              active
                                ? "bg-[#dd5c6e] text-white"
                                : "text-gray-900"
                            }`
                          }
                          key={hotel.id}
                          value={hotel.id}
                        >
                          {hotel.name}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox> */}
            {/* FIXME: No AC rooms??*/}
            {/* <Switch.Group>
            <div className="flex items-center">
              <Switch.Label className="mr-4">Non-AC</Switch.Label>
              <Switch
                checked={AC}
                onChange={(e) => {
                  setAC(e);
                  setAccommodationInfo((prev) => {
                    // FIXME: fix why AC had to be negated
                    return { ...prev, ac: !AC };
                  });
                }}
                as={Fragment}>
                {({ checked }) => (
                  <button
                    className={`${
                      checked ? "bg-secondary-800" : "bg-gray-300"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}>
                    <span className="sr-only">AC</span>
                    <span
                      className={`${
                        checked ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </button>
                )}
              </Switch>
              <Switch.Label className="ml-4">AC</Switch.Label>
            </div>
          </Switch.Group> */}
            {/* <div className="w-full">
              <label htmlFor="checkInTime" className="mb-2 text-sm block">
                From Date
              </label>
              <input
                required
                type="datetime-local"
                id="checkInTime"
                className="w-full mt-1 p-1 bg-inherit border-b border-gray-400 dark:[color-scheme:dark]"
                value={toISOStringWithTimezone(
                  new Date(AccommodationInfo.checkInTime)
                ).slice(0, 16)}
                onChange={(e) => {
                  if (checkOutTimeRef.current)
                    checkOutTimeRef.current.min = e.target.value;
                  setAccommodationInfo((prevValue) => {
                    return {
                      ...prevValue,
                      checkInTime: e.target.value.toString(),
                    };
                  });
                }}
              />
            </div>
            <div className="w-full">
              <label htmlFor="checkOutTime" className="mb-2 text-sm block">
                To Date
              </label>
              <input
                ref={checkOutTimeRef}
                required
                type="datetime-local"
                id="checkOutTime"
                className="w-full mt-1 p-1 bg-inherit border-b border-gray-400 dark:[color-scheme:dark]"
                value={toISOStringWithTimezone(
                  new Date(AccommodationInfo.checkOutTime)
                ).slice(0, 16)}
                onChange={(e) =>
                  setAccommodationInfo((prevValue) => {
                    return {
                      ...prevValue,
                      checkOutTime: e.target.value.toString(),
                    };
                  })
                }
              />
            </div> */}
            <div>
              <label className="mb-2 block text-sm text-white">Upload ID</label>
              <input
                required
                type="file"
                id="image"
                className="block w-full rounded-lg border border-gray-600 bg-gray-600 text-sm text-white placeholder-slate-400 ring-gray-500 file:mr-4 file:cursor-pointer file:rounded-md file:rounded-r-none file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-blue-700 file:transition-colors hover:file:bg-blue-100 focus:outline-none focus:ring-2"
                onChange={async (e) => await handleUpload(e.target.files![0]!)}
              />
            </div>
            <Button
              intent={"primary"}
              type="submit"
              className="mt-4 flex justify-center"
            >
              <MdModeEditOutline />
              Submit
            </Button>
            <h1 className="text-xs text-gray-100 md:text-sm">
              By clicking the above button, you agree to the mentioned terms and
              conditions
            </h1>
          </form>
        )}
      </div>
    </>
  );
};

export default AccommodationForm;
