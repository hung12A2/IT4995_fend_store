"use client";
import { Admin, CustomRoutes, Resource, useGetIdentity } from "react-admin";
import { Login } from "@/module/auth/login";
import { authProvider } from "@/provider/authProvider";
import { dataProvider } from "@/provider/dataProvider";
import { ListAreas } from "@/module/Areas/Areas";
import { Route } from "react-router-dom";
import { MainLayout } from "@/module/layout/Layout";
import CameraRearRoundedIcon from "@mui/icons-material/CameraRearRounded";
import { Profile } from "@/module/pages/Profile";
import { ListUser } from "@/module/Users/users";
import { ListStores, ShowStores } from "@/module/Stores/stores";
import {
  ListRequestShops,
  ShowRequestShopsDetails,
} from "@/module/ReqCreateShops/RequestCreateShops";
import { ListKiots, ShowKiot } from "@/module/Kiots/kiots";
import { ListEmployee, ShowEmployee, createEmployee } from "@/module/Employees/Employees";
import { ListAdmin, CreateAdmin, EditAdmin } from "@/module/Admin/admin";
import {
  CreateCategories,
  EditCategories,
  ListCategories,
} from "@/module/Categories/categories";
import {
  CreateRequestProducts,
  ListRequestProducts,
  ShowRequest,
} from "@/module/CreateProducts/requestCreateProducts";
import { ListProducts, ShowProducts } from "@/module/Products/Products";
import { ListOrder, ShowOrder } from "@/module/Orders/orders";
import { ListOrdersKiot, ShowOrdersKiot } from "@/module/OrdersKiot/ordersKiot";
import {
  ListUserTrangsaction,
  ShowTransaction,
} from "@/module/UserTransaction/userTransaction";
import {
  ListShopTrangsaction,
  ShowShopTransaction,
} from "@/module/ShopTransaction/ShopTransaction";
import {
  ListReturnOrder,
  ShowReturnOrder,
} from "@/module/ReturnOrder/returnOrder";
import PaidIcon from "@mui/icons-material/Paid";
import { CustomDash } from "@/module/Dashboard/dashboard";
import PersonIcon from "@mui/icons-material/Person";
import ShopIcon from "@mui/icons-material/Shop";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import AddCardIcon from "@mui/icons-material/AddCard";
import BadgeSharpIcon from "@mui/icons-material/BadgeSharp";
import SupervisorAccountSharpIcon from "@mui/icons-material/SupervisorAccountSharp";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import { ListRating, ShowRating } from "@/module/Rating/rating";
import { ShopInfo } from "@/module/pages/ShopInfo";
import { KiotInfo } from "@/module/pages/KiotInfo";

export default function Home() {
  return (
    <Admin
      loginPage={Login}
      authProvider={authProvider}
      dataProvider={dataProvider}
      layout={MainLayout}
      dashboard={CustomDash}
    >
      <Resource
        name="areas"
        list={ListAreas}
        icon={CameraRearRoundedIcon}
        options={{
          label: "Areas",
        }}
      />

      <Resource
        name="categories"
        list={ListCategories}
        edit={EditCategories}
        icon={CategoryOutlinedIcon}
        options={{
          label: "Categories",
        }}
      />

      <Resource
        name="employeesForShop"
        list={ListEmployee}
        create={createEmployee}
        edit={ShowEmployee}
        icon={BadgeSharpIcon}
        options={{
          label: "Employees",
        }}
      />

      <Resource
        name="productsForShop"
        list={ListProducts}
        edit={ShowProducts}
        icon={ProductionQuantityLimitsOutlinedIcon}
        options={{ label: "Products" }}
      />

      <Resource
        name="request-create-products-for-shop"
        list={ListRequestProducts}
        create={CreateRequestProducts}
        edit={ShowRequest}
        icon={ProductionQuantityLimitsOutlinedIcon}
        options={{ label: "Request Products" }}
      />

      <Resource
        name="ordersShop"
        list={ListOrder}
        edit={ShowOrder}
        options={{ label: "Orders" }}
        icon={ListAltIcon}
      />

      <Resource
        name="ordersKiotShop"
        list={ListOrdersKiot}
        edit={ShowOrdersKiot}
        options={{ label: "OrdersKiot" }}
        icon={ListAltIcon}
      />

      <Resource
        name="transaction-shopsForShop"
        list={ListShopTrangsaction}
        edit={ShowShopTransaction}
        options={{ label: "Transaction" }}
        icon={AddBusinessIcon}
      />
      
      <Resource
        name="return-ordersForShop"
        list={ListReturnOrder}
        edit={ShowReturnOrder}
        icon={AssignmentReturnIcon}
      /> 
      {/* ratingsForShop */}

      <Resource
        name="ratingsForShop"
        list={ListRating}
        edit={ShowRating}
        icon={AssignmentReturnIcon}
      /> 

      <CustomRoutes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/shopInfo" element={<ShopInfo />} />
        <Route path="/kiotInfo" element={<KiotInfo />} />

      </CustomRoutes>

      {/* <CustomRoutes noLayout={true}>
      </CustomRoutes> */}
    </Admin>
  );
}
