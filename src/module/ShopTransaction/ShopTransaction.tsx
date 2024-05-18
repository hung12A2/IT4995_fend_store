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

export const ListShopTrangsaction = (props: any) => {
  const { data } = useGetIdentity();
  const { toast } = useToast();
  const refresh = useRefresh();
  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="type" />
        <TextField source="idOfShop" />
        <TextField source="idOfOrder" />
        <TextField source="amountMoney" />
        <DateField source="createdAt" showTime />
        <EditButton label="Detail" />
      </Datagrid>
    </List>
  );
};

export const ShowShopTransaction = (props: any) => {
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
              } else
                return (
                  <ReferenceField source="idOfOrder" reference="ordersAdmin">
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
            }}
          ></FunctionField>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label="Shop Info">
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
      </TabbedShowLayout>
    </Show>
  );
};
