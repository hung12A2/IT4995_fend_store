import {
  AppBar,
  Layout,
  Logout,
  UserMenu,
  useUserMenu,
  useRedirect,
  Menu,
} from "react-admin";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const MenuItems = () => {
  const { onClose } = useUserMenu();
  const redirect = useRedirect();

  return (
    <div>
      <div
        className="px-4 py-2 border-b-2 hover:cursor-grab hover:bg-gray-100"
        onClick={() => {
          onClose();
          redirect("/profile");
        }}
      >
        <AccountCircleIcon className="mr-3" />
        <span>Profile</span>
      </div>
    </div>
  );
};

const MyAvatar = () => {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
      <AvatarFallback>HN</AvatarFallback>
    </Avatar>
  );
};

const MyAppBar = (props: any) => {
  return (
    <AppBar
      userMenu={
        <UserMenu icon={<MyAvatar />} {...props}>
          <MenuItems />
          <Logout />
        </UserMenu>
      }
    ></AppBar>
  );
};

const MyMenu = (props: any) => {
  return (
    <Menu>
      <Menu.DashboardItem />
      <Menu.ResourceItem name="areas" />
      <Menu.ResourceItem name="admins" />
      <Menu.ResourceItem name="getAllUser" />
      <Menu.ResourceItem name="stores" />
      <Menu.ResourceItem name="request-create-shops" />
      <Menu.ResourceItem name="kiots" />
      <Menu.ResourceItem name="employees" />
      <Menu.ResourceItem name="categories" />
      <Menu.ResourceItem name="products" />
      <Menu.ResourceItem name="request-create-products" />
      <Menu.ResourceItem name="ordersAdmin" />
      <Menu.ResourceItem name="ordersKiotAdmin" />
      <Menu.ResourceItem name="transactions" />
      <Menu.ResourceItem name="transaction-shops" />
      <Menu.ResourceItem name="return-orders" />
    </Menu>
  );
};

export const MainLayout = ({ children }: any) => {
  return (
    <Layout menu={MyMenu} appBar={MyAppBar}>
      {children}
    </Layout>
  );
};
