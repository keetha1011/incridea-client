import React from "react";

function intro() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-green-800 to-emerald-950 flex flex-col justify-center items-center p-4">
      <div className="mt-16">
        <h1 className="w-fit mx-auto my-6 text-2xl lg:text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 via-yellow-400 text-transparent bg-clip-text drop-shadow-md">
          Quiz name
        </h1>
        <div className="w-full max-w-lg bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          {" "}
          <div className="p-6 text-center">
            <div className="bg-white/10 rounded-xl p-6 mt-4">
              <h2 className="text-xl font-semibold text-amber-300 mb-4">
                Password Required
              </h2>

              {/* Password Input */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[1rem] text-white/80 mb-2"
                  >
                    Enter Quiz Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    // disabled={hasQuizEnded || !hasQuizStarted || !attended}
                    // value={password}
                    // onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white 
                    border border-white/30 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-amber-500
                    placeholder-white/50"
                    placeholder="Enter your password"
                  />
                  {/* {errorMessage && (
                    <p className="mt-2 text-sm font-medium text-red-300">{errorMessage}</p>
                  )} */}
                </div>

                {/* Rules Section */}
                <div className="bg-white/10 rounded-md p-4 mt-4">
                  <p className="w-fit mx-auto text-lg font-semibold text-amber-300 border-b-[1px] border-amber-400 mb-2">
                    Quiz Rules:
                  </p>
                  <p className="text-[1rem] text-pretty text-gray-100">
                    {/* {quizData?.description} */} Lorem ipsum dolor sit amet
                    consectetur, adipisicing elit. Esse dolore accusantium illum
                    expedita dicta aspernatur rem aut iure incidunt odit, ipsam
                    quas id nisi quaerat animi possimus vel deleniti temporibus.
                  </p>
                </div>
              </div>

              {/* Action Section */}
              <div className="mt-6">
                {/* {!attended ? ( */}
                <div className="text-center text-white font-medium">
                  You must be present at the venue to attempt the quiz
                </div>
                {/* ) : hasQuizEnded ? (
                <div className="text-center text-white font-medium">
                  Quiz has ended
                </div> */}
                {/* ) : ( */}
                <>
                  {/* {!hasQuizStarted ? (
                    <div className="text-center text-white font-medium">
                      Quiz has not yet started
                    </div> */}
                  {/* ) : ( */}
                  <button
                    // onClick={handlePasswordSubmit}
                    // disabled={verifyQuizLoading || !password}
                    className="mt-6 rounded-full w-3/4 mx-auto bg-amber-500 text-white py-2
                        hover:bg-amber-600 transition-colors duration-300
                        disabled:bg-slate-400 disabled:cursor-not-allowed
                        flex justify-center items-center"
                  >
                    {/* {verifyQuizLoading ? ( */}
                    {/* <BiLoader className="animate-spin h-6 w-6" /> */}
                    {/* ) : ( */}
                    Submit Password
                    {/* )} */}
                  </button>
                  {/* )} */}
                </>
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default intro;
