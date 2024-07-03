/* eslint-disable @next/next/no-img-element */
import { useToast } from "@/components/ui/use-toast";
import { dataProvider } from "@/provider/dataProvider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrayInput,
  Button,
  Create,
  Datagrid,
  DateField,
  Edit,
  EditButton,
  FilterForm,
  FunctionField,
  ImageField,
  List,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceManyField,
  RichTextField,
  SelectInput,
  Show,
  SimpleForm,
  SimpleFormIterator,
  TabbedShowLayout,
  TextField,
  TextInput,
  useAuthProvider,
  useGetIdentity,
} from "react-admin";
import axios from "../../module/AxiosCustom/custome_Axios";
import { checkPermission } from "@/lib/helper";

const postFilters = [
  <TextInput key={"id"} label="id" source="where.id.like" alwaysOn={true} />,
  <TextInput
    key={"name"}
    label="name"
    source="where.name.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"note"}
    label="note"
    source="where.note.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"type"}
    label="type"
    source="where.type.like"
    alwaysOn={true}
  />,
];

export const ListAddForm = (props: any) => {

  const { data } = useGetIdentity();

  const user = data?.user;

  if (checkPermission("Products-Managment", user?.permissions) == false) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center text-xl font-medium">
       Bạn không có quyền truy cập
      </div>
    );
  }

  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid
        bulkActionButtons={false}
   
      >
        <TextField source="id" />
        <TextField source="note" />
        <TextField source="type" />
        <DateField source="createdAt" showTime />
        <EditButton label="Detail" />
      </Datagrid>
    </List>
  );
};

export const AddImportForm = (props: any) => {
  const [products, setProducts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      const data: any = await axios
        .get(`productsForShop`)
        .then((res) => res)
        .catch((e) => console.log(e));

      setProducts(data);
    }

    fetchData();
  }, []);

  const { data } = useGetIdentity();

  const user = data?.user;

  if (checkPermission("Products-Managment", user?.permissions) == false) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center text-xl font-medium">
        Bạn không có quyền truy cập
      </div>
    );
  }

  return (
    <Create>
      <SimpleForm
        onSubmit={async (data) => {
          const fetchData: any = axios
            .post(`add-forms`, data)
            .then((res) => res)
            .catch((e) => console.log(e));

          if (fetchData) {
            toast({
              title: "Nhap hang thanh cong",
            });
          } else {
            toast({
              title: "Nhap hang that bai",
            });
          }
        }}
      >
        <SelectInput
          source="type"
          choices={[
            { id: "import", name: "Nhap" },
            { id: "export", name: "Xuat" },
          ]}
        />
        <TextInput source="note" />
        <ArrayInput source="items">
          <SimpleFormIterator inline>
            <SelectInput
              source="idOfProduct"
              choices={products}
              optionText="name"
              optionValue="id"
            ></SelectInput>
            <NumberInput source="quantity" helperText={false} />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};

export const ShowAddForm = (props: any) => {

  const { data } = useGetIdentity();

  const user = data?.user;

  if (checkPermission("Products-Managment", user?.permissions) == false) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center text-xl font-medium">
        Bạn không có quyền truy cập
      </div>
    );
  }
  return (
    <Show>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab className="mb-8" label="Product In Form">
          <ReferenceManyField
            reference="product-in-add-forms"
            target="idOfForm"
          >
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
                          return <div>{record.weight} gram</div>;
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
      </TabbedShowLayout>
    </Show>
  );
};
