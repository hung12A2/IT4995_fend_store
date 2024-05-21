/* eslint-disable jsx-a11y/alt-text */
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
  const [revenue, setRevenue] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [ListOrders, setListOrders] = useState([]);
  const [ListOrdersKiot, setListOrdersKiot] = useState([]);
  const [ListRating, setListRating] = useState([]);
  const [listProducts, setListproducts] = useState([]);
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  useEffect(() => {
    async function fetch() {
      const newDate = new Date();
      newDate.setDate(1);
      newDate.setMonth(newDate.getMonth() - 1);

      const dataProducts: any = await axios.get("productsForShop", {
        params: {
          filter: {
            limit: 5,
            order: "numberOfSold DESC",
            where: {
              createdAt: { gt: newDate },
            },
          },
        },
      });

      let dataOrders: any = await axios.get("ordersShop", {
        params: {
          filter: {
            where: {
              status: "pending",
              createdAt: { gt: newDate },
            },
          },
        },
      });

      const listIdOrder = dataOrders.map((order: any) => order.idOfUser);
      const ListUserORder: any =
        (await dataProvider
          .getMany("getAllUser", { ids: listIdOrder })
          .then((res) => res.data)
          .catch((e) => console.log(e))) || [];

      if (ListUserORder) {
        dataOrders = dataOrders.map((item: any) => {
          const user = ListUserORder.find(
            (user: any) => user.id === item.idOfUser
          );
          return {
            ...item,
            userName: user?.fullName,
            userAvatar: user?.avatar,
          };
        });
      }

      let dataOrdersKiot: any = await axios.get("ordersKiotShop", {
        params: {
          filter: {
            where: {
              status: "pending",
              createdAt: { gt: newDate },
            },
          },
        },
      });

      const listIdOrderKiot = dataOrdersKiot.map(
        (order: any) => order.idOfUser
      );

      const ListUserORderKiot: any =
        (await dataProvider
          .getMany("getAllUser", { ids: listIdOrderKiot })
          .then((res) => res.data)
          .catch((e) => console.log(e))) || [];

      if (ListUserORderKiot) {
        dataOrdersKiot = dataOrdersKiot.map((item: any) => {
          const user = ListUserORderKiot.find(
            (user: any) => user.id === item.idOfUser
          );
          return {
            ...item,
            userName: user?.fullName,
            userAvatar: user?.avatar,
          };
        });
      }

      let dataRating: any = await axios.get("ratingsForShop", {
        params: {
          filter: {
            where: {
              createdAt: { gt: newDate },
            },
          },
        },
      });
      const listIdUserRating = dataRating.map((rating: any) => rating.idOfUser);

      const ListUserRating: any =
        (await dataProvider
          .getMany("getAllUser", { ids: listIdUserRating })
          .then((res) => res.data)
          .catch((e) => console.log(e))) || [];

      if (ListUserRating) {
        dataRating = dataRating.map((item: any) => {
          const user = ListUserRating.find(
            (user: any) => user.id === item.idOfUser
          );
          return {
            ...item,
            userName: user?.fullName,
            userAvatar: user?.avatar,
          };
        });
      }

      let dataChart: any = await axios
        .get("ordersShop/days/10")
        .then((res) => res)
        .catch((e) => console.log(e));

      let dataKiot: any = await axios
        .get(`ordersKiotShop/days/10`)
        .then((res) => res)
        .catch((e) => console.log(e));

      let revenue: any = await axios
        .get(`/transaction-shopsForShop/sum/10`)
        .then((res) => res)
        .catch((e) => console.log(e));

      let transactions: any = await axios
        .get(`/transaction-shopsForShop/days/10`)
        .then((res) => res)
        .catch((e) => console.log(e));

      setListRating(dataRating);
      setTransactions(transactions);
      setRevenue(revenue);
      setDataKiot(dataKiot);
      setData(dataChart);
      setListOrders(dataOrders);
      setListOrdersKiot(dataOrdersKiot);
      setListproducts(dataProducts);
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
              <div className="flex justify-end">Revenue 10days</div>
              <div className="flex justify-end">{revenue} dong</div>
            </div>
          </div>
          <div className="w-full mt-4  border-2 border-gray-200 rounded-lg pb-6">
            <div className="m-4">Top10 Best seller</div>
            <div className="flex flex-col gap-y-4 w-full ">
              {listProducts.map((product: any) => (
                <div
                  onClick={() => redirect(`/productsForShop/${product.id}`)}
                  className="flex flex-row justify-between	w-full border-b-2 border-gray-2 hover:bg-gray-100 px-4 rouded-lg py-2 hover:cursor-grab"
                  key={product.id}
                >
                  <img
                    src={product.image[0].url}
                    className=" rounded-full w-12 h-12 object-cover "
                  />
                  <div className="flex flex-col">
                    <div>name: {product.name}</div>
                    <div className="flex flex-row justify-end">
                      sold: {product.numberOfSold ? product.numberOfSold : 0}
                    </div>
                  </div>
                </div>
              ))}
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
              <div className="flex justify-end">New pending orders</div>
              <div className="flex justify-end">{ListOrders?.length || 0}</div>
            </div>
          </div>
          <div className="w-full mt-4  border-2 border-gray-200 rounded-lg pb-6">
            <div className="m-4">New pending orders</div>
            <div>
              {ListOrders.map((order: any) => (
                <div
                  onClick={() => redirect(`/ordersShop/${order.id}`)}
                  className="flex flex-row justify-between	w-full border-b-2 border-gray-2 hover:bg-gray-100 px-4 rouded-lg py-2 hover:cursor-grab"
                  key={order.id}
                >
                  <img
                    src={order.userAvatar.url}
                    className=" rounded-full w-12 h-12 object-cover "
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-end">
                      created By: {order.userName}
                    </div>
                    <div className="flex flex-row justify-end">
                      time: {formatDateTime(order.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
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
              <div className="flex justify-end">New pending orders Kiot</div>
              <div className="flex justify-end">
                {ListOrdersKiot?.length || 0}
              </div>
            </div>
          </div>
          <div className="w-full mt-4  border-2 border-gray-200 rounded-lg pb-6">
            <div className="m-4">New pending orders Kiot</div>
            <div>
              {ListOrdersKiot.map((order: any) => (
                <div
                  onClick={() => redirect(`/ordersKiotShop/${order.id}`)}
                  className="flex flex-row justify-between	w-full border-b-2 border-gray-2 hover:bg-gray-100 px-4 rouded-lg py-2 hover:cursor-grab"
                  key={order.id}
                >
                  <img
                    src={order.userAvatar.url}
                    className=" rounded-full w-12 h-12 object-cover "
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-end">
                      created By: {order.userName}
                    </div>
                    <div className="flex flex-row justify-end">
                      time: {formatDateTime(order.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
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
              <div className="flex justify-end">New Rating</div>
              <div className="flex justify-end">{ListRating?.length || 0}</div>
            </div>
          </div>
          <div className="w-full mt-4  border-2 border-gray-200 rounded-lg pb-6">
            <div className="m-4">New Rating</div>
            <div>
              {ListRating.map((rating: any) => (
                <div
                  className="flex flex-row justify-between 	w-full border-b-2 border-gray-2 hover:bg-gray-100 px-4 rouded-lg py-2 hover:cursor-grab"
                  key={rating.id}
                >
                  <img
                    src={rating.userAvatar.url}
                    className=" rounded-full w-12 h-12 object-cover"
                  />
                  <div className="flex flex-col justify-end">
                    <div className="flex flex-row justify-end">
                      {rating.comment}
                    </div>
                    <div className="flex flex-row justify-end">
                      rating: {rating.rating}
                    </div>
                  </div>
                </div>
              ))}
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

      <div className=" flex flex-row">
        <div className="w-1/2 py-4  rounded-lg border-2 border-gray-100">
          <div className="ml-4 mt-2">Transaction in 10 days</div>
          <BarChart
            width={730}
            height={250}
            data={transactions}
            className="mt-4"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
            <Bar dataKey="numberTransaction" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};
