import { Button } from "@/components/ui/button";
import {
  Create,
  Datagrid,
  DateField,
  Edit,
  EditButton,
  EmailField,
  FilterForm,
  Form,
  FunctionField,
  List,
  ListButton,
  ReferenceField,
  SelectArrayInput,
  Show,
  SimpleForm,
  TabbedShowLayout,
  TextField,
  TextInput,
  useAuthProvider,
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
import axios from "axios";
import { BASE_URL } from "@/api/constant";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { set } from "react-hook-form";

const postFilters = [
  <TextInput key={"id"} label="id" source="where.id.like" alwaysOn={true} />,
  <TextInput
    key={"permissions"}
    label="Permissions"
    source="where.permissions.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"email"}
    label="email"
    source="where.email.like"
    alwaysOn={true}
  />,
];

export const ListAdmin = (props: any) => {
  const { data } = useGetIdentity();
  const { toast } = useToast();
  const refresh = useRefresh();
  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <EmailField source="email" />
        <TextField source="name" />
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
                <img src={url} className="w-24 h-24 rounded-lg"></img>
              );
            else
              return (
                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                <img
                  className="w-24 h-24 rounded-lg"
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
        <TextField source="createdBy" />
        <FunctionField
          render={(record: any) => {
            const { id, status } = record;
            if (status === "active" && data?.user?.id === id) {
              return;
            }
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
                              `${BASE_URL}admins/banned/${id}`,
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
                              `${BASE_URL}admins/unbanned/${id}`,
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
        <EditButton label="Details"></EditButton>
      </Datagrid>
    </List>
  );
};

export const CreateAdmin = (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { toast } = useToast();
  const dataProvider = useDataProvider();

  return (
    <Create>
      <SimpleForm
        onSubmit={async (data: any) => {
          data.permissions = data.permissions.join("|");
          const dataFetch: any = await dataProvider
            .create("admins", { data })
            .then((res) => res.data)
            .catch((e) => console.log(e));

          if (dataFetch.email) {
            toast({
              title: "Create success",
            });
          } else {
            toast({
              title: "Create fail",
            });
          }
        }}
      >
        <TextInput source="email" />
        <TextInput source="name" />
        <TextInput source="phoneNumber" />
        <SelectArrayInput
          source="permissions"
          choices={[
            { id: "Products-Managment", name: "Products-Managment" },
            {
              id: "RequestCreateShops-Managment",
              name: "RequestCreateShops-Managment",
            },
            { id: "Users-Managment", name: "Users-Managment" },
            { id: "Kiots-Managment", name: "Kiots-Managment" },
            { id: "Shops-Managment", name: "Shops-Managment" },
            { id: "Orders-Managment", name: "Orders-Managment" },
            { id: "Transactions-Managment", name: "Transactions-Managment" },

          ]}
        />
      </SimpleForm>
    </Create>
  );
};
export const EditAdmin = (props: any) => {
  const dataProvider = useDataProvider();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const [dataAdmin, setData] = useState<any>({});
  const { data } = useGetIdentity();
  const user: any = data?.user;
  const [checkedPassword, setCheckedPassword] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function dataFetch() {
      let dataReturn = await dataProvider
        .getOne("admins", { id })
        .then((res) => res.data)
        .catch((e) => console.log(e));
      dataReturn.permissions = dataReturn?.permissions.split("|") || [];

      setData(dataReturn);
    }

    dataFetch();
  }, [id, dataProvider]);

  return (
    <>
      <Show className="w-full">
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
                    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
                    <img src={url} className="w-full"></img>
                  ) : (
                    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
                    <img
                      src="https://github.com/shadcn.png"
                      className="w-full"
                    ></img>
                  )}
                </div>
                <div className="flex flex-col w-2/3 justify-center">
                  <div className="flex justify-center mb-4">Cover Image</div>
                  {coverUrl ? (
                    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
                    <img src={coverUrl} className="w-full"></img>
                  ) : (
                    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12">
          <div className="">
            <div className="my-2">Created By</div>
            <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
              <TextField source="createdBy" label="Shop name" />
            </div>
          </div>
          <div className="">
            <div className="my-2">Status</div>
            <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg flex flex-row items-center gap-x-2">
              <div className="bg-green-300 w-2 h-2 rounded-full"></div>
              <TextField source="status" label="Shop name" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12">
          <div className="">
            <div className="my-2">Updated By</div>
            <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
              <TextField source="updatedBy" label="Shop name" />
            </div>
          </div>
          <div className="">
            <div className="my-2">Updated At</div>
            <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
              <DateField source="updatedAt" showTime label="Shop name" />
            </div>
          </div>
          <div className="">
            <div className="my-2">Created At</div>
            <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
              <DateField source="createdAt" showTime label="Shop name" />
            </div>
          </div>
          <div className="">
            <div className="my-2">Password</div>
            <div className="w-full  border-2 border-gray-200 flex justify-between px-4 py-2 rounded-lg">
              <FunctionField
                render={() => {
                  if (checkedPassword) return dataAdmin.password;
                  return "********";
                }}
              />
              <AlertDialog
                open={open && !checkedPassword}
                onOpenChange={setOpen}
              >
                <div
                  onClick={() => {
                    if (checkedPassword) {
                      setCheckedPassword(false);
                    } else {
                      setOpen(true);
                    }
                  }}
                >
                  <VisibilityOutlinedIcon className="hover:bg-sky-200 hover:cursor-grab rounded-xl" />
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogDescription>
                      Please input your password to show
                      <Form
                        onSubmit={(data) => {
                          const yourPassword = data.yourPassword;
                          if (yourPassword === user?.password) {
                            setCheckedPassword(true);
                            setOpen(false);
                            toast({
                              title: "Your password is correct",
                            });
                          } else {
                            toast({
                              title: "Your password is incorrect",
                            });
                          }
                        }}
                      >
                        <TextInput
                          className="w-full mt-4"
                          source="yourPassword"
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>
                            <Button>Yes</Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </Form>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </Show>

      <SimpleForm
        defaultValues={dataAdmin}
        onSubmit={async (data: any) => {
          data.permissions = data.permissions.join("|");
          data = {
            data,
            id,
          };

          const dataFetch: any = await dataProvider
            .update("admins", { ...data })
            .then((res) => res.data)
            .catch((e) => console.log(e));

          if (dataFetch) {
            toast({
              title: "Update success",
            });
          } else {
            toast({
              title: "Update fail",
            });
          }
        }}
      >
        <div className="w-full mt-8 flex flex-col md:grid md:grid-cols-2 md:gap-4">
          <TextInput source="email" className="" />
          <TextInput source="name" />
          <TextInput source="phoneNumber" />
          <SelectArrayInput
            source="permissions"
            choices={[
              { id: "Products-Managment", name: "Products-Managment" },
              {
                id: "RequestCreateShops-Managment",
                name: "RequestCreateShops-Managment",
              },
              { id: "Users-Managment", name: "Users-Managment" },
              { id: "Kiots-Managment", name: "Kiots-Managment" },
              { id: "Shops-Managment", name: "Shops-Managment" },
            ]}
          />
        </div>
      </SimpleForm>
    </>
  );
};
