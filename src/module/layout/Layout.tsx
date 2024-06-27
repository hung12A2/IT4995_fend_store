/* eslint-disable @next/next/no-img-element */
import {
  AppBar,
  Layout,
  Logout,
  UserMenu,
  useUserMenu,
  useRedirect,
  Menu,
  TitlePortal,
  useGetIdentity,
} from "react-admin";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { NotificationAdd } from "@mui/icons-material";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEffect, useState } from "react";
import axios from "../../module/AxiosCustom/custome_Axios";

function formatDate(date: string) {
  const dateObj = new Date(date);

  const formattedDate = `${dateObj
    .toLocaleTimeString("vi-VN")
    .slice(0, 5)} ${dateObj.toLocaleDateString("vi-VN")}`;

  return formattedDate;
}

function formatString(str: string, length: number) {
  return str.length > length ? str.substring(0, length) + "..." : str;
}

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
      <div
        className="px-4 py-2 border-b-2 hover:cursor-grab hover:bg-gray-100"
        onClick={() => {
          onClose();
          redirect("/shopInfo");
        }}
      >
        <AccountCircleIcon className="mr-3" />
        <span>shopInfo</span>
      </div>
      <div
        className="px-4 py-2 border-b-2 hover:cursor-grab hover:bg-gray-100"
        onClick={() => {
          onClose();
          redirect("/kiotInfo");
        }}
      >
        <AccountCircleIcon className="mr-3" />
        <span>kiotInfo</span>
      </div>
    </div>
  );
};

const MyAvatar = ({ avatar }: { avatar: string }) => {
  console.log(avatar);
  return (
    <Avatar>
      <AvatarImage src={avatar}></AvatarImage>
      <AvatarFallback>HN</AvatarFallback>
    </Avatar>
  );
};

const MyAppBar = (props: any) => {
  const data = useGetIdentity();
  const isLoading = data?.isLoading;
  const user = data?.data?.user;
  const [listNoti, setListNoti] = useState<any[]>([]);
  const redirect = useRedirect();

  useEffect(() => {
    async function fetchData() {
      const res: any = await axios
        .get(`notification-for-shops`, {
          params: {
            filter: {
              order: "createdAt DESC",
              limit: 5,
              where: {
                idOfShop: user?.idOfShop,
              },
            },
          },
        })
        .then((res) => res.data)
        .catch((e) => console.log(e));

      console.log(res);
      setListNoti(res);
    }

    fetchData();
  }, [user?.idOfShop]);

  if (isLoading) return null;

  return (
    <AppBar
      userMenu={
        <UserMenu icon={<MyAvatar avatar={user?.avatar?.url} />} {...props}>
          <MenuItems />
          <Logout />
        </UserMenu>
      }
    >
      <TitlePortal />
      <HoverCard>
        <HoverCardTrigger>
          <NotificationAdd />
        </HoverCardTrigger>
        <HoverCardContent className="w-fit">
          <div>
            {listNoti &&
              listNoti?.map((item: any) => {
                return (
                  <div
                    onClick={() => {
                      if (!item?.title.includes("hoa toc")) {
                        redirect (`/ordersShop/${item?.idOfOrder}`)
                      } else { 
                        redirect (`/ordersKiotShop/${item?.idOfOrder}`)
                      }
                    }}
                    key={item?.id}
                    className="px-4 py-4 border-b-[1px] border-gray-200 hover:cursor-pointer w-[500px] hover:bg-gray-100 flex flex-row justify-between"
                  >
                    <div className="flex flex-row gap-x-4 ">
                      <img
                        src={
                          item?.image?.url ||
                          "https://nld.mediacdn.vn/291774122806476800/2022/12/28/avatar-the-way-of-water-1670943667-1672220380184583234571.jpeg"
                        }
                        alt="img"
                        className="w-20 h-20"
                      />
                      <div className="flex flex-col">
                        <div className="">{item?.title}</div>
                        <div className="text-sm font-light mt-2">
                          {formatString(item?.content, 150)}
                        </div>
                        <div className="text-sm font-light mt-1">
                          {formatDate(item?.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div
            className="w-full flex justify-center items-center py-2 hover:cursor-grab hover:bg-gray-100"
            onClick={() => {
              redirect("/notifications");
            }}
          >
            Xem chi tiet{" "}
          </div>
        </HoverCardContent>
      </HoverCard>
    </AppBar>
  );
};

const MyMenu = (props: any) => {
  return (
    <Menu>
      <Menu.DashboardItem />
      <Menu.ResourceItem name="areas" />
      <Menu.ResourceItem name="stores" />
      <Menu.ResourceItem name="request-create-shops" />
      <Menu.ResourceItem name="kiots" />
      <Menu.ResourceItem name="employeesForShop" />
      <Menu.ResourceItem name="categories" />
      <Menu.ResourceItem name="productsForShop" />
      <Menu.ResourceItem name="request-create-products-for-shop" />
      <Menu.ResourceItem name="ordersShop" />
      <Menu.ResourceItem name="ordersKiotShop" />
      <Menu.ResourceItem name="transaction-shopsForShop" />
      <Menu.ResourceItem name="transaction-shops" />
      <Menu.ResourceItem name="return-ordersForShop" />
      <Menu.ResourceItem name="ratingsForShop" />
      <Menu.ResourceItem name="add-forms" />
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
