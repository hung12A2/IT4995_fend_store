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

const ShopInfo = () => {
  const { data, isLoading } = useGetIdentity();
  const [shopInfo, setShopInfo] = useState<any>();
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
      let dataShop: any = await axios
        .get(`myStoreInfo`)
        .then((res) => res)
        .catch((e) => console.log(e));

      let shop = dataShop.shop;
      shop.pickUpProvince = `${shop.pickUpProvinceName}-${shop.pickUpProvinceId}`;
      shop.pickUpDistrict = `${shop.pickUpDistrictName}-${shop.pickUpDistrictId}`;
      shop.returnProvince = `${shop.returnProvinceName}-${shop.returnProvinceId}`;
      shop.returnDistrict = `${shop.returnDistrictName}-${shop.returnDistrictId}`;
      shop.pickUpWard = `${shop.pickUpWardName}-${shop.pickUpWardId}`;
      shop.returnWard = `${shop.returnWardName}-${shop.returnWardId}`;

      dataShop.shop = shop;

      setShopInfo(dataShop);

      setSeletedProvince(dataShop?.shop?.pickUpProvince);
      setSeletedDistrict(dataShop?.shop?.pickUpDistrict);
      setSeletedProvince2(dataShop?.shop?.returnProvince);
      setSeletedDistrict2(dataShop?.shop?.returnDistrict);

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
                  .post(`/uploadAvatar/shop`, formData, {
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
                  .post(`/uploadCoverImage/shop`, formData, {
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
        <div>Shop Avatar </div>

        {!isLoading && (
          <>
            <div className="flex flex-col items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex justify-center w-full mt-4">
                  {shopInfo?.shop.coverImage?.url != "" ? (
                    <img
                      src={shopInfo?.shop.coverImage?.url}
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
                  {shopInfo?.shop.avatar?.url ? (
                    <img
                      src={shopInfo?.shop.avatar?.url}
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
                {roundToTwoDecimalPlaces(+shopInfo?.shopInfo?.avgRating)}
              </div>
              <div>So danh gia: {shopInfo?.shopInfo?.numberOfRating}</div>
              <div>So san pham da ban: {shopInfo?.shopInfo?.numberOfSold}</div>
              <div>So san pham: {shopInfo?.shopInfo?.numberOfProduct}</div>
              <div>Tong so Order: {shopInfo?.shopInfo?.numberOfOrder}</div>
              <div>
                Tong so Order thanh cong:{" "}
                {shopInfo?.shopInfo?.numberOfSuccesOrder}
              </div>
              <div>
                Tong so Order bi tra lai:{" "}
                {shopInfo?.shopInfo?.numberOfReturnOrder}
              </div>
              <div>
                Tong so Order da tu choi:{" "}
                {shopInfo?.shopInfo?.numberOfRejectOrder}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-14">
        <div className="flex flex-row justify-between items-center">
          <div>Shop Profile</div>
        </div>
        <Form
          className="grid grid-cols-1 px-4 mt-6 gap-y-3"
          defaultValues={shopInfo?.shop}
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
            } = data;

            const dataReturn: any = await axios.patch(`stores`, {
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
            });

            if (dataReturn.id) {
              toast({
                title: "Update shop info success",
                description: `Update success at ${new Date().toLocaleString()}.`,
              });
            } else {
              toast({
                title: "Update shop info failed",
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

export default ShopInfo;
