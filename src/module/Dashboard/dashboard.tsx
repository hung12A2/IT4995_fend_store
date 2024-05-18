/* eslint-disable @next/next/no-img-element */
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useEffect, useState } from "react";
import axios from "../AxiosCustom/custome_Axios";
import { set } from "react-hook-form";
import { useDataProvider, useRedirect } from "react-admin";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatDateTime(dateTimeString: any) {
  const date = new Date(dateTimeString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() trả về 0-11
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export const CustomDash = () => {
  const [data, setData] = useState([]);
  const [dataKiot, setDataKiot] = useState([]);
  const [ListNewStores, setListNewStores] = useState([]);
  const [listNewUser, setListNewUser] = useState([]);
  const [listNewProducts, setListNewProducts] = useState([]);
  const [listNewRequestShops, setListNewRequestShops] = useState([]);
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  useEffect(() => {
    async function fetch() {
      const newDate = new Date();
      newDate.setDate(1);
      newDate.setMonth(newDate.getMonth() - 1);
      const data: any = await axios.get("stores", {
        params: {
          filter: {
            where: {
              createdAt: { gt: newDate },
            },
          },
        },
      });

      const dataUser: any = await axios.get("getAllUser", {
        params: {
          filter: {
            where: {
              createdAt: { gt: newDate },
            },
          },
        },
      });

      const dataShops: any = await axios.get("request-create-shops", {
        params: {
          filter: {
            where: {
              status: "accepted",
              createdAt: { gt: newDate },
            },
          },
        },
      });

      let dataProducts: any = await axios.get("request-create-products", {
        params: {
          filter: {
            where: {
              createdAt: { gt: newDate },
            },
          },
        },
      });

      let dataChart: any = await axios
        .get("ordersAdmin/days/10")
        .then((res) => res)
        .catch((e) => console.log(e));

      let dataKiot: any = await axios
        .get(`ordersKiotAdmin/days/10`)
        .then((res) => res)
        .catch((e) => console.log(e));

      setDataKiot(dataKiot);

      console.log(dataChart);

      const listIDShop = dataProducts.map((item: any) => item.idOfShop);
      const ListShop: any =
        (await dataProvider
          .getMany("stores", { ids: listIDShop })
          .then((res) => res.data)
          .catch((e) => console.log(e))) || [];

      if (ListShop) {
        dataProducts = dataProducts.map((item: any) => {
          const shop = ListShop.find((shop: any) => shop.id === item.idOfShop);
          return { ...item, shopName: shop?.name, shopAvatar: shop?.avatar };
        });
      }

      setData(dataChart);
      setListNewStores(data);
      setListNewUser(dataUser);
      setListNewRequestShops(dataShops);
      setListNewProducts(dataProducts);
    }

    fetch();
  }, [dataProvider]);

  return (
    <div className="mt-12 flex flex-col px-8">
      <div className="w-full flex flex-row gap-x-4">
        <div className="flex flex-col w-1/4">
          <div className="flex flex-row justify-between rounded-lg border-2 w-full relative">
            <div className="flex flex-row">
              <div className="bg-gradient-to-r from-sky-200 to-sky-100 px-4 py-2">
                <ListAltIcon
                  className="text-white text-sky-800"
                  fontSize="large"
                />
              </div>
              <div className="w-8 rounded-full h-full bg-sky-100 -ml-4"></div>
            </div>

            <div className="px-4 py-2 flex flex-col gap-y-2 text-lg ">
              <div className="flex justify-end">New pending create shop</div>
              <div className="flex justify-end">
                {listNewRequestShops?.length || 0}
              </div>
            </div>
          </div>
          <div className="w-full mt-4  border-2 border-gray-200 rounded-lg pb-6">
            <div className="m-4">Pending request create shop</div>
            <div className="mt-2 border-t-2 border-gray-100">
              {listNewRequestShops?.map((item: any) => {
                return (
                  <div
                    onClick={() => {
                      redirect(`/request-create-shops/${item.id}`);
                    }}
                    key={item.id}
                    className="flex flex-row gap-y-2 justify-between hover:cursor-grab hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <div className="flex flex-row py-2">
                      {!item?.avatarOfUser?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTy-6oqxazyyxQwrNeitM4NDATAlVycYmNjqc4H37cmA&s`}
                          alt="shop"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <img
                          src={item?.avatarOfUser?.url}
                          alt="shop"
                          className="w-10 h-10 rounded-full"
                        />
                      )}

                      <div className="flex flex-col ml-4 text-sm">
                        <div className="">Created By:</div>
                        <div>{item.nameOfUser}</div>
                      </div>
                    </div>
                    <div className="text-sm flex justify-center items-center flex-col">
                      {formatDateTime(item.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-1/4">
          <div className="flex flex-row justify-between rounded-lg border-2 w-full relative">
            <div className="flex flex-row">
              <div className="bg-gradient-to-r from-sky-200 to-sky-100 px-4 py-2">
                <ListAltIcon
                  className="text-white text-sky-800"
                  fontSize="large"
                />
              </div>
              <div className="w-8 rounded-full h-full bg-sky-100 -ml-4"></div>
            </div>

            <div className="px-4 py-2 flex flex-col gap-y-2 text-lg ">
              <div className="flex justify-end">
                New pending create products
              </div>
              <div className="flex justify-end">
                {listNewProducts?.length || 0}
              </div>
            </div>
          </div>
          <div className="w-full mt-4  border-2 border-gray-200 rounded-lg pb-6">
            <div className="m-4">Pending request create shop</div>
            <div className="mt-2 border-t-2 border-gray-100">
              {listNewProducts?.map((item: any) => {
                return (
                  <div
                    onClick={() => {
                      redirect(`/request-create-products/${item.id}`);
                    }}
                    key={item.id}
                    className="flex flex-row gap-y-2 justify-between hover:cursor-grab hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <div className="flex flex-row py-2">
                      {!item?.shopAvatar?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTy-6oqxazyyxQwrNeitM4NDATAlVycYmNjqc4H37cmA&s`}
                          alt="shop"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <img
                          src={item?.avatarOfUser?.url}
                          alt="shop"
                          className="w-10 h-10 rounded-full"
                        />
                      )}

                      <div className="flex flex-col ml-4 text-sm">
                        <div className="">Created By:</div>
                        <div>{item.shopName}</div>
                      </div>
                    </div>
                    <div className="text-sm flex justify-center items-center flex-col">
                      {formatDateTime(item.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-1/4">
          <div className="flex flex-row justify-between rounded-lg border-2 w-full relative">
            <div className="flex flex-row">
              <div className="bg-gradient-to-r from-sky-200 to-sky-100 px-4 py-2">
                <ListAltIcon
                  className="text-white text-sky-800"
                  fontSize="large"
                />
              </div>
              <div className="w-8 rounded-full h-full bg-sky-100 -ml-4"></div>
            </div>

            <div className="px-4 py-2 flex flex-col gap-y-2 text-lg ">
              <div className="flex justify-end">New User</div>
              <div className="flex justify-end">{listNewUser?.length || 0}</div>
            </div>
          </div>
          <div className="w-full mt-4  border-2 border-gray-200 rounded-lg pb-6">
            <div className="m-4">New Users</div>
            <div className="mt-2 border-t-2 border-gray-100">
              {listNewUser?.map((item: any) => {
                return (
                  <div
                    onClick={() => {
                      redirect(`/getAllUser/${item.id}`);
                    }}
                    key={item.id}
                    className="flex flex-row gap-y-2 justify-between hover:cursor-grab hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <div className="flex flex-row py-2">
                      {!item?.avatar?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTy-6oqxazyyxQwrNeitM4NDATAlVycYmNjqc4H37cmA&s`}
                          alt="shop"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <img
                          src={item?.avatar?.url}
                          alt="shop"
                          className="w-10 h-10 rounded-full"
                        />
                      )}

                      <div className="flex flex-col ml-4 text-sm">
                        <div className="">Name:</div>
                        <div>{item.fullName}</div>
                      </div>
                    </div>
                    <div className="text-sm flex justify-center items-center flex-col">
                      {formatDateTime(item.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col w-1/4">
          <div className="flex flex-row justify-between rounded-lg border-2 w-full relative">
            <div className="flex flex-row">
              <div className="bg-gradient-to-r from-sky-200 to-sky-100 px-4 py-2">
                <ListAltIcon
                  className="text-white text-sky-800"
                  fontSize="large"
                />
              </div>
              <div className="w-8 rounded-full h-full bg-sky-100 -ml-4"></div>
            </div>

            <div className="px-4 py-2 flex flex-col gap-y-2 text-lg ">
              <div className="flex justify-end">New Shop</div>
              <div className="flex justify-end">
                {ListNewStores?.length || 0}
              </div>
            </div>
          </div>
          <div className="w-full mt-4  border-2 border-gray-200 rounded-lg pb-6">
            <div className="m-4">New Shops</div>
            <div className="mt-2 border-t-2 border-gray-100">
              {ListNewStores?.map((item: any) => {
                return (
                  <div
                    onClick={() => {
                      redirect(`/stores/${item.id}`);
                    }}
                    key={item.id}
                    className="flex flex-row gap-y-2 justify-between hover:cursor-grab hover:bg-gray-100 p-2 rounded-lg"
                  >
                    <div className="flex flex-row py-2">
                      {!item?.avatar?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTy-6oqxazyyxQwrNeitM4NDATAlVycYmNjqc4H37cmA&s`}
                          alt="shop"
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <img
                          src={item?.avatar?.url}
                          alt="shop"
                          className="w-10 h-10 rounded-full"
                        />
                      )}

                      <div className="flex flex-col ml-4 text-sm">
                        <div className="">Shop Name:</div>
                        <div>{item.name}</div>
                      </div>
                    </div>
                    <div className="text-sm flex justify-center items-center flex-col">
                      {formatDateTime(item.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row">
        <div className="w-1/2 py-4  rounded-lg border-2 border-gray-100">
          <div className="ml-4 mt-2">Orders in 10 days</div>
          <BarChart width={730} height={250} data={data} className="mt-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="order" fill="#8884d8" />
            <Bar dataKey="orderSuccess" fill="#82ca9d" />
          </BarChart>
        </div>

        <div className="w-1/2 py-4  rounded-lg border-2 border-gray-100">
          <div className="ml-4 mt-2">Orders kiot in 10 days</div>
          <BarChart width={730} height={250} data={dataKiot} className="mt-4">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="order" fill="#8884d8" />
            <Bar dataKey="orderSuccess" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};
