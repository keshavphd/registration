import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { allSchema, calculateAge, genderOptions } from "./ZodFile";
import SummaryAPI, { Axios } from "./util/Axios";
import SavedDataPage from "./SavedDataPage";

const App = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState();
  const [showData, setShowData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedData, setSavedData] = useState(false);

  const allData = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...SummaryAPI.allData,
      });
      setData(res.data.msg);
      console.log("hi", res);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allData();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(allSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      country: "",
      state: "",
      city: "",
    },
  });

  useEffect(() => {
    setCountries(data);
  }, [data]);

  const selectedCountry = watch("country");
  const selectedState = watch("state");

  useEffect(() => {
    if (selectedCountry) {
      const country = countries.find((c) => c.country === selectedCountry);
      if (country) {
        setStates(country.states);
        setValue("state", "");
        setValue("city", "");
      } else {
        setStates([]);
      }
    } else {
      setStates([]);
      setValue("state", "");
      setValue("city", "");
    }
    setCities([]);
  }, [selectedCountry, countries, setValue]);

  useEffect(() => {
    if (selectedState) {
      const state = states.find((s) => s.name === selectedState);
      if (state) {
        setCities(state.cities);
        setValue("city", "");
      } else {
        setCities([]);
      }
    } else {
      setCities([]);
      setValue("city", "");
    }
  }, [selectedState, states, setValue]);

  const dOB = watch("dateOfBirth");
  const ageTillDate = calculateAge(dOB);

  const onSubmit = async (formData) => {
    const age = calculateAge(formData.dateOfBirth);
    setFormData({ ...formData, age });
    try {
      setShowData(true);

      /// line below this was not essential
      const saveData = await Axios({
        ...SummaryAPI.storeData,
        data: { ...formData, age },
      });
      //   not essential
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-full flex justify-center bg-amber-100">
      <div className="min-h-screen w-full rounded-2xl m-2 min-w-md max-w-4xl p-2 bg-white">
        <div className="text-center mt-8 text-3xl font-semibold underline hover:decoration-blue-400">
          Registration form
        </div>
        {loading && (
          <div className="fixed top-0 bottom-0 left-0 right-0 bg-black opacity-20">
            hi
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="p-7">
          <label>
            <div className="mt-3"> First Name:</div>
            <input
              type="text"
              {...register("firstname", { required: "Enter a value" })}
              placeholder="Enter your first name"
              className="w-full outline-none border border-neutral-300 rounded pl-2 focus-within:border-amber-800 bg-blue-50 h-8"
            />
            {errors.firstname && (
              <div className="text-red-500 text-sm">
                {errors.firstname.message}
              </div>
            )}
          </label>{" "}
          <label>
            <div className="mt-3">Last Name:</div>
            <input
              type="text"
              {...register("lastname")}
              placeholder="Enter your last name"
              className="w-full outline-none border border-neutral-300 rounded pl-2 focus-within:border-amber-800 bg-blue-50 h-8"
            />
            {errors.lastname && (
              <div className="text-red-500 text-sm">
                {errors.lastname.message}
              </div>
            )}
          </label>{" "}
          <label>
            <div className="mt-3"> Email:</div>
            <input
              type="text"
              {...register("email")}
              placeholder="Enter your email id"
              className="w-full outline-none border border-neutral-300 rounded pl-2 focus-within:border-amber-800 bg-blue-50 h-8"
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </label>{" "}
          <label>
            <div className="mt-3"> Country:</div>

            <select
              className="w-full outline-none border border-neutral-300 rounded pl-2 focus-within:border-amber-800 bg-blue-50 h-8"
              {...register("country")}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.id} value={country.country}>
                  {country.country}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
          </label>
          <label>
            <div className="mt-3"> State:</div>
            <select
              className="w-full outline-none border border-neutral-300 rounded pl-2 focus-within:border-amber-800 bg-blue-50 h-8"
              {...register("state")}
              disabled={!selectedCountry}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state.message}</p>
            )}
          </label>
          <label>
            <div className="mt-3"> City:</div>

            <select
              className="w-full outline-none border border-neutral-300 rounded pl-2 focus-within:border-amber-800 bg-blue-50 h-8"
              {...register("city")}
              disabled={!selectedState}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </label>
          <div className="mt-3"> Gender:</div>
          {genderOptions.map((option, index) => (
            <label key={index} className="flex gap-1 items-center">
              <input
                type="radio"
                value={option}
                {...register("gender")}
                className="outline-none border border-neutral-300 w-fit rounded pl-2 focus-within:border-amber-800 bg-blue-50 h-8"
              />
              {option}
            </label>
          ))}
          {errors.gender && (
            <div className="text-red-600 text-sm">{errors.gender.message}</div>
          )}
          <label>
            <div className="mt-3"> Date of Birth:</div>
            <input
              type="date"
              {...register("dateOfBirth", { required: "DOB is required" })}
              placeholder=""
              className="w-full outline-none border border-neutral-300 rounded pl-2 focus-within:border-amber-800 bg-blue-50 h-8"
            />
            {errors.dateOfBirth && (
              <div className="text-red-600 text-sm">
                {errors.dateOfBirth.message}
              </div>
            )}
          </label>
          <label>
            <div className="mt-3"> Age:</div>
            <input
              type="Number"
              {...register("age")}
              value={ageTillDate}
              readOnly
              className="w-full outline-none border border-neutral-300 rounded pl-2 focus-within:border-amber-800 bg-blue-50 h-8"
            />
          </label>
          <div className="flex gap-5">
            <button
              className={`${
                showData ? "bg-blue-300" : "bg-blue-700"
              }  text-2xl px-16 py-2.5 mt-4 my-12 rounded-2xl cursor-pointer text-white`}
              type="submit"
              disabled={isSubmitting || showData}
            >
              Submit
            </button>
            <div>
              {showData && (
                <div
                  onClick={() => setSavedData(true)}
                  className="bg-blue-700 text-2xl px-16 py-2.5 mt-4 my-12 rounded-2xl text-white"
                >{`View submitted Data-->`}</div>
              )}
            </div>
          </div>
        </form>
      </div>
      {savedData && <SavedDataPage data={formData} />}
    </div>
  );
};

export default App;
