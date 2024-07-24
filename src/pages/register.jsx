import React from "react";

const Register = () => {
  return (
    <div className="w-full h-full bg-amber-100">
      <div className="w-full max-w-2xl px-3 mx-auto mt-0 md:flex-0 shrink-0 mt-40">
        <div className="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl bg-clip-border">
          <div className="p-6 mb-0 text-center bg-white border-b-0 rounded-t-2xl">
            <h5>Register with</h5>
          </div>
          <div className="flex flex-wrap px-3 -mx-3 sm:px-6 xl:px-12">
            <div className="w-3/12 max-w-full px-1 ml-auto flex-0">
              <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-transparent hover:opacity-75">
                {/* SVG for social login */}
              </a>
            </div>
            <div className="w-3/12 max-w-full px-1 flex-0">
              <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-transparent hover:opacity-75">
                {/* SVG for social login */}
              </a>
            </div>
            <div className="w-3/12 max-w-full px-1 mr-auto flex-0">
              <a className="inline-block w-full px-6 py-3 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:scale-102 leading-pro text-xs ease-soft-in tracking-tight-soft bg-150 bg-x-25 hover:bg-transparent hover:opacity-75">
                {/* SVG for social login */}
              </a>
            </div>
            <div className="relative w-full max-w-full px-3 mt-2 text-center shrink-0">
              <p className="z-20 inline px-4 mb-2 font-semibold leading-normal bg-white text-sm text-slate-400">
                or
              </p>
            </div>
          </div>
          <div className="flex-auto p-6">
            <form role="form text-left">
              <div className="mb-4">
                <input
                  aria-label="Name"
                  placeholder="Name"
                  className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                  type="text"
                />
              </div>
              <div className="mb-4">
                <input
                  aria-label="Email"
                  placeholder="Email"
                  className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                  type="email"
                />
              </div>
              <div className="mb-4">
                <input
                  aria-label="Password"
                  placeholder="Password"
                  className="text-sm block w-full rounded-lg border border-solid border-gray-300 bg-white py-2 px-3 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:bg-white focus:text-gray-700 focus:outline-none"
                  type="password"
                />
              </div>
              <div className="min-h-6 pl-7 mb-0.5 block">
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer appearance-none border border-solid border-slate-200 bg-white"
                  id="terms"
                />
                <label
                  htmlFor="terms"
                  className="mb-2 ml-1 font-normal cursor-pointer select-none text-sm text-slate-700"
                >
                  {" "}
                  I agree to the{" "}
                  <a className="font-bold text-slate-700">
                    Terms and Conditions
                  </a>
                </label>
              </div>
              <div className="text-center">
                <button
                  className="inline-block w-full px-6 py-3 mt-6 mb-2 font-bold text-center text-white uppercase transition-all bg-gradient-to-tl from-gray-900 to-slate-800 rounded-lg cursor-pointer"
                  type="button"
                >
                  Sign up
                </button>
              </div>
              <p className="mt-4 mb-0 text-sm">
                Already have an account?{" "}
                <a
                  className="font-bold text-slate-700"
                  href="/login"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
