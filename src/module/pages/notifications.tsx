/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useGetIdentity, useRedirect } from "react-admin";
import axios from "../../module/AxiosCustom/custome_Axios";

function formatDate(date: string) {
  const dateObj = new Date(date);

  const formattedDate = `${dateObj
    .toLocaleTimeString("vi-VN")
    .slice(0, 5)} ${dateObj.toLocaleDateString("vi-VN")}`;

  return formattedDate;
}

export default function Home() {
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

      setListNoti(res);
    }

    fetchData();
  }, [user?.idOfShop]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col w-full bg-white mb-12 px-8">
      <div className="px-4 py-4 border-b-[1px] text-lg font-medium mt-4 border-gray-300 text-gray-500">
        Thong bao don hang
      </div>
      <div>
        {listNoti &&
          listNoti?.map((item: any) => {
            return (
              <div
                onClick={() => {
                  if (!item?.title.includes("hoa toc")) {
                    redirect(`/ordersShop/${item?.idOfOrder}`);
                  } else {
                    redirect(`/ordersKiotShop/${item?.idOfOrder}`);
                  }
                }}
                key={item?.id}
                className="px-4 py-4 border-b-[1px] border-gray-200 hover:cursor-pointer hover:bg-gray-100 flex flex-row justify-between"
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
                      {item?.content}{" "}
                    </div>
                    <div className="text-sm font-light mt-1">
                      {formatDate(item?.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="w-[250px] flex justify-end">
                  <div className="text-sm px-2 py-1 border-[1px] h-fit border-gray-300">
                    Xem chi tiet
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
