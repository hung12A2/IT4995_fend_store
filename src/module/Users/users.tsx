import { Button } from "@/components/ui/button";
import {
  Datagrid,
  DateField,
  EmailField,
  FilterForm,
  FunctionField,
  List,
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

export const ListUser = (props: any) => {
  const { data } = useGetIdentity();
  const { toast } = useToast();
  const refresh = useRefresh();
  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="idOfShop" />
        <TextField source="fullName" />
        <EmailField source="email" />
        <TextField source="phoneNumber" />
        <FunctionField
          className="w-1/6"
          label="Avatar"
          render={(record: any) => {
            const url = record?.avatar?.url
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
                  src={`../../../public/pngegg.png`}
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
                              `${BASE_URL}banned/customer/${id}`,
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
                              `${BASE_URL}unbanned/customer/${id}`,
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
