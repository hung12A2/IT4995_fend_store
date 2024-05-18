/* eslint-disable @next/next/no-img-element */
"use client";
import { useForm, FormProvider } from "react-hook-form";
import { EmailField, PasswordField } from "../base/fieldBase";
import { useRouter } from "next/navigation";
import { useLogin } from "react-admin";
import { useToast } from "@/components/ui/use-toast";
import { useRedirect } from "react-admin";

export const Login = () => {
  const { toast } = useToast();
  const login = useLogin();
  const router = useRouter();
  const redirect = useRedirect();

  const formContext = useForm({});

  const { handleSubmit } = formContext;

  const onSubmit = (data: any) => {
    const { email, password } = data;
    console.log("email", email, "password", password);
    login({ email, password })
      .then((res) => {
        toast({
          title: "Login success",
        });
      })
      .catch((err) => {
        toast({
          title: "Login failed",
          description: `${err}`,
          variant: "destructive",
        });
        console.log("err", err);
      });
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col bg-[url('https://tecwood.com.vn/upload/images/Post/hinh-nen-xanh-la-cay-cute.jpg')]">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center font-semibold">Sign In</h1>

          <FormProvider {...formContext}>
            <div className="mb-4">
              <EmailField
                name="email"
                label="email"
                placeholder="email"
                required={true}
              />
            </div>
            <div className="mb-4 ">
              <PasswordField
                required={true}
                name="password"
                label="password"
                placeholder="password"
              />
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-3"
            >
              Sign In
            </button>
          </FormProvider>

          <div className="text-center text-sm text-grey-dark mt-4">
            <a
              className="no-underline border-b border-grey-dark text-md text-grey-dark text-green-700 font-semibold"
              href="#"
              onClick={() => {}}
            >
              Back To Home
            </a>
          </div>

          <div className="text-center text-sm text-grey-dark mt-4">
            <a
              className="no-underline border-b border-grey-dark text-md text-grey-dark text-blue-700 font-semibold hover:cursor-grab"
              onClick={() => {
                router.push("/forgotPassowrd");
              }}
            >
              Or Reset Password Here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
