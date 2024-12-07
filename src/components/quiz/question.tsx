import React from "react";
import { HiOutlineDuplicate } from "react-icons/hi";
import { ImRadioUnchecked } from "react-icons/im";
import { MdDeleteOutline } from "react-icons/md";
import Button from "~/components/button";
import { CiCirclePlus } from "react-icons/ci";
// import dynamic from "next/dynamic";

// const CollapsibleArrow = dynamic(
//   () => import("~/components/quiz/collapsibleArrow"),
//   { ssr: false },
// );

interface QuestionProps {
  id: string;
  questionText: string;
  options: string[];
  index: number;
  ansIndex: number;
  collapsed: boolean;
  toggleCollapase: (id: string) => void;
  handleQuestionTextChange: (id: string, value: string) => void;
  handleOptionChange: (id: string, optionIndex: number, value: string) => void;
  handleAnswerChange: (
    id: string,
    optIndex: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleNewOption: (id: string) => void;
  handleDeleteOption: (id: string) => void;
  handleAddQuestions: (index: number) => void;
  handleDeleteQuestions: (id: string) => void;
  handleCopyQuestion: (id: string, index: number) => void;
}

const QuestionComp: React.FC<QuestionProps> = (props) => {
  return (
    <div key={props.id} className="flex pt-8 pb-3">
      <div className="flex h-auto w-full flex-col items-start rounded-3xl bg-gray-900/80 p-4 px-8">
        <div className="flex align-middle justify-between w-full">
          <div className="flex flex-row gap-10">
            <h1
              className="font-gilroy text-xl font-medium cursor-pointer"
              onClick={() => props.toggleCollapase(props.id)}
            >
              {props.collapsed
                ? `► Question ${props.index + 1}`
                : `▼ Question ${props.index + 1}`}
            </h1>

            {/* <CollapsibleArrow
              id={props.id}
              index={props.index}
              collapsed={props.collapsed}
              toggleCollapase={props.toggleCollapase}
            /> */}

            {props.collapsed && (
              <h2
                className="font-gilroy text-lg font-medium cursor-pointer"
                onClick={() => props.toggleCollapase(props.id)}
              >
                {`${props.questionText.slice(0, 20)}...`}
              </h2>
            )}
          </div>

          <div className="flex w-40 flex-row items-center justify-around rounded-2xl">
            <CiCirclePlus
              className="text-3xl hover:rounded-lg hover:bg-slate-800 cursor-pointer"
              onClick={() => props.handleAddQuestions(props.index)}
            />
            <HiOutlineDuplicate
              className="text-3xl hover:rounded-lg hover:bg-slate-800"
              onClick={() => props.handleCopyQuestion(props.id, props.index)}
            />
            <MdDeleteOutline
              className="text-3xl hover:rounded-lg hover:bg-slate-800 cursor-pointer"
              onClick={() => props.handleDeleteQuestions(props.id)}
            />
          </div>
        </div>
        {!props.collapsed && (
          <>
            <div className="flex w-full flex-row items-center">
              <input
                className="mt-4 h-16 w-[1000px] rounded-3xl bg-slate-600 bg-opacity-20 bg-clip-padding px-4 outline-none backdrop-blur-3xl backdrop-filter"
                type="text"
                placeholder="Enter Question"
                value={props.questionText}
                onChange={(e) =>
                  props.handleQuestionTextChange(props.id, e.target.value)
                }
              ></input>
              {/* <CiImageOn className="mx-8 text-3xl" /> */}
              {/* <select
                name="type"
                className="block rounded-lg border-0 border-gray-900 bg-slate-700 bg-opacity-60 bg-clip-padding px-8 py-2 text-sm text-white placeholder-gray-800 ring-gray-500 backdrop-blur-3xl backdrop-filter focus:outline-none focus:ring-2"
                id=""
              >
                <option value="MCQ">MCQ</option>
                <option value="MMCQ">MMCQ</option>
                <option value="FITB">FITB</option>
              </select> */}
            </div>
            {props.options.map((opt, index2) => (
              <div
                key={index2}
                className="mt-4 flex flex-row items-center justify-center gap-3"
              >
                <div className="flex flex-row items-center justify-center gap-4">
                  <ImRadioUnchecked className="text-lg" />
                  <input
                    className="mr-4 w-full rounded-2xl bg-slate-600 bg-opacity-30 bg-clip-padding p-2 px-4 text-xl font-medium outline-none backdrop-blur-3xl backdrop-filter"
                    placeholder={`Enter option ${index2 + 1}`}
                    value={opt}
                    onChange={(e) =>
                      props.handleOptionChange(props.id, index2, e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-4">
                  <input
                    required
                    id={`answer-${props.id}-${index2 + 1}`}
                    type="radio"
                    value={opt}
                    name={`ans-${props.id}`}
                    className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                    checked={props.ansIndex === index2}
                    onChange={(e) =>
                      props.handleAnswerChange(props.id, index2, e)
                    }
                  />
                  <label
                    htmlFor={`answer-${props.id}-${index2 + 1}`}
                    className="w-full py-4 text-lg font-semibold dark:text-gray-300"
                  >
                    Is Answer?
                  </label>
                  {/* text-gray-900 */}
                </div>
              </div>
            ))}

            {/* <CiImageOn className="mx-8 cursor-pointer text-3xl" /> */}

            <div className="flex flex-row w-full justify-between">
              <div className="flex flex-row">
                <Button
                  className="my-4 rounded-md mr-6"
                  intent={"ghost"}
                  size={"small"}
                  onClick={() => props.handleNewOption(props.id)}
                >
                  Add Option
                </Button>
                <Button
                  className="my-4 rounded-md -skew-x-12"
                  intent={"danger"}
                  size={"small"}
                  onClick={() => props.handleDeleteOption(props.id)}
                >
                  Delete Option
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionComp;
