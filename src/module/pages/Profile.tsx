/* eslint-disable @next/next/no-img-element */
"use client";
import {
  DateField,
  DateInput,
  Form,
  TextInput,
  useGetIdentity,
} from "react-admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { use, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "../AxiosCustom/custome_Axios";
import { BASE_URL } from "@/api/constant";
import { useToast } from "@/components/ui/use-toast";
import { PasswordField } from "../base/fieldBase";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { FormProvider, useForm } from "react-hook-form";
import { authProvider } from "@/provider/authProvider";
import { useRedirect } from "react-admin";

export const Profile = () => {
  const formContext = useForm({});
  const { handleSubmit } = formContext;
  const [rerender, setRerender] = useState(false);
  const { data, isLoading } = useGetIdentity();
  const token: any = data?.token;
  const [user, setUser] = useState<any>();
  useEffect(() => {
    let token: any = localStorage.getItem("token");
    token = JSON.parse(token);
    token = token.token;
    axios
      .get(`/whoAmI`)
      .then((res) => {
        console.log(res);
        setUser(res);
      })
      .catch((e) => console.log(e));
  }, [rerender]);
  const [open, setOpen] = useState(false);
  const [openFormChangePass, setOpenFormChangePass] = useState(false);
  const [imgFile, setImgFile] = useState<any>();
  const [imgLink, setImgLink] = useState("");
  const { toast } = useToast();

  const redirect = useRedirect();

  const fileInputRef: any = useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgLink(URL.createObjectURL(file));
      setOpen(true);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid md:grid-cols-2 w-full h-full px-4 border-l-2 mb-12">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Preview Avatar</DialogTitle>

          <DialogDescription>
            <img src={imgLink} alt="avatar" className="w-full" />
          </DialogDescription>

          <DialogFooter>
            <Button
              variant={"destructive"}
              className="mr-4"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                let formData = new FormData();
                formData.append("avatar", imgFile);
                const res = await axios
                  .post(`uploadAvatar/user`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((res) => res.data)
                  .catch((e) => console.log(e));

                if (res.code == 200) {
                  toast({
                    title: "Create success",
                    description: `Create success at ${new Date().toLocaleString()}.`,
                  });
                  setRerender(!rerender);
                }
                setOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="mt-12">
        <div>Admin Avatar </div>

        {!isLoading && (
          <>
            <div className="flex flex-col items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex justify-center w-1/2 mt-4">
                  {user?.avatar?.url ? (
                    <img
                      src={user?.avatar?.url}
                      alt="avatar"
                      className="aspect-[1] rounded-lg hover:brightness-110 transition duration-500 hover:cursor-grab"
                    />
                  ) : (
                    <img
                      src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTy-6oqxazyyxQwrNeitM4NDATAlVycYmNjqc4H37cmA&s`}
                      alt="avatar"
                      className="aspect-[1] rounded-lg hover:brightness-110 transition duration-500 hover:cursor-grab"
                    />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="hover:bg-gray-100 hover:cursor-grab">
                    View Avatar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-gray-100 hover:cursor-grab"
                    onClick={handleUploadClick}
                  >
                    Upload new avatar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="w-5/6 mt-6 border-2"></div>
            </div>
            <div className="mt-4">
              <div>Admin Permissions</div>
              {(user?.permissions == "all" ||
                user?.permissions
                  .split("|")
                  .includes("RequestCreateShops-Managment")) && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      Quan ly yeu cau tao shop
                    </AccordionTrigger>
                    <AccordionContent className="ml-6">
                      Danh sach yeu cau tao shop
                    </AccordionContent>
                    <AccordionContent className="ml-6">
                      Chap nhan yeu cau tao shop
                    </AccordionContent>
                    <AccordionContent className="ml-6">
                      Tu choi yeu cau tao shop
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {(user?.permissions == "all" ||
                user?.permissions
                  .split("|")
                  .includes("Products-Managment")) && (
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Quan ly yeu cau tao san pham
                      </AccordionTrigger>
                      <AccordionContent className="ml-6">
                        Danh sach yeu cau tao san pham
                      </AccordionContent>
                      <AccordionContent className="ml-6">
                        Chap nhan / tu choi yeu cau tao san pham
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Quan ly danh muc san pham
                      </AccordionTrigger>
                      <AccordionContent className="ml-6">
                        Danh sach san pham cac shop
                      </AccordionContent>
                      <AccordionContent className="ml-6">
                        Ngung ban san pham
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {(user?.permissions == "all" ||
                user?.permissions.split("|").includes("Kiots-Managment")) && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Quan ly Kiot</AccordionTrigger>
                    <AccordionContent className="ml-6">
                      Danh sach cac Kiot
                    </AccordionContent>
                    <AccordionContent className="ml-6">
                      Thay doi trang thai cac kiot
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              {user?.permissions == "all" && (
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Quan ly cac khu vuc giao hoa toc
                      </AccordionTrigger>
                      <AccordionContent className="ml-6">
                        Danh sach khu vuc giao hoa toc
                      </AccordionContent>
                      <AccordionContent className="ml-6">
                        Tao khuc vuc giao hoa toc
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Quan ly admin he thong
                      </AccordionTrigger>
                      <AccordionContent className="ml-6">
                        Xem danh admin trong het thong
                      </AccordionContent>
                      <AccordionContent className="ml-6">
                        Thay doi trang thai admin trong he thong
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {(user?.permissions == "all" ||
                user?.permissions.split("|").includes("Users-Managment")) && (
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Quan ly nguoi dung</AccordionTrigger>
                      <AccordionContent className="ml-6">
                        Xem danh sach nguoi dung
                      </AccordionContent>
                      <AccordionContent className="ml-6">
                        Thay doi trang thai nguoi dung
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {(user?.permissions == "all" ||
                user?.permissions.split("|").includes("Shops-Managment")) && (
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Quan ly shop</AccordionTrigger>
                      <AccordionContent className="ml-6">
                        Xem danh sach shop
                      </AccordionContent>
                      <AccordionContent className="ml-6">
                        Thay doi trang thai shop
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        Quan ly nhan vien shop
                      </AccordionTrigger>
                      <AccordionContent className="ml-6">
                        Xem danh sach nhan vien shop
                      </AccordionContent>
                      <AccordionContent className="ml-6">
                        Thay doi trang thai nhan vien shop
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {(user?.permissions == "all" ||
                user?.permissions.split("|").includes("Orders-Managment")) && (
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Quan ly order</AccordionTrigger>
                      <AccordionContent className="ml-6">
                        Xem danh sach order
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {(user?.permissions == "all" ||
                user?.permissions
                  .split("|")
                  .includes("Transactions-Managment")) && (
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Quan ly giao dich</AccordionTrigger>
                      <AccordionContent className="ml-6">
                        Xem danh sach giao dich
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="mt-14">
        <div className="flex flex-row justify-between items-center">
          <div>Admin Profile</div>
          <Dialog
            open={openFormChangePass}
            onOpenChange={setOpenFormChangePass}
          >
            <DialogTrigger>
              <div className="px-4 py-2 rounded-lg bg-sky-200 hover:bg-sky-300 ">
                Change password
              </div>
            </DialogTrigger>
            <DialogContent>
              <FormProvider {...formContext}>
                <DialogTitle>Change password</DialogTitle>
                <DialogDescription>
                  <div className="mb-4">
                    <PasswordField
                      name="oldPassword"
                      label="oldPassword"
                      placeholder="oldPassword"
                      required={true}
                    />
                  </div>
                  <div className="mb-4">
                    <PasswordField
                      name="newPassword"
                      label="newPassword"
                      placeholder="newPassword"
                      required={true}
                    />
                  </div>
                  <div className="mb-4">
                    <PasswordField
                      name="reNewPassword"
                      label="reNewPassword"
                      placeholder="reNewPassword"
                      required={true}
                    />
                  </div>
                </DialogDescription>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setOpenFormChangePass(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit(async (data) => {
                      const { oldPassword, newPassword, reNewPassword } = data;
                      if (newPassword !== reNewPassword) {
                        toast({
                          title: "Password not match",
                          description: "Please check your password again",
                        });
                      } else {
                        const data: any = await axios
                          .post("/changePassword/admin", {
                            oldPassword,
                            newPassword,
                          })
                          .then((res) => res)
                          .catch((e) => console.log(e));

                        if (data.code !== 200) {
                          toast({
                            title: "Invalid old password",
                            variant: "destructive",
                          });
                        } else {
                          toast({
                            title:
                              "Change password success, Please login again",
                          });
                          setOpenFormChangePass(false);
                          authProvider.logout("logout");
                          redirect("/login");
                        }
                      }
                    })}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </FormProvider>
            </DialogContent>
          </Dialog>
        </div>
        <Form
          className="grid grid-cols-1 px-4 mt-6 gap-y-3"
          defaultValues={{
            id: `${user?.id}`,
            email: `${user?.email}`,
            role: `${user?.role}`,
            status: `${user?.status}`,
            createdAt: `${user?.createdAt}`,
            updatedAt: `${user?.updatedAt}`,
          }}
        >
          <TextInput disabled={true} source="id"></TextInput>
          <TextInput disabled={true} source="email"></TextInput>
          <TextInput disabled={true} source="role"></TextInput>
          <TextInput disabled={true} source="status"></TextInput>
          <DateInput disabled={true} source="createdAt"></DateInput>
          <DateInput disabled={true} source="updatedAt"></DateInput>
        </Form>
      </div>
    </div>
  );
};
