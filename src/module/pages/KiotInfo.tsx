/* eslint-disable @next/next/no-img-element */
"use client";
import {
  DateField,
  DateInput,
  Form,
  SelectInput,
  TextInput,
  useGetIdentity,
  useRefresh,
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
import { FormProvider, set, useForm } from "react-hook-form";
import { authProvider } from "@/provider/authProvider";
import { useRedirect } from "react-admin";
import { RichTextInput } from "ra-input-rich-text";

function roundToTwoDecimalPlaces(num: number) {
  return parseFloat(num.toFixed(2));
}

const KiotInfo = () => {
  const { data, isLoading } = useGetIdentity();
  const [kiotInfo, setkiotInfo] = useState<any>();
  const user = data?.user;
  const formContext = useForm({});
  const { handleSubmit } = formContext;
  const [rerender, setRerender] = useState(false);

  const [listProvince, setListProvince] = useState<any>([]);
  const [listDistrict, setListDistrict] = useState<any>([]);
  const [listDistrict2, setListDistrict2] = useState<any>([]);
  const [listWard, setListWard] = useState<any>([]);
  const [listWard2, setListWard2] = useState<any>([]);
  const [seletedProvince, setSeletedProvince] = useState<any>();
  const [seletedDistrict, setSeletedDistrict] = useState<any>();
  const [seletedProvince2, setSeletedProvince2] = useState<any>();
  const [seletedDistrict2, setSeletedDistrict2] = useState<any>();

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [openFormChangePass, setOpenFormChangePass] = useState(false);
  const [imgFile, setImgFile] = useState<any>();
  const [imgFile2, setImgFile2] = useState<any>();
  const [imgLink2, setImgLink2] = useState("");

  const [imgLink, setImgLink] = useState("");
  const { toast } = useToast();

  const redirect = useRedirect();

  const fileInputRef: any = useRef(null);
  const fileInputRef2: any = useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleUploadClick2 = () => {
    fileInputRef2.current.click();
  };

  const handleFileChange2 = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile2(file);
      setImgLink2(URL.createObjectURL(file));
      setOpen2(true);
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgLink(URL.createObjectURL(file));
      setOpen(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      let datakiot: any = await axios
        .get(`myKiotInfo`)
        .then((res) => res)
        .catch((e) => console.log(e));

      let kiot = datakiot.kiot;
      kiot.pickUpProvince = `${kiot.pickUpProvinceName}-${kiot.pickUpProvinceId}`;
      kiot.pickUpDistrict = `${kiot.pickUpDistrictName}-${kiot.pickUpDistrictId}`;
      kiot.returnProvince = `${kiot.returnProvinceName}-${kiot.returnProvinceId}`;
      kiot.returnDistrict = `${kiot.returnDistrictName}-${kiot.returnDistrictId}`;
      kiot.pickUpWard = `${kiot.pickUpWardName}-${kiot.pickUpWardId}`;
      kiot.returnWard = `${kiot.returnWardName}-${kiot.returnWardId}`;

      datakiot.kiot = kiot;

      setkiotInfo(datakiot);

      setSeletedProvince(datakiot?.kiot?.pickUpProvince);
      setSeletedDistrict(datakiot?.kiot?.pickUpDistrict);
      setSeletedProvince2(datakiot?.kiot?.returnProvince);
      setSeletedDistrict2(datakiot?.kiot?.returnDistrict);

      let dataProvince = await axios
        .post(`location/province`, {})
        .then((res) => res.data)
        .catch((e) => console.log(e));

      dataProvince = dataProvince.map((item: any) => {
        return {
          provinceId: `${item.provinceName}-${item.provinceId}`,
          provinceName: item.provinceName,
        };
      });

      setListProvince(dataProvince);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      let dataDistrict = await axios
        .post(`location/district/${seletedProvince.split("-")[1]}`, {})
        .then((res) => res.data)
        .catch((e) => console.log(e));

      dataDistrict = dataDistrict.map((item: any) => {
        return {
          districtId: `${item.districtName}-${item.districtId}`,
          districtName: item.districtName,
        };
      });

      setListDistrict(dataDistrict);
    }

    fetchData();
  }, [seletedProvince]);

  useEffect(() => {
    async function fetchData() {
      let dataDistrict = await axios
        .post(`location/district/${seletedProvince2.split("-")[1]}`, {})
        .then((res) => res.data)
        .catch((e) => console.log(e));

      dataDistrict = dataDistrict.map((item: any) => {
        return {
          districtId: `${item.districtName}-${item.districtId}`,
          districtName: item.districtName,
        };
      });

      setListDistrict2(dataDistrict);
    }

    fetchData();
  }, [seletedProvince2]);

  useEffect(() => {
    async function fetchData() {
      let dataWard = await axios
        .post(`location/ward/${seletedDistrict.split("-")[1]}`, {})
        .then((res) => res.data)
        .catch((e) => console.log(e));

      dataWard = dataWard.map((item: any) => {
        return {
          wardCode: `${item.wardName}-${item.wardCode}`,
          wardName: item.wardName,
        };
      });
      setListWard(dataWard);
    }

    fetchData();
  }, [seletedDistrict]);

  useEffect(() => {
    async function fetchData() {
      let dataWard = await axios
        .post(`location/ward/${seletedDistrict2.split("-")[1]}`, {})
        .then((res) => res.data)
        .catch((e) => console.log(e));

      dataWard = dataWard.map((item: any) => {
        return {
          wardCode: `${item.wardName}-${item.wardCode}`,
          wardName: item.wardName,
        };
      });

      setListWard2(dataWard);
    }

    fetchData();
  }, [seletedDistrict2]);

  if (isLoading) return <div>Loading...</div>;

  if (user?.role != "customer") {
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
                  const res: any = await axios
                    .post(`/uploadAvatar/kiot`, formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    })
                    .then((res) => res)
                    .catch((e) => console.log(e));

                  if (res.id) {
                    toast({
                      title: "Upload avatar success",
                      description: `Upload success at ${new Date().toLocaleString()}.`,
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
        {/* comment */}
        <Dialog open={open2} onOpenChange={setOpen2}>
          <DialogContent>
            <DialogTitle>Preview CoverImg</DialogTitle>

            <DialogDescription>
              <img
                src={imgLink2}
                alt="coverImage"
                className="w-full aspect-[2.63]"
              />
            </DialogDescription>

            <DialogFooter>
              <Button
                variant={"destructive"}
                className="mr-4"
                onClick={() => {
                  setOpen2(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  let formData = new FormData();
                  formData.append("coverImage", imgFile2);
                  const res: any = await axios
                    .post(`/uploadCoverImage/kiot`, formData, {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    })
                    .then((res) => res)
                    .catch((e) => console.log(e));

                  if (res.id) {
                    toast({
                      title: "Upload cover image success",
                      description: `Upload success at ${new Date().toLocaleString()}.`,
                    });
                    setRerender(!rerender);
                  }
                  setOpen2(false);
                }}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <input
          type="file"
          ref={fileInputRef2}
          className="hidden"
          onChange={handleFileChange2}
        />
        <div className="mt-12">
          <div>Kiot Avatar </div>

          {!isLoading && (
            <>
              <div className="flex flex-col items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex justify-center w-full mt-4">
                    {kiotInfo?.kiot.coverImage?.url != "" ? (
                      <img
                        src={kiotInfo?.kiot.coverImage?.url}
                        alt="avatar"
                        className="rounded-full aspect-[2.63] w-full rounded-lg hover:brightness-110 transition duration-500 hover:cursor-grab"
                      />
                    ) : (
                      <img
                        src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQtqB4g6GQ5QPHLlf1dduVTt7xy3gEnM_fB4NA1IZ2YQ&s`}
                        alt="avatar"
                        className="rounded-full aspect-[2.63] w-full rounded-lg hover:brightness-110 transition duration-500 hover:cursor-grab"
                      />
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="hover:bg-gray-100 hover:cursor-grab">
                      View CoverImg
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex justify-center h-fit rounded-full aspect-[1] translate-y-[-50%]  bg-white w-1/4 mt-4">
                    {kiotInfo?.kiot.avatar?.url ? (
                      <img
                        src={kiotInfo?.kiot.avatar?.url}
                        alt="avatar"
                        className="aspect-[1] p-2 bg-white rounded-full hover:brightness-110 transition duration-500 hover:cursor-grab"
                      />
                    ) : (
                      <img
                        src={`https://github.com/shadcn.png`}
                        alt="avatar"
                        className="aspect-[1] p-2 bg-white rounded-full hover:brightness-110 transition duration-500 hover:cursor-grab"
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
                <div className="w-5/6 border-2"></div>
              </div>
              <div className=" md:grid  md:grid-cols-2  flex flex-col gap-y-2 mt-4">
                <div>
                  Danh gia trung binh:{" "}
                  {roundToTwoDecimalPlaces(+kiotInfo?.kiotInfo?.avgRating)}
                </div>
                <div>So danh gia: {kiotInfo?.kiotInfo?.numberOfRating}</div>
                <div>
                  So san pham da ban: {kiotInfo?.kiotInfo?.numberOfSold}
                </div>
                <div>So san pham: {kiotInfo?.kiotInfo?.numberOfProduct}</div>
                <div>Tong so Order: {kiotInfo?.kiotInfo?.numberOfOrder}</div>
                <div>
                  Tong so Order thanh cong:{" "}
                  {kiotInfo?.kiotInfo?.numberOfSuccesOrder}
                </div>
                <div>
                  Tong so Order bi tra lai:{" "}
                  {kiotInfo?.kiotInfo?.numberOfReturnOrder}
                </div>
                <div>
                  Tong so Order da tu choi:{" "}
                  {kiotInfo?.kiotInfo?.numberOfRejectOrder}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-14">
          <div className="flex flex-row justify-between items-center">
            <div>Kiot Profile</div>
          </div>
          <Form
            className="grid grid-cols-1 px-4 mt-6 gap-y-3"
            defaultValues={kiotInfo?.kiot}
          >
            <TextInput disabled={true} source="id"></TextInput>
            <TextInput disabled={true} source="email"></TextInput>
            <TextInput disabled={true} source="name"></TextInput>
            <TextInput disabled={true} source="description"></TextInput>
            <TextInput disabled={true} source="pickUpAddress"></TextInput>
            <TextInput disabled={true} source="phoneNumber"></TextInput>
            <TextInput disabled={true} source="pickUpProvince"></TextInput>
            <TextInput disabled={true} source="pickUpDistrict"></TextInput>
            <TextInput disabled={true} source="pickUpWard"></TextInput>
            <TextInput disabled={true} source="returnAddress"></TextInput>
            <TextInput disabled={true} source="returnProvince"></TextInput>
            <TextInput disabled={true} source="returnDistrict"></TextInput>
            <TextInput disabled={true} source="returnWard"></TextInput>
            <TextInput disabled={true} source="status"></TextInput>
            <DateField disabled={true} source="createdAt"></DateField>
            <DateField disabled={true} source="updatedAt"></DateField>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 w-full h-full px-4 border-l-2 mb-12">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Preview Avatar</DialogTitle>

          <DialogDescription>
            <img src={imgLink} alt="avatar" className="w-full aspect-[1]" />
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
                const res: any = await axios
                  .post(`/uploadAvatar/kiot`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((res) => res)
                  .catch((e) => console.log(e));

                if (res.id) {
                  toast({
                    title: "Upload avatar success",
                    description: `Upload success at ${new Date().toLocaleString()}.`,
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
      {/* comment */}
      <Dialog open={open2} onOpenChange={setOpen2}>
        <DialogContent>
          <DialogTitle>Preview CoverImg</DialogTitle>

          <DialogDescription>
            <img
              src={imgLink2}
              alt="coverImage"
              className="w-full aspect-[2.63]"
            />
          </DialogDescription>

          <DialogFooter>
            <Button
              variant={"destructive"}
              className="mr-4"
              onClick={() => {
                setOpen2(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                let formData = new FormData();
                formData.append("coverImage", imgFile2);
                const res: any = await axios
                  .post(`/uploadCoverImage/kiot`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((res) => res)
                  .catch((e) => console.log(e));

                if (res.id) {
                  toast({
                    title: "Upload cover image success",
                    description: `Upload success at ${new Date().toLocaleString()}.`,
                  });
                  setRerender(!rerender);
                }
                setOpen2(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <input
        type="file"
        ref={fileInputRef2}
        className="hidden"
        onChange={handleFileChange2}
      />
      <div className="mt-12">
        <div>kiot Avatar </div>

        {!isLoading && (
          <>
            <div className="flex flex-col items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex justify-center w-full mt-4">
                  {kiotInfo?.kiot.coverImage?.url != "" ? (
                    <img
                      src={kiotInfo?.kiot.coverImage?.url}
                      alt="avatar"
                      className="rounded-full aspect-[2.63] w-full rounded-lg hover:brightness-110 transition duration-500 hover:cursor-grab"
                    />
                  ) : (
                    <img
                      src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQtqB4g6GQ5QPHLlf1dduVTt7xy3gEnM_fB4NA1IZ2YQ&s`}
                      alt="avatar"
                      className="rounded-full aspect-[2.63] w-full rounded-lg hover:brightness-110 transition duration-500 hover:cursor-grab"
                    />
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem className="hover:bg-gray-100 hover:cursor-grab">
                    View CoverImg
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-gray-100 hover:cursor-grab"
                    onClick={handleUploadClick2}
                  >
                    Upload new CoverImg
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex justify-center h-fit rounded-full aspect-[1] translate-y-[-50%]  bg-white w-1/4 mt-4">
                  {kiotInfo?.kiot.avatar?.url ? (
                    <img
                      src={kiotInfo?.kiot.avatar?.url}
                      alt="avatar"
                      className="aspect-[1] p-2 bg-white rounded-full hover:brightness-110 transition duration-500 hover:cursor-grab"
                    />
                  ) : (
                    <img
                      src={`https://github.com/shadcn.png`}
                      alt="avatar"
                      className="aspect-[1] p-2 bg-white rounded-full hover:brightness-110 transition duration-500 hover:cursor-grab"
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
              <div className="w-5/6 border-2"></div>
            </div>
            <div className=" md:grid  md:grid-cols-2  flex flex-col gap-y-2 mt-4">
              <div>
                Danh gia trung binh:{" "}
                {roundToTwoDecimalPlaces(+kiotInfo?.kiotInfo?.avgRating)}
              </div>
              <div>So danh gia: {kiotInfo?.kiotInfo?.numberOfRating}</div>
              <div>So san pham da ban: {kiotInfo?.kiotInfo?.numberOfSold}</div>
              <div>So san pham: {kiotInfo?.kiotInfo?.numberOfProduct}</div>
              <div>Tong so Order: {kiotInfo?.kiotInfo?.numberOfOrder}</div>
              <div>
                Tong so Order thanh cong:{" "}
                {kiotInfo?.kiotInfo?.numberOfSuccesOrder}
              </div>
              <div>
                Tong so Order bi tra lai:{" "}
                {kiotInfo?.kiotInfo?.numberOfReturnOrder}
              </div>
              <div>
                Tong so Order da tu choi:{" "}
                {kiotInfo?.kiotInfo?.numberOfRejectOrder}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-14">
        <div className="flex flex-row justify-between items-center">
          <div>kiot Profile</div>
        </div>
        <Form
          className="grid grid-cols-1 px-4 mt-6 gap-y-3"
          defaultValues={kiotInfo?.kiot}
          onSubmit={async (data: any) => {
            const {
              name,
              description,
              pickUpAddress,
              returnAddress,
              pickUpProvince,
              returnProvince,
              pickUpDistrict,
              returnDistrict,
              pickUpWard,
              returnWard,
              phoneNumber,
              idOfArea,
            } = data;

            const dataReturn: any = await axios.patch(`kiots`, {
              name,
              description,
              pickUpAddress,
              returnAddress,
              pickUpProvince,
              returnProvince,
              pickUpDistrict,
              returnDistrict,
              pickUpWard,
              returnWard,
              phoneNumber,
              idOfArea
            });

            if (dataReturn.id) {
              toast({
                title: "Update kiot info success",
                description: `Update success at ${new Date().toLocaleString()}.`,
              });
            } else {
              toast({
                title: "Update kiot info failed",
                description: `Update failed at ${new Date().toLocaleString()}.`,
              });
            }
          }}
        >
          <TextInput disabled={true} source="id"></TextInput>
          <TextInput disabled={true} source="email"></TextInput>
          <TextInput source="name"></TextInput>
          <RichTextInput source="description"></RichTextInput>

          <TextInput source="phoneNumber"></TextInput>
          <TextInput source="pickUpAddress"></TextInput>
          <SelectInput
            source="pickUpProvince"
            choices={listProvince}
            optionText="provinceName"
            optionValue="provinceId"
            onChange={(e) => {
              setSeletedProvince(e.target.value);
            }}
          ></SelectInput>
          <SelectInput
            source="pickUpDistrict"
            choices={listDistrict}
            optionText="districtName"
            optionValue="districtId"
            onChange={(e) => {
              console.log(e.target.value);
              setSeletedDistrict(e.target.value);
            }}
          ></SelectInput>
          <SelectInput
            source="pickUpWard"
            choices={listWard}
            optionText="wardName"
            optionValue="wardCode"
          ></SelectInput>
          <TextInput source="returnAddress"></TextInput>
          <SelectInput
            source="returnProvince"
            choices={listProvince}
            optionText="provinceName"
            optionValue="provinceId"
            onChange={(e) => {
              setSeletedProvince2(e.target.value);
            }}
          ></SelectInput>
          <SelectInput
            source="returnDistrict"
            choices={listDistrict2}
            optionText="districtName"
            optionValue="districtId"
            onChange={(e) => {
              console.log(e.target.value);
              setSeletedDistrict2(e.target.value);
            }}
          ></SelectInput>
          <SelectInput
            source="returnWard"
            choices={listWard2}
            optionText="wardName"
            optionValue="wardCode"
          ></SelectInput>
          <TextInput disabled={true} source="status"></TextInput>
          <DateInput disabled={true} source="createdAt"></DateInput>
          <DateInput disabled={true} source="updatedAt"></DateInput>
          <Button>Submit</Button>
        </Form>
      </div>
    </div>
  );
};

export default KiotInfo;