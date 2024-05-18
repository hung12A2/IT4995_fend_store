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
import axios from "axios";
import { BASE_URL } from "@/api/constant";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@mui/icons-material";

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

export const ListProducts = (props: any) => {
  const { data } = useGetIdentity();
  const { toast } = useToast();
  const refresh = useRefresh();
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
            if (record.status == "active") {
              return (
                <div className="flex flex-row justify-center items-center">
                  <div className="w-2 h-2 mr-2 rounded-full bg-green-400"></div>
                  <div>active</div>
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
                  <div>banned</div>
                </div>
              );
            }
          }}
        />
        <EditButton label="Detail" />

        <FunctionField
          render={(record: any) => {
            const { id, status } = record;
            if (status === "active") {
              return (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="bg-red-300 hover:bg-red-400 hover:cursor-grab px-4 py-2 rounded-md">
                      Ban
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogDescription>
                        Are you sure you want ban this user ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const dataFetch = await axios
                            .post(
                              `${BASE_URL}products/banned/${id}`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${data?.token}`,
                                },
                              }
                            )
                            .then((res) => res.data)
                            .catch((e) => console.log(e));

                            console.log(dataFetch)
                          if (dataFetch.code == 200)
                            toast({
                              title: "Ban success",
                            });

                          refresh();
                        }}
                      >
                        YES
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            } else {
              return (
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="bg-blue-300 hover:bg-blue-400 hover:cursor-grab px-4 py-2 rounded-md">
                      UnBan
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogDescription>
                        Are you sure you want unban this user ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const dataFetch = await axios
                            .post(
                              `${BASE_URL}products/unbanned/${id}`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${data?.token}`,
                                },
                              }
                            )
                            .then((res) => res.data)
                            .catch((e) => console.log(e));

                            console.log (dataFetch)

                          if (dataFetch.code == 200)
                            toast({
                              title: "UnBun success",
                            });

                          refresh();
                        }}
                      >
                        YES
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              );
            }
          }}
        />
      </Datagrid>
    </List>
  );
};

export const ShowProducts = (props: any) => {
  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Products Detail">
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
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12">
            <div className="">
              <div className="my-2">idOfCategory</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="idOfCategory" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">idOfShop</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="idOfShop" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">OnlineProduct</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <BooleanField source="isOnlineProduct" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">KiotProduct</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <BooleanField source="isKiotProduct" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">productDescription</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="productDescription" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">productDetails</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <RichTextField source="productDetails" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">price</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <RichTextField source="price" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">countInStock</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <RichTextField source="countInStock" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">status</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <RichTextField source="status" label="Shop name" />
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
            <div className="">
              <div className="my-2">createdBy</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <RichTextField source="createdBy" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">updatedBy</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <RichTextField source="updatedBy" label="Shop name" />
              </div>
            </div>
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
