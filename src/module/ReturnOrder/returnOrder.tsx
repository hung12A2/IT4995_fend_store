/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
  BooleanField,
  BooleanInput,
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
import Image from "next/image";

const postFilters = [
  <TextInput key={"id"} label="id" source="where.id.like" alwaysOn={true} />,
  <TextInput
    key={"idOfUser"}
    label="idOfUser"
    source="where.idOfUser.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"idOfShop"}
    label="idOfShop"
    source="where.idOfShop.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"idOfOrder"}
    label="idOfOrder"
    source="where.idOfOrder.like"
    alwaysOn={true}
  />,
];

export const ListReturnOrder = (props: any) => {
  const { data } = useGetIdentity();
  const { toast } = useToast();
  const refresh = useRefresh();
  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="idOfUser" />
        <TextField source="idOfShop" />
        <TextField source="idOfOrder" />
        <TextField source="isKiot" />
        <TextField source="reason" />
        <FunctionField
          source="image"
          render={(record: any) => {
            const images = record.images;
            const image = images[0];
            return <img src={image.url} className="w-24 h-24 rounded-lg" />;
          }}
        />
        <EditButton label="Detail" />
      </Datagrid>
    </List>
  );
};

export const ShowReturnOrder = (props: any) => {
  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Return Info">
          <FunctionField
            source="avatar"
            label=""
            render={(record: any) => {
              const images = record?.images || [];
              return (
                <div className="flex flex-col gap-y-4">
                  <div> Images </div>
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className={`flex flex-col border-gray-300 items-center justify-center`}
                        >
                          <Image
                            src={image.url}
                            alt="image"
                            width={220}
                            height={220}
                            className="rounded-lg"
                          ></Image>
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
              <div className="my-2">id</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="id" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">idOfUser</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="idOfUser" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">idOfOrder</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="idOfOrder" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">idOfShop</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="idOfShop" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">reason</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="reason" label="Shop name" />
              </div>
            </div>
            <div className="">
              <div className="my-2">createdAt</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <TextField source="createdAt" label="Shop name" />
              </div>
            </div>

            <div className="">
              <div className="my-2">isKiot</div>
              <div className="w-full  border-2 border-gray-200 px-4 py-2 rounded-lg">
                <BooleanField source="isKiot" label="Shop name" />
              </div>
            </div>
          </div>
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label="Order Info">
          <FunctionField
            source="Order Info"
            render={(record: any) => {
              const isKiot = record.isKiot;
              if (isKiot == true) {
                return (
                  <ReferenceField source="idOfOrder" reference="ordersKiotShop">
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
                  <ReferenceField source="idOfOrder" reference="ordersShop">
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
      </TabbedShowLayout>
    </Show>
  );
};
