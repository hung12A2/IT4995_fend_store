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
  ReferenceManyField,
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

export const ListUserTrangsaction = (props: any) => {
  const { data } = useGetIdentity();
  const { toast } = useToast();
  const refresh = useRefresh();
  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="type" />
        <TextField source="idOfUser" />
        <TextField source="idOfOrder" />
        <TextField source="amountMoney" />
        <DateField source="createdAt" showTime />
        <EditButton label="Detail" />
      </Datagrid>
    </List>
  );
};

export const ShowTransaction = (props: any) => {
  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Order Info">
          <FunctionField
            source="src"
            render={(record: any) => {
              const typeOrder = record.typeOrder;
              if (typeOrder == "kiot") {
                return (
                  <ReferenceField
                    source="idOfOrder"
                    reference="ordersKiotAdmin"
                  >
                    <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                      <div className="">
                        <div className="my-2">Id</div>
                        <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                          <TextField source="id" label="Shop name" />
                        </div>
                      </div>
                      <div className="">
                        <div className="my-2">idOfShop</div>
                        <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                          <TextField source="idOfShop" label="Shop name" />
                        </div>
                      </div>
                      <div className="">
                        <div className="my-2">idOfUser</div>
                        <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                          <TextField source="idOfUser" label="Shop name" />
                        </div>
                      </div>
                      <div className="">
                        <div className="my-2">priceOfAll</div>
                        <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                          <TextField source="priceOfAll" label="Shop name" />
                        </div>
                      </div>
                      <div className="">
                        <div className="my-2">codAmount</div>
                        <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                          <TextField source="codAmount" label="Shop name" />
                        </div>
                      </div>
                      <div className="">
                        <div className="my-2">idOfUser</div>
                        <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                          <TextField source="idOfUser" label="Shop name" />
                        </div>
                      </div>
                    </div>
                  </ReferenceField>
                );
              } else return <ReferenceField
              source="idOfOrder"
              reference="ordersAdmin"
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="">
                  <div className="my-2">Id</div>
                  <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                    <TextField source="id" label="Shop name" />
                  </div>
                </div>
                <div className="">
                  <div className="my-2">idOfShop</div>
                  <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                    <TextField source="idOfShop" label="Shop name" />
                  </div>
                </div>
                <div className="">
                  <div className="my-2">idOfUser</div>
                  <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                    <TextField source="idOfUser" label="Shop name" />
                  </div>
                </div>
                <div className="">
                  <div className="my-2">priceOfAll</div>
                  <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                    <TextField source="priceOfAll" label="Shop name" />
                  </div>
                </div>
                <div className="">
                  <div className="my-2">codAmount</div>
                  <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                    <TextField source="codAmount" label="Shop name" />
                  </div>
                </div>
                <div className="">
                  <div className="my-2">idOfUser</div>
                  <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                    <TextField source="idOfUser" label="Shop name" />
                  </div>
                </div>
              </div>
            </ReferenceField>
            }}
          ></FunctionField>
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
      </TabbedShowLayout>
    </Show>
  );
};
