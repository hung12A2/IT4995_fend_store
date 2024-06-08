import { useToast } from "@/components/ui/use-toast";
import { dataProvider } from "@/provider/dataProvider";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Button,
  Create,
  Datagrid,
  DateField,
  Edit,
  EditButton,
  FilterForm,
  List,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput,
  useAuthProvider,
} from "react-admin";


const postFilters = [
  <TextInput key={"id"} label="id" source="where.id.like" alwaysOn={true} />,
  <TextInput
    key={"name"}
    label="name"
    source="where.name.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"provinceName"}
    label="provinceName"
    source="where.provinceName.like"
    alwaysOn={true}
  />,
  <TextInput
    key={"districtName"}
    label="districtName"
    source="where.districtName.like"
    alwaysOn={true}
  />,
];

export const ListAreas = (props: any) => {
  return (
    <List >
      <FilterForm filters={postFilters}></FilterForm>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="provinceName" />
        <TextField source="districtName" />
        <DateField source="createdAt" showTime />
        <TextField source="createdBy" />
      </Datagrid>
    </List>
  );
};
