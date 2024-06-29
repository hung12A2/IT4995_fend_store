/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  Edit,
  EditButton,
  EmailField,
  FilterForm,
  FunctionField,
  ImageField,
  ImageInput,
  List,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  RichTextField,
  SelectInput,
  Show,
  SimpleForm,
  TabbedShowLayout,
  TextField,
  TextInput,
  useDataProvider,
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
import axios from "../AxiosCustom/custome_Axios";
import { BASE_URL } from "@/api/constant";
import { toast, useToast } from "@/components/ui/use-toast";
import { Label } from "@mui/icons-material";
import { RichTextInput } from "ra-input-rich-text";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form } from "react-hook-form";
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

export const ListRequestProducts = (props: any) => {
  const { toast } = useToast();
  const refresh = useRefresh();
  const { data } = useGetIdentity();
  const user = data?.user;

  if (checkPermission("Products-Managment", user?.permissions) == false) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center text-xl font-medium">
        Ban khong co quyen truy cap
      </div>
    );
  }

  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="idOfCategory" />
        <TextField source="idOfShop" />
        <NumberField source="price" />
        <FunctionField
          source="status"
          render={(record: any) => {
            if (record.status == "accepted") {
              return (
                <div className="flex flex-row justify-center items-center">
                  <div className="w-2 h-2 mr-2 rounded-full bg-green-400"></div>
                  <div>Accepted</div>
                </div>
              );
            } else if (record.status == "pending") {
              return (
                <div className="flex flex-row justify-center items-center">
                  <div className="w-2 h-2 mr-2 rounded-full bg-yellow-400"></div>
                  <div>Pending</div>
                </div>
              );
            } else {
              return (
                <div className="flex flex-row justify-center items-center">
                  <div className="w-2 h-2 mr-2 rounded-full bg-red-400"></div>
                  <div>Rejected</div>
                </div>
              );
            }
          }}
        />
        <EditButton label="Detail" />
      </Datagrid>
    </List>
  );
};

export const CreateRequestProducts = (props: any) => {
  const [listCate, setListCate] = useState<any>([]);
  const dataProvider = useDataProvider();

  const { data } = useGetIdentity();
  const user = data?.user;

  useEffect(() => {
    async function fetchData() {
      let dataReturnCate: any = await axios
        .get("categories")
        .then((res) => res)
        .catch((e) => console.log(e));

      dataReturnCate = dataReturnCate?.map((item: any) => {
        return {
          cateName: item.cateName,
          id: item.id,
        };
      });

      setListCate(dataReturnCate);
    }

    fetchData();
  }, [dataProvider]);

  if (checkPermission("Products-Managment", user?.permissions) == false) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center text-xl font-medium">
        Ban khong co quyen truy cap
      </div>
    );
  }

  return (
    <Create>
      <SimpleForm
        onSubmit={(data: any) => {
          console.log(data);
          let formData = new FormData();
          if (!data.image) {
            toast({
              title: "Please upload image",
            });

            return;
          }
          data.image.forEach((item: any) => {
            if (item.rawFile) {
              formData.append("images", item.rawFile);
            } else {
              item = {
                url: item.src,
                filename: item.filename,
              };
              formData.append("oldImages[]", JSON.stringify(item));
            }
          });

          if (data.isKiotProduct == true && !data.idOfKiot) {
            toast({
              title: "you dont have Kiot",
            });

            return;
          }
          formData.append("isOnlineProduct", data.isOnlineProduct);
          formData.append("isKiotProduct", data.isKiotProduct);
          formData.append("idOfKiot", data.idOfKiot);
          formData.append("name", data.name);
          formData.append("price", data.price);
          formData.append("countInStock", data.countInStock);
          formData.append("isBestSeller", data.isBestSeller);
          formData.append("weight", data.weight);
          formData.append(
            "dimension",
            `${data.length}|${data.width}|${data.height}`
          );
          formData.append("productDescription", data.productDescription);
          formData.append("productDetails", data.productDetails);

          axios
            .post(
              `request-create-products/create/category/${data.idOfCategory}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res: any) => {
              if (res?.id) {
                toast({
                  title: "Create Success",
                });
              } else {
                toast({
                  title: "Create Fail",
                });
              }
            })
            .catch((e) => console.log(e));
        }}
      >
        <ImageInput isRequired source="image" label="Image" multiple>
          <ImageField source="src" title="title" />
        </ImageInput>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12 w-full">
          <div className="flex flex-row">
            <BooleanInput source="isOnlineProduct" label="Online Product" />
            <BooleanInput source="isKiotProduct" label="Kiot Product" />
          </div>
          <TextInput isRequired source="name" label="name" />

          <TextInput
            isRequired
            source="productDescription"
            label="productDescription"
          />

          <RichTextInput
            isRequired
            source="productDetails"
            label="productDetails"
          />

          <NumberInput isRequired source="price" label="price" />

          <NumberInput isRequired source="countInStock" label="countInStock" />

          <SelectInput
            source="idOfCategory"
            label="cateName"
            optionText="cateName"
            optionValue="id"
            choices={listCate}
          />

          <NumberInput source="weight" label="Weight (kg)" />

          <NumberInput source="length" label="Length (cm)" />
          <NumberInput source="width" label="Width (cm)" />
          <NumberInput source="height" label="Height (cm)" />
        </div>
      </SimpleForm>
    </Create>
  );
};

export const ShowRequest = (props: any) => {
  const params = useParams();
  const id = params.id;
  const [requesData, setRequestData] = useState<any>({});
  const [listCate, setListCate] = useState<any>([]);
  const dataProvider = useDataProvider();

  const { data } = useGetIdentity();
  const user = data?.user;

  useEffect(() => {
    async function fetchData() {
      let dataReturn = await dataProvider
        .getOne("request-create-products-for-shop", { id })
        .then((res) => res.data)
        .catch((e) => console.log(e));

      let dataReturnCate: any = await axios
        .get("categories")
        .then((res) => res)
        .catch((e) => console.log(e));

      dataReturnCate = dataReturnCate?.map((item: any) => {
        return {
          cateName: item.cateName,
          id: item.id,
        };
      });

      setListCate(dataReturnCate);

      let img = dataReturn?.image || [];
      img = img.map((item: any) => {
        return {
          src: item.url,
          filename: item.filename,
        };
      });

      let dimensions = dataReturn?.dimension;
      let length = dimensions.split("|")[0];
      let width = dimensions.split("|")[1];
      let height = dimensions.split("|")[2];

      dataReturn.image = img;
      dataReturn.length = length;
      dataReturn.width = width;
      dataReturn.height = height;
      setRequestData(dataReturn);

      console.log(dataReturn);
    }

    fetchData();
  }, [id, dataProvider]);

  if (checkPermission("Products-Managment", user?.permissions) == false) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center text-xl font-medium">
        Ban khong co quyen truy cap
      </div>
    );
  }

  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Products Detail">
          <Edit>
            <SimpleForm
              defaultValues={requesData}
              onSubmit={(data: any) => {
                if (requesData.status == "pending") {
                  let formData = new FormData();
                  console.log(data.image);
                  data.image.forEach((item: any) => {
                    if (item.rawFile) {
                      formData.append("images", item.rawFile);
                    } else {
                      item = {
                        url: item.src,
                        filename: item.filename,
                      };
                      formData.append("oldImages[]", JSON.stringify(item));
                    }
                  });

                  if (data.isKiotProduct == true && !data.idOfKiot) {
                    toast({
                      title: "you dont have Kiot",
                    });

                    return;
                  }
                  formData.append("isOnlineProduct", data.isOnlineProduct);
                  formData.append("isKiotProduct", data.isKiotProduct);
                  formData.append("idOfKiot", data.idOfKiot);
                  formData.append("name", data.name);
                  formData.append("price", data.price);
                  formData.append("countInStock", data.countInStock);
                  formData.append("isBestSeller", data.isBestSeller);
                  formData.append("weight", data.weight);
                  formData.append(
                    "dimension",
                    `${data.length}|${data.width}|${data.height}`
                  );
                  formData.append(
                    "productDescription",
                    data.productDescription
                  );
                  formData.append("productDetails", data.productDetails);

                  axios
                    .post(
                      `request-create-products/update/category/${data.idOfCategory}/${data.id}`,
                      formData,
                      {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      }
                    )
                    .then((res: any) => {
                      if (res.code == 200) {
                        toast({
                          title: "Update Success",
                        });
                      } else {
                        toast({
                          title: "Update Fail",
                        });
                      }
                    })
                    .catch((e) => console.log(e));
                } else {
                  toast (
                    {
                      title: "You can't update this request",
                    }
                  )
                }
              }}
            >
              <ImageInput source="image" label="Image" multiple>
                <ImageField source="src" title="title" />
              </ImageInput>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12 w-full">
                <TextInput source="idOfShop" label="Shop Id" />

                <div className="flex flex-row">
                  <BooleanInput
                    source="isOnlineProduct"
                    label="Online Product"
                  />
                  <BooleanInput source="isKiotProduct" label="Kiot Product" />
                </div>
                <TextInput source="name" label="name" />

                <TextInput
                  source="productDescription"
                  label="productDescription"
                />

                <RichTextInput source="productDetails" label="productDetails" />

                <NumberInput source="price" label="Shop name" />

                <NumberInput source="countInStock" label="Shop name" />

                <TextInput source="status" label="Status" disabled={true} />

                <SelectInput
                  source="idOfCategory"
                  label="cateName"
                  optionText="cateName"
                  optionValue="id"
                  choices={listCate}
                />

                <NumberInput source="weight" label="Weight (kg)" />

                <NumberInput source="length" label="Length (cm)" />
                <NumberInput source="width" label="Width (cm)" />
                <NumberInput source="height" label="Height (cm)" />

                <TextInput source="createdBy" label="Created By" disabled />

                <TextInput source="updatedBy" label="Updated By" disabled />

                <div className="">
                  <div className="my-2">createdAt</div>
                  <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                    <DateField source="createdAt" label="Shop name" showTime />
                  </div>
                </div>

                <div className="">
                  <div className="my-2">updatedAt</div>
                  <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                    <DateField source="updatedAt" label="Shop name" showTime />
                  </div>
                </div>
              </div>
            </SimpleForm>
          </Edit>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab className="mb-8" label="Shop Info">
          <ReferenceField source="idOfShop" reference="stores" link={false}>
            <FunctionField
              source="avatar"
              label=""
              render={(record: any) => {
                const url: any = record?.avatar?.url;
                const coverUrl: any = record?.coverImage?.url;
                return (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <div className="flex flex-row gap-x-6">
                    <div className="flex flex-col w-1/3 justify-center">
                      <div className="flex justify-center mb-4 ">Avatar</div>
                      {url ? (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img src={url} className="w-full"></img>
                      ) : (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                          src="https://github.com/shadcn.png"
                          className="w-full"
                        ></img>
                      )}
                    </div>
                    <div className="flex flex-col w-2/3 justify-center">
                      <div className="flex justify-center mb-4">
                        Cover Image
                      </div>
                      {coverUrl ? (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img src={coverUrl} className="w-full"></img>
                      ) : (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQtqB4g6GQ5QPHLlf1dduVTt7xy3gEnM_fB4NA1IZ2YQ&s"
                          className="w-full"
                        ></img>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="">
                <div className="my-2">Shop Name</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="name" label="Shop name" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Shop Email</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="email" label="Shop name" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Shop Phone</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="phoneNumber" label="Shop name" />
                </div>
              </div>
            </div>
            <div className="">
              <div className="my-2">Pick up address</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="pickUpAddress" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">Return address</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="returnAddress" label="Shop name" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12">
              <div className="">
                <div className="my-2">Pick up Province</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="pickUpProvinceName" label="Shop name" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Return Province</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="returnProvinceName" label="Shop name" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Pick up District</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="pickUpDistrictName" label="Shop name" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Return District</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="returnDistrictName" label="Shop name" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Pick up Ward</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="pickUpWardName" label="Shop name" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Return Ward</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="returnWardName" label="Shop name" />
                </div>
              </div>
            </div>
          </ReferenceField>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab className="mb-8" label="CategoryInfo">
          <ReferenceField
            source="idOfCategory"
            reference="categories"
            link={false}
          >
            <FunctionField
              source="image"
              label=""
              render={(record: any) => {
                const url = record?.image?.url;

                return (
                  <div className="flex flex-col gap-y-4">
                    <div> List Category Images</div>
                    <img className="w-24 h-24" src={url}></img>
                  </div>
                );
              }}
            />

            <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12 w-full mt-4">
              <div className="">
                <div className="my-2">id</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="id" />
                </div>
              </div>
              <div className="">
                <div className="my-2">description</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="description" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Created By</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="createdBy" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Updated By</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <TextField source="updatedBy" />
                </div>
              </div>
              <div className="">
                <div className="my-2">Created At</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <DateField source="createdAt" showTime />
                </div>
              </div>
              <div className="">
                <div className="my-2">Updated At</div>
                <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                  <DateField source="updatedAt" showTime />
                </div>
              </div>
            </div>
          </ReferenceField>
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};
