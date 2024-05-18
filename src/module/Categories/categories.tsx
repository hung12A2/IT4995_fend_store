/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import {
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
  ReferenceField,
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
import axios from "axios";
import { BASE_URL } from "@/api/constant";
import { useToast } from "@/components/ui/use-toast";
import noAvt from "../../../public/pngegg.png";
import { FileInput } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

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

export const ListCategories = (props: any) => {
  const { data } = useGetIdentity();
  const { toast } = useToast();
  const refresh = useRefresh();
  return (
    <List>
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid bulkActionButtons={false}>
        <TextField source="id" />
        <TextField source="cateName" />
        <DateField source="createdAt" showTime />
        <TextField source="createdBy" />
        <FunctionField
          label="Image"
          render={(record: any) => {
            const url = record?.image?.url;
            if (url)
              return (
                <div>
                  <img src={url} className="w-24 h-24 rounded-lg "></img>
                </div>
              );
            else
              return (
                <img
                  src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTy-6oqxazyyxQwrNeitM4NDATAlVycYmNjqc4H37cmA&s`}
                  className="w-24 h-24 rounded-lg "
                ></img>
              );
          }}
        />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export const CreateCategories = (props: any) => {
  const dataProvider = useDataProvider();
  return (
    <Create>
      <SimpleForm
        onSubmit={async (data: any) => {
          console.log(data);
          let formData = new FormData();
          formData.append("cateName", data.cateName);
          formData.append("description", data.description);
          data.image.forEach((file: any) => {
            formData.append("image", file.rawFile);
          });
          const res = await axios
            .post(`${BASE_URL}categories`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => res.data)
            .catch((e) => console.log(e));

          console.log(res);
        }}
      >
        <TextInput source="cateName" />
        <TextInput source="description" />
        <ImageInput
          source="image"
          label="Image"
          accept="image/*"
          multiple={true}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};

export const EditCategories = (props: any) => {
  const dataProvider = useDataProvider();
  const params = useParams();
  const id = params.id;
  const [categories, setCategories] = useState<any>({});
  const { toast } = useToast();

  return (
    <Edit>
      <SimpleForm
        onSubmit={async (data: any) => {
          let formData = new FormData();
          data.image = data.image ? data.image : [];
          console.log(data);
          formData.append("cateName", data.cateName);
          formData.append("description", data.description);
          data.image.forEach((file: any) => {
            formData.append("image", file.rawFile);
          });

          const res = await axios
            .patch(`${BASE_URL}categories/${id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => res.data)
            .catch((e) => console.log(e));

          if (res.id) {
            toast({
              title: "Update Category Success",
            });
          } else {
            toast({
              title: "Update Category Fail",
            });
          }
        }}
      >
        <div className="">
          <div className="mt-4 w-full"> List Category Images</div>
          <FunctionField
            source="image"
            render={(record: any) => {
              const url = record?.image?.url;
              return <img className="w-24 h-24" src={url}></img>;
            }}
          ></FunctionField>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12 w-full mt-4">
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
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-12 w-full">
          <TextInput source="cateName" required={true} />
          <TextInput source="description" />
        </div>

        <ImageInput
          source="image"
          label="New Category Image"
          accept="image/*"
          multiple={true} // Chỉ cho phép một ảnh
        >
          <ImageField source="src" title="title" />
        </ImageInput>
      </SimpleForm>
    </Edit>
  );
};
