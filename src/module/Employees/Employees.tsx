/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  Datagrid,
  DateField,
  EditButton,
  EmailField,
  FilterForm,
  FunctionField,
  List,
  ReferenceField,
  Show,
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
import noAvt from "../../../public/pngegg.png";

const postFilters = [
  <TextInput key={"id"} label="id" source="where.id.like" alwaysOn={true} />,
  <TextInput
    key={"fullName"}
    label="Full Name"
    source="where.fullName.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"email"}
    label="email"
    source="where.email.like"
    alwaysOn={true}
  />,

  <TextInput
    key={"phoneNumber"}
    label="phoneNumber"
    source="where.phoneNumber.like"
    alwaysOn={true}
  />,
];

export const ListEmployee = (props: any) => {
  const { data } = useGetIdentity();
  const { toast } = useToast();
  const refresh = useRefresh();
  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="idOfShop" />
        <TextField source="name" />
        <TextField source="permissions" />
        <EmailField source="email" />
        <TextField source="phoneNumber" />
        <FunctionField
          className="w-1/6"
          label="Avatar"
          render={(record: any) => {
            const url = record?.avatar?.url;
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            if (url)
              return (
                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text, react/jsx-no-undef
                <img src={url} className="w-24 h-24"></img>
              );
            else
              return (
                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                <img
                  className="w-24 h-24"
                  src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTy-6oqxazyyxQwrNeitM4NDATAlVycYmNjqc4H37cmA&s`}
                ></img>
              );
          }}
        />

        <FunctionField
          source="status"
          render={(record: any) => {
            const { status } = record;
            if (status === "active")
              return (
                <div className="flex flex-row items-center">
                  <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                  <div>Active</div>
                </div>
              );
            else {
              return (
                <div className="flex flex-row items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  <div>Banned</div>
                </div>
              );
            }
          }}
        />
        <DateField source="createdAt" showTime />
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
                              `${BASE_URL}employees/banned/${id}`,
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
                              `${BASE_URL}employees/unbanned/${id}`,
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

export const ShowEmployee = (props: any) => {
  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Employee Info">
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
                    <div className="flex justify-center mb-4">Cover Image</div>
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
              <div className="my-2">Employee Name</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="name" label="Employee name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">Employee Email</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="email" label="Employee name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">Employee Phone</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="phoneNumber" label="Employee name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">permissions</div>
              <div className="w-full flex flex-row justify-between border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="permissions" label="Employee name" />

                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="px-2 py-1 rounded-xl bg-sky-200 hover:bg-sky-300 hover:cursor-grab">
                      Detail
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Employee Permission
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                       <div> 
                        <li>Request create product</li>
                        <li>Update count in stock of product</li>
                        <li>Update Infomation(image, description, product range, status) of product</li>
                       </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogAction>OK</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12">
            <div className="">
              <div className="my-2">role</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="role" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">status</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg flex flex-row items-center gap-x-2">
                <div className="bg-green-300 w-2 h-2 rounded-full"></div>
                <TextField source="status" label="Shop name" />
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
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-6">
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
      </TabbedShowLayout>
    </Show>
  );
};
