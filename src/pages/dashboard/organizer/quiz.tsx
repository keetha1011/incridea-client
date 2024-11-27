import React from "react";
import { CiCirclePlus, CiImageOn } from "react-icons/ci";
import { HiOutlineDuplicate } from "react-icons/hi";
import { ImRadioUnchecked } from "react-icons/im";
import { MdDeleteOutline } from "react-icons/md";

import Button from "~/components/button";
import Dashboard from "~/components/layout/dashboard";

const Quiz = () => {
  return (
    <Dashboard>
      <div className="flex flex-col">
        <input
          className="mt-4 w-60 rounded-2xl bg-gray-900/80 bg-opacity-30 bg-clip-padding p-2 px-4 text-xl font-medium outline-none backdrop-blur-3xl backdrop-filter"
          placeholder="Enter quiz title"
        />
        <div className="flex flex-row py-8">
          <div className="mx-4 flex h-80 w-full flex-col items-start rounded-3xl bg-gray-900/80 p-4 px-8">
            <h1 className="mt-4 font-gilroy text-xl font-medium">
              Enter the Question
            </h1>
            <div className="flex w-full flex-row items-center">
              <input
                className="mt-4 h-24 w-[1000px] rounded-3xl bg-slate-600 bg-opacity-20 bg-clip-padding px-4 outline-none backdrop-blur-3xl backdrop-filter"
                type="text"
              ></input>
              <CiImageOn className="mx-8 text-3xl" />
              <select
                name="type"
                className="block rounded-lg border-0 border-gray-900 bg-slate-700 bg-opacity-60 bg-clip-padding px-8 py-2 text-sm text-white placeholder-gray-800 ring-gray-500 backdrop-blur-3xl backdrop-filter focus:outline-none focus:ring-2"
                id=""
              >
                <option value="MCQ">MCQ</option>
                <option value="MMCQ">MMCQ</option>
                <option value="FITB">FITB</option>
              </select>
            </div>
            <div className="mt-4 flex flex-row items-center justify-center gap-3">
              <div className="flex flex-row items-center justify-center gap-4">
                <ImRadioUnchecked className="text-lg" />
                <input
                  className="w-full rounded-2xl bg-slate-600 bg-opacity-30 bg-clip-padding p-2 px-4 text-xl font-medium outline-none backdrop-blur-3xl backdrop-filter"
                  placeholder="Enter the option"
                />
              </div>
              <CiImageOn className="mx-8 cursor-pointer text-3xl" />
              <div className="flex items-center gap-4">
                <input
                  checked
                  id="bordered-radio-2"
                  type="radio"
                  value=""
                  name="bordered-radio"
                  className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="bordered-radio-2"
                  className="ms-2 w-full py-4 text-lg font-semibold text-gray-900 dark:text-gray-300"
                >
                  Is Answer?
                </label>
              </div>
            </div>
            <Button
              className="my-4 rounded-md"
              intent={"secondary"}
              size={"small"}
            >
              Add Option
            </Button>
          </div>
          <div className="flex w-20 flex-col items-center justify-around rounded-2xl bg-gray-900/80">
            <CiCirclePlus className="text-3xl hover:rounded-lg hover:bg-slate-800" />
            <HiOutlineDuplicate className="text-3xl hover:rounded-lg hover:bg-slate-800" />
            <MdDeleteOutline className="text-3xl hover:rounded-lg hover:bg-slate-800" />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Quiz;
