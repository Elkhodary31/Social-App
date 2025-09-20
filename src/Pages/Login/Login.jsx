import { useContext, useEffect, useState } from "react";
import { SlSocialStumbleupon } from "react-icons/sl";
import { Form, Input, Button, RadioGroup, Radio } from "@heroui/react";
import { DatePicker } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function AuthPage() {
  const{setUserToken}=useContext(AuthContext);
  const [isLoading, setisLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [errorMessage, setErrorMessage] = useState(null);
  const Navigate =useNavigate()
  function isValidDateOfBirth(val, minAge = 14) {
    const [day, month, year] = val.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const now = new Date();

    if (date >= now) return false;

    let age = now.getFullYear() - date.getFullYear();
    const m = now.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < date.getDate())) {
      age--;
    }

    return age >= minAge;
  }

  const registerSchema = zod
    .object({
      name: zod
        .string()
        .nonempty("Name is required")
        .min(3, "Please enter a valid name"),

      email: zod
        .string()
        .nonempty("Email is required")
        .email("Please enter a valid email address"),

      password: zod
        .string()
        .nonempty("Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
          "Password must contain at least one uppercase , number, and  special character"
        ),

      rePassword: zod.string().nonempty("Please confirm your password"),

      dateOfBirth: zod
        .string()
        .nonempty("Date of birth is required")
        .regex(
          /^\d{1,2}-\d{1,2}-\d{4}$/,
          "Date of birth must be in format D-M-YYYY"
        )
        .refine((val) => isValidDateOfBirth(val, 14), {
          message: "You must be at least 14 years old and not from the future",
        }),

      gender: zod
        .string()
        .nonempty("Gender is required")
        .refine((val) => ["male", "female"].includes(val), {
          message: "Invalid gender selected",
        }),
    })
    .refine((data) => data.password === data.rePassword, {
      path: ["rePassword"],
      message: "Passwords do not match",
    });

  const loginSchema = zod.object({
    email: zod
      .string()
      .nonempty("Email is required")
      .email("Please enter a valid email address"),

    password: zod.string().nonempty("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    clearErrors,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    mode: "all",
    resolver: zodResolver(activeTab === "login" ? loginSchema : registerSchema),
  });
  useEffect(() => {
    clearErrors();
    reset();
  }, [activeTab, clearErrors, reset]);
  const { email, password } = watch();

  useEffect(() => {
    setErrorMessage(null);
  }, [email, password]);

  function handleRegister(values) {
    console.log("values", values);
    setisLoading(true);
    if (activeTab !== "login")
      axios
        .post("https://linked-posts.routemisr.com/users/signup", values)
        .then(() => {
          setisLoading(false);
          setErrorMessage(null);
          setActiveTab('login')
        })
        .catch((err) => {
          setErrorMessage(err.response.data.error);
        });
    else if (activeTab === "login") {
      axios
        .post("https://linked-posts.routemisr.com/users/signin", values)
        .then((res) => {
          setUserToken(res.data.token)
          localStorage.setItem('token',res.data.token)
          setisLoading(false);
          setErrorMessage(null);
          Navigate('/')
        })
        .catch((err) => {
          setisLoading(false);
          setErrorMessage("Password or Email is Invalid");
          console.log(err);
        });
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-dvh center flex-wrap md:!justify-around gap-5 container mx-auto w-4/5">
        <div className="center gap-5 text-4xl font-bold text-blue-600">
          <div className="text-black text-4xl">
            <SlSocialStumbleupon />
          </div>
          <div>
            <h1>Social App</h1>
          </div>
        </div>
        <div className="bg-gray-200 p-6 rounded-2xl shadow-2xl">
          <div className="relative mb-6  w-full rounded-full bg-gray-200 p-1 shadow-lg">
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-full shadow-md transition-transform duration-300 ease-in-out
      ${
        activeTab === "login"
          ? "translate-x-0 bg-gradient-to-r from-green-400 to-green-600"
          : "translate-x-full bg-gradient-to-r from-blue-400 to-blue-600"
      }`}
            ></div>

            <button
              className={`relative z-10 w-1/2 py-2 font-semibold transition-colors duration-500 ease-in-out cursor-pointer
      ${activeTab === "login" ? "text-white" : "text-gray-700"}`}
              onClick={() => {
                setActiveTab("login");
                setErrorMessage(null);
              }}
            >
              Login
            </button>
            <button
              className={`relative z-10 w-1/2 py-2 font-semibold transition-colors duration-500 ease-in-out cursor-pointer
      ${activeTab === "signup" ? "text-white" : "text-gray-700"}`}
              onClick={() => {
                setActiveTab("signup");
                setErrorMessage(null);
              }}
            >
              Signup
            </button>
          </div>
          {errorMessage && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-100 px-4 py-3 text-center shadow-md">
              <p className="text-sm font-medium text-red-700">{errorMessage}</p>
            </div>
          )}

          <form
            className="w-full justify-center items-center space-y-4"
            onSubmit={handleSubmit(handleRegister)}
          >
            <div className="flex flex-col gap-2 w-sm">
              {activeTab !== "login" && (
                <div className="">
                  <label className="text-sm">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <Input
                    labelPlacement="outside"
                    placeholder="Enter your name"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}
              <div className="">
                <label className="text-sm">
                  Email <span className="text-red-600">*</span>
                </label>

                <Input
                  type="text"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="">
                <label className="text-sm">
                  Password <span className="text-red-600">*</span>
                </label>

                <Input
                  labelPlacement="outside"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {activeTab !== "login" && (
                <div className="">
                  <label className="text-sm">
                    Confirm Password <span className="text-red-600">*</span>
                  </label>

                  <Input
                    labelPlacement="outside"
                    type="password"
                    placeholder="Confirm your password"
                    {...register("rePassword")}
                  />
                  {errors.rePassword && (
                    <p className="text-sm text-red-600">
                      {errors.rePassword.message}
                    </p>
                  )}
                </div>
              )}
              {activeTab !== "login" && (
                <div className="">
                  <label className="text-sm font-sans text-gray-700">
                    Date of birth <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        granularity="day"
                        onChange={(date) => {
                          if (date) {
                            const day = String(date.day).padStart(2, "0");
                            const month = String(date.month).padStart(2, "0");
                            const year = date.year;
                            field.onChange(`${day}-${month}-${year}`);
                          } else {
                            field.onChange("");
                          }
                        }}
                      />
                    )}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-600">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>
              )}

              {activeTab !== "login" && (
                <div className="">
                  <label className="text-sm font-sans text-gray-700">
                    Select Your Gender <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        orientation="horizontal"
                      >
                        <Radio value="female">Female</Radio>
                        <Radio value="male">Male</Radio>
                      </RadioGroup>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-sm text-red-600">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  className={`w-full text-white ${
                    activeTab === "login" ? "bg-green-500" : ""
                  }`}
                  color={activeTab === "login" ? "" : "primary"}
                  type="submit"
                  isDisabled={isLoading}
                >
                  Submit
                </Button>
                {activeTab !== "login" && (
                  <Button type="reset" variant="bordered">
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </form>
          {activeTab && (
            <p className="text-center text-md pt-3 text-gray-600">
              {activeTab === "login"
                ? "Don’t have an account?"
                : "Already have an account?"}{" "}
              <span
                className="cursor-pointer text-blue-500 font-bold hover:underline"
                onClick={() => {
                  setActiveTab(activeTab === "login" ? "signup" : "login");
                  setErrorMessage(null);
                }}
              >
                {activeTab === "login" ? "Sign up here" : "Login here"}
              </span>
            </p>
          )}
        </div>
      </div>
    </>
  );
}
