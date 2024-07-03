/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  BooleanField,
  Datagrid,
  DateField,
  Edit,
  EditButton,
  EmailField,
  FilterForm,
  FunctionField,
  List,
  NumberField,
  ReferenceField,
  ReferenceManyField,
  RichTextField,
  Show,
  SimpleForm,
  TabbedShowLayout,
  TextField,
  TextInput,
  useGetIdentity,
  useRefresh,
} from "react-admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "../../module/AxiosCustom/custome_Axios";
import { BASE_URL } from "@/api/constant";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@mui/icons-material";
import { Form, FormProvider, useForm } from "react-hook-form";
import { SelectField, TextField as TextField2 } from "../base/fieldBase";
import { checkPermission } from "@/lib/helper";

const postFilters = [
  <TextInput key={"id"} label="id" source="where.id.like" alwaysOn={true} />,
  <TextInput
    key={"fullname"}
    label="Product Name "
    source="where.name.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"idOfCategory"}
    label="idOfCategory"
    source="where.idOfCategory.like"
    alwaysOn={true}
  />,

  <TextInput
    key={"idOfShop"}
    label="idOfShop"
    source="where.idOfShop.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"status"}
    label="status"
    source="where.status.like"
    alwaysOn={true}
  />,
];

export const ListOrder = (props: any) => {
  const { toast } = useToast();
  const refresh = useRefresh();
  const formProvider = useForm({});
  const { handleSubmit } = formProvider;

  const { data } = useGetIdentity();
  const user = data?.user;

  if (checkPermission("Orders-Managment", user?.permissions) == false) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center text-xl font-medium">
        Bạn không có quyền truy cập
      </div>
    );
  }

  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="idOfUser" />
        <TextField source="idOfShop" />
        <NumberField source="priceOfAll" />
        <NumberField source="totalFee" />
        <NumberField source="codAmount" />
        <TextField source="status" />
        <TextField source="paymentMethod" />
        <DateField source="createdAt" />
        <TextField source="requiredNote" />
        <FunctionField
          render={(record: any) => {
            const { id, status } = record;
            if (
              status == "received" ||
              status == "returned" ||
              status == "delivered" ||
              status == "canceled" ||
              status == "rating" ||
              status == "rejected"
            ) {
              return;
            }
            if (status === "pending") {
              return (
                <div className=" flex flex-row gap-x-2">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className="bg-blue-300 hover:bg-blue-400 hover:cursor-grab px-4 py-2 rounded-md">
                        Chấp nhận
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Bạn có muốn chấp nhận đơn hàng này ?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogDescription>
                        <FormProvider {...formProvider}>
                          <div className="mb-4">
                            <TextField2
                              name="content"
                              label="content"
                              placeholder="content"
                              required={true}
                            />
                          </div>
                          <div className="mb-4">
                            <SelectField
                              name="requiredNote"
                              required={true}
                              label="requiredNote"
                              options={[
                                { value: "CHOTHUHANG", label: "Cho thu hang" },
                                {
                                  value: "KHONGCHOXEMHANG",
                                  label: "Khong cho xem hang",
                                },
                                {
                                  value: "CHOXEMHANGKHONGTHU",
                                  label: "Cho xem hang khong thu",
                                },
                              ]}
                            />
                          </div>
                        </FormProvider>
                      </AlertDialogDescription>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleSubmit(async (data) => {
                            data = {
                              content: data.content,
                              requiredNote: data.requiredNote.value,
                            };
                            const dataReturn: any = axios
                              .post(`orders/accepted/order/${id}`, data)
                              .then((res) => res)
                              .catch((e) => console.log(e));
                            if (dataReturn) {
                              toast({
                                title: "Da chap nhan don hang thanh cong",
                              });
                            } else {
                              toast({
                                title: "Da co loi xay ra",
                              });
                            }
                          })}
                        >
                          Chấp nhận
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className="bg-red-300 hover:bg-red-400 hover:cursor-grab px-4 py-2 rounded-md">
                        Từ chối
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogDescription>
                          Bạn có chắc muốn từ chối đơn hàng này ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            const dataFetch = await axios
                              .post(
                                `orders/rejected/order/${id}`,
                                {},
                                {
                                  headers: {
                                    Authorization: `Bearer ${data?.token}`,
                                  },
                                }
                              )
                              .then((res) => res.data)
                              .catch((e) => console.log(e));

                            if (dataFetch.code == 200)
                              toast({
                                title: "Ban success",
                              });

                            refresh();
                          }}
                        >
                          Đồng ý
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            } else if (status == "accepted") {
              return (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="bg-blue-300 hover:bg-blue-400 hover:cursor-grab px-4 py-2 rounded-md">
                      Chuẩn bị xong
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Bạn đã chuẩn bị xong đơn hàng
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Ban da chuan bi xong don hang nay ? neu roi thi don vi
                        van chuyen se den lay hang
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const dataFetch = await axios
                            .post(`orders/prepared/order/${id}`)
                            .then((res) => res)
                            .catch((e) => console.log(e));
                          if (dataFetch) {
                            toast({
                              title: "Da chuan bi xong don hang",
                            });
                            refresh();
                          } else {
                            toast({
                              title: "Da co loi xay ra",
                            });
                          }
                        }}
                      >
                        Đồng ý
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            } else if (status == "prepared") {
              return (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="bg-blue-300 hover:bg-blue-400 hover:cursor-grab px-4 py-2 rounded-md">
                      Đang vận chuyển
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogDescription>
                        Đơn hàng đã được bàn giao cho đơn vị vận chuyển
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const dataFetch = await axios
                            .post(`orders/inTransist/order/${id}`)
                            .then((res) => res)
                            .catch((e) => console.log(e));
                          if (dataFetch) {
                            toast({
                              title:
                                "Da ban giao cho don vi van chuyen thanh cong",
                            });
                            refresh();
                          } else {
                            toast({
                              title:
                                "Da ban giao cho don vi van chuyen thanh cong",
                            });
                          }
                        }}
                      >
                        Đồng ý
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            } else if (status == "inTransist") {
              return (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="bg-blue-300 hover:bg-blue-400 hover:cursor-grab px-4 py-2 rounded-md">
                      Đến người dùng
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogDescription>
                        Don hang dang tren duong den voi nguoi dung
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const dataFetch = await axios
                            .post(`orders/inTransist2/order/${id}`)
                            .then((res) => res)
                            .catch((e) => console.log(e));
                          if (dataFetch) {
                            toast({
                              title: "Dang tren duong den voi nguoi dung",
                            });
                            refresh();
                          } else {
                            toast({
                              title: "Cap nhap that bai",
                            });
                          }
                        }}
                      >
                        Đồng ý
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            } else if (status == "inTransist2") {
              return (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="bg-blue-300 hover:bg-blue-400 hover:cursor-grab px-4 py-2 rounded-md">
                      Đã vận chuyển
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogDescription>
                        Don hang da den tay nguoi dung
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const dataFetch = await axios
                            .post(`orders/delivered/order/${id}`)
                            .then((res) => res)
                            .catch((e) => console.log(e));
                          if (dataFetch) {
                            toast({
                              title: "Don hang da den tay nguoi dung",
                            });
                            refresh();
                          } else {
                            toast({
                              title: "Cap nhap that bai",
                            });
                          }
                        }}
                      >
                        Đồng ý
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            }
          }}
        />
        <EditButton label="Details" />
      </Datagrid>
    </List>
  );
};

export const ShowOrder = (props: any) => {
  const { data } = useGetIdentity();
  const user = data?.user;

  if (checkPermission("Orders-Managment", user?.permissions) == false) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center text-xl font-medium">
        Bạn không có quyền truy cập
      </div>
    );
  }

  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Orders Detail">
          <div>
            <div>Image Order</div>
            <FunctionField
              className="mt-4"
              source="products"
              label="Products"
              render={(record: any) => {
                const image = record?.image;
                if (image.length > 0) {
                  return <img src={image[0].url} className="w-28 h-28" />;
                } else {
                  return <img src={image.url} className="w-28 h-28" />;
                }
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-16">
            <div>
              <div>ID</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <TextField source="id" label="Full Name" />
              </div>
            </div>
            <div>
              <div>fromName </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <TextField source="fromName" label="Full Name" />
              </div>
            </div>
            <div>
              <div>from Address</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <TextField source="fromAddress" label="Full Name" />
              </div>
            </div>
            <div>
              <div>from Province</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <FunctionField
                  source="fromProvince"
                  render={(record: any) => {
                    return <div>{`${record.fromProvince.split(`-`)[0]}`} </div>;
                  }}
                />
              </div>
            </div>
            <div>
              <div>from District</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <FunctionField
                  source="fromDistrict"
                  render={(record: any) => {
                    return <div>{`${record.fromDistrict.split(`-`)[0]}`} </div>;
                  }}
                />
              </div>
            </div>
            <div>
              <div>from Ward</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <FunctionField
                  source="fromWard"
                  render={(record: any) => {
                    return <div>{`${record.fromWard.split(`-`)[0]}`} </div>;
                  }}
                />
              </div>
            </div>
            <div>
              <div>to Name </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <TextField source="toName" label="Full Name" />
              </div>
            </div>
            <div>
              <div>to Address</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <TextField source="toAddress" label="Full Name" />
              </div>
            </div>
            <div>
              <div>to Province</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <FunctionField
                  source="toProvince"
                  render={(record: any) => {
                    return <div>{`${record.toProvince.split(`-`)[0]}`} </div>;
                  }}
                />
              </div>
            </div>
            <div>
              <div>to District</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <FunctionField
                  source="toDistrict"
                  render={(record: any) => {
                    return <div>{`${record.toDistrict.split(`-`)[0]}`} </div>;
                  }}
                />
              </div>
            </div>
            <div>
              <div>to Ward</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <FunctionField
                  source="toWard"
                  render={(record: any) => {
                    return <div>{`${record.toWard.split(`-`)[0]}`} </div>;
                  }}
                />
              </div>
            </div>
            <div>
              <div>codAmount</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <NumberField source="codAmount" label="Full Name" />
              </div>
            </div>
            <div>
              <div>paymentMethod</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <TextField source="paymentMethod" label="Full Name" />
              </div>
            </div>
            <div>
              <div>insurance Value</div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <NumberField source="insuranceValue" label="Full Name" />
              </div>
            </div>
            <div>
              <div>total </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <NumberField source="priceOfAll" label="Full Name" />
              </div>
            </div>
            <div>
              <div>content </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <NumberField source="content" label="Full Name" />
              </div>
            </div>
            <div>
              <div>note </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <NumberField source="note" label="Full Name" />
              </div>
            </div>

            <div>
              <div>requiredNote </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <NumberField source="requiredNote" label="Full Name" />
              </div>
            </div>
            <div>
              <div>weight </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <FunctionField
                  source="weight"
                  render={(record: any) => {
                    return <div>{`${record.weight} (kg)`} </div>;
                  }}
                />
              </div>
            </div>
            <div>
              <div>dimension </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <FunctionField
                  source="weight"
                  render={(record: any) => {
                    const dimension = record.dimension.split(`|`);
                    return (
                      <div>
                        {`${dimension[0]}cm x ${dimension[1]}cm x ${dimension[2]}cm`}{" "}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
            <div>
              <div>Status </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <TextField source="status" label="Full Name" />
              </div>
            </div>
            <div>
              <div>createdAt </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <DateField source="createdAt" label="Full Name" showTime />
              </div>
            </div>
            <div>
              <div>updatedAt </div>
              <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                <DateField source="updatedAt" label="Full Name" showTime />
              </div>
            </div>
          </div>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab className="mb-8" label="Product In Order">
          <ReferenceManyField reference="products-in-orders" target="idOfOrder">
            <Datagrid bulkActionButtons={false}>
              <ReferenceField
                source="idOfProduct"
                reference="productsForShop"
                label="ProductInfo"
              >
                <FunctionField
                  source="avatar"
                  label=""
                  render={(record: any) => {
                    const images = record?.image || [];
                    return (
                      <div className="flex flex-col gap-y-4">
                        <div> Images </div>
                        <div className="grid grid-cols-4 gap-4">
                          {images.map((image: any, index: number) => {
                            return (
                              <div
                                key={index}
                                className={`flex flex-col ${
                                  index == 0 ? "" : "border-l-[1px]"
                                }  border-gray-300 justify-center`}
                              >
                                <img src={image.url} className="w-full"></img>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }}
                />
                <div className="grid grid-cols-4 gap-x-4 gap-y-4 mb-12">
                  <div className="">
                    <div className="my-2">idOfShop</div>
                    <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                      <TextField source="idOfShop" label="Shop name" />
                    </div>
                  </div>

                  <div className="">
                    <div className="my-2">productDescription</div>
                    <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                      <TextField
                        source="productDescription"
                        label="Shop name"
                      />
                    </div>
                  </div>

                  <div className="">
                    <div className="my-2">price</div>
                    <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                      <RichTextField source="price" label="Shop name" />
                    </div>
                  </div>

                  <div className="">
                    <div className="my-2">cateName</div>
                    <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                      <RichTextField source="cateName" label="Shop name" />
                    </div>
                  </div>
                  <div className="">
                    <div className="my-2">weight</div>
                    <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                      <FunctionField
                        source="weight"
                        label="Shop name"
                        render={(record: any) => {
                          return <div>{record.weight} kg</div>;
                        }}
                      />
                    </div>
                  </div>
                  <div className="">
                    <div className="my-2">diemension</div>
                    <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                      <FunctionField
                        source="diemension"
                        label="Shop name"
                        render={(record: any) => {
                          const dimension = record.dimension;
                          const length = dimension.split("|")[0];
                          const width = dimension.split("|")[1];
                          const height = dimension.split("|")[2];
                          return (
                            <div>{`length:${length}cm - width:${width}cm - height:${height}cm`}</div>
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </ReferenceField>
              <NumberField source="quantity" />
            </Datagrid>
          </ReferenceManyField>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab className="mb-8" label="User Info">
          <ReferenceField source="idOfUser" reference="getAllUser">
            <FunctionField
              source="avatar"
              render={(record: any) => {
                const avatarUrl = record?.avatar?.url;
                const coverImageUrl = record?.coverImage?.url;
                return (
                  <div className="grid grid-cols-3">
                    <div className="col-span-1 flex flex-col items-center justify-center">
                      <div className="flex justify-center mb-4 ">Avatar</div>
                      {
                        // eslint-disable-next-line jsx-a11y/alt-text
                        avatarUrl ? (
                          <img src={avatarUrl} className="w-1/2" />
                        ) : (
                          <img
                            src={`https://github.com/shadcn.png`}
                            className="w-full"
                          />
                        )
                      }
                    </div>
                    <div className="col-span-2 flex items-center  justify-center flex-col">
                      <div className="flex justify-center mb-4">
                        Cover Image
                      </div>
                      {
                        // eslint-disable-next-line jsx-a11y/alt-text
                        coverImageUrl ? (
                          <img src={coverImageUrl} className="w-1/2 " />
                        ) : (
                          <img
                            src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQtqB4g6GQ5QPHLlf1dduVTt7xy3gEnM_fB4NA1IZ2YQ&s`}
                            className="w-full"
                          />
                        )
                      }
                    </div>
                  </div>
                );
              }}
            ></FunctionField>
            <div className="grid grid-cols-2 gap-4 mb-16">
              <div>
                <div>Full Name</div>
                <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                  <TextField source="fullName" label="Full Name" />
                </div>
              </div>
              <div>
                <div>Email </div>
                <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                  <TextField source="email" label="Full Name" />
                </div>
              </div>
              <div>
                <div>Phone</div>
                <div className="px-4 py-2 my-2 border-2 border-gray-300 rounded-lg">
                  <TextField source="phoneNumber" label="Full Name" />
                </div>
              </div>{" "}
            </div>
          </ReferenceField>
        </TabbedShowLayout.Tab>

        <TabbedShowLayout.Tab label="transaction">
          <ReferenceManyField
            reference="transaction-shopsForShop"
            target="idOfOrder"
            label="Transaction"
          >
            <Datagrid>
              <TextField source="id" />
              <TextField source="idOfUser" />
              <NumberField source="amountMoney" />
              <TextField source="type" />
              <DateField source="createdAt" showTime />
            </Datagrid>
          </ReferenceManyField>
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};
