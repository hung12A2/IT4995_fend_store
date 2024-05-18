/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  Datagrid,
  DateField,
  Edit,
  EditButton,
  EmailField,
  FilterForm,
  FunctionField,
  List,
  ReferenceField,
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
    label="Shop Name "
    source="where.name.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"email"}
    label="email"
    source="where.email.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"email"}
    label="Phone"
    source="where.phoneNumber.like"
    alwaysOn={true}
  />,
];

export const ListRequestShops = (props: any) => {
  const { data } = useGetIdentity();
  const { toast } = useToast();
  const refresh = useRefresh();
  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="name" />
        <ReferenceField
          label="Owner User"
          source="idOfUser"
          reference="getAllUser"
        >
          <TextField source="fullName" />
        </ReferenceField>
        <EmailField source="email" />
        <TextField source="phoneNumber" />
        <FunctionField
          source="status"
          render={(record: any) => {
            console.log(record);
            const { status } = record;
            if (status === "accepted")
              return (
                <div className="flex flex-row items-center">
                  <div className="w-2 h-2 bg-green-300 rounded-full mr-2"></div>
                  <div>accepted</div>
                </div>
              );
            else if (status === "pending") {
              return (
                <div className="flex flex-row items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  <div>pending</div>
                </div>
              );
            } else {
              return (
                <div className="flex flex-row items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  <div>rejected</div>
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
            if (status === "pending") {
              return (
                <div className=" flex flex-col gap-y-4">
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className="bg-green-300 hover:bg-green-400 hover:cursor-grab px-4 py-2 rounded-md">
                        Accepted
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogDescription>
                          Are you sure you want accepted this request ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            const dataFetch = await axios
                              .post(
                                `${BASE_URL}request-create-shops/accepted/${id}`,
                                {},
                                {
                                  headers: {
                                    Authorization: `Bearer ${data?.token}`,
                                  },
                                }
                              )
                              .then((res) => res.data)
                              .catch((e) => console.log(e));
                            console.log(dataFetch);

                            if (dataFetch)
                              toast({
                                title: "Accepted success",
                              });

                            refresh();
                          }}
                        >
                          YES
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className="bg-red-300 hover:bg-red-400 hover:cursor-grab px-4 py-2 rounded-md">
                        Rejected
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogDescription>
                          Are you sure you want reject this request ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            const dataFetch = await axios
                              .post(
                                `${BASE_URL}request-create-shops/reject/${id}`,
                                {},
                                {
                                  headers: {
                                    Authorization: `Bearer ${data?.token}`,
                                  },
                                }
                              )
                              .then((res) => res.data)
                              .catch((e) => console.log(e));
                            console.log(dataFetch);

                            if (dataFetch)
                              toast({
                                title: "Reject success",
                              });

                            refresh();
                          }}
                        >
                          YES
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            } else {
              return <></>;
            }
          }}
        />
      </Datagrid>
    </List>
  );
};

export const ShowRequestShopsDetails = (props: any) => {
  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="License">
          <FunctionField
            source="IDCardImg"
            label="ID Card Img"
            render={(record: any) => {
              const { IDcardImg } = record;
              const { url } = IDcardImg[0];
              return (
                <div className="flex flex-row gap-x-4 items-center">
                  {IDcardImg.map((item: any, index: number) => {
                    const { url } = item;
                    return (
                      <img
                        className="w-1/4"
                        src={url}
                        alt="img"
                        key={index}
                      ></img>
                    );
                  })}
                </div>
              );
            }}
          />
          <FunctionField
            source="BLicenseImg"
            label="Business License Img"
            render={(record: any) => {
              const { BLicenseImg } = record;
              const { url } = BLicenseImg[0];
              return (
                <div className="flex flex-row gap-x-4 items-center">
                  {BLicenseImg.map((item: any, index: number) => {
                    const { url } = item;
                    return (
                      <img
                        className="w-1/4"
                        src={url}
                        alt="img"
                        key={index}
                      ></img>
                    );
                  })}
                </div>
              );
            }}
          />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab className="mb-8" label="Shop Info">
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
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label="User Info">
          <ReferenceField source="idOfUser" reference="getAllUser">
            <FunctionField
              source="avatar"
              render={(record: any) => {
                const avatarUrl = record?.avatar?.url;
                const coverImageUrl = record?.coverImage?.url;
                return (
                  <div className="grid grid-cols-3">
                    <div className="col-span-1 flex flex-col justify-center">
                      <div className="flex justify-center mb-4">Avatar</div>
                      {
                        // eslint-disable-next-line jsx-a11y/alt-text
                        avatarUrl ? (
                          <img src={avatarUrl} className="w-full" />
                        ) : (
                          <img
                            src={`https://github.com/shadcn.png`}
                            className="w-full"
                          />
                        )
                      }
                    </div>
                    <div className="col-span-2 flex justify-center flex-col">
                      <div className="flex justify-center mb-4">
                        Cover Image
                      </div>
                      {
                        // eslint-disable-next-line jsx-a11y/alt-text
                        coverImageUrl ? (
                          <img src={coverImageUrl} className="w-full " />
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
      </TabbedShowLayout>
    </Show>
  );
};
