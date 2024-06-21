"use client";
import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "../module/AxiosCustom/custome_Axios";
import { socket } from "@/module/socket/socket";
import { useAuthProvider } from "react-admin";

const initialState = {
  selectedConversation: null,
  listConversation: [],
  listMsg: [],
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setListConversation": {
      return {
        ...state,
        listConversation: action.payload,
      };
    }
    case "setListMsg": {
      return {
        ...state,
        listMsg: action.payload,
      };
    }
    case "setSelectedConversation": {
      return {
        ...state,
        selectedConversation: action.payload,
      };
    }
  }
};


export const useChatContext = () => {
  return useContext<any>(ChatContext);
};

export const ChatContext = createContext<any>({});


export function ChatProvider ({ children }: { children: React.ReactNode }) {
  let user: any = localStorage.getItem("user") || null;
  user = JSON.parse(user)?.user;


  const initializer = () => {
    return {};
  };

  const [state, dispatch] = useReducer(reducer, initialState, initializer);

  const setListConversation = (data: any) => {
    dispatch({
      type: "setListConversation",
      payload: data,
    });
  };

  const setListMsg = (data: any) => {
    dispatch({
      type: "setListMsg",
      payload: data,
    });
  };

  const setSelectedConversation = (data: any) => {
    dispatch({
      type: "setSelectedConversation",
      payload: data,
    });
  };

  useEffect(() => {
    if (state?.selectedConversation) {
      socket.on(`serverInviteToRoom`, (data) => {
        socket.emit(`joinConversation`, {
          idOfUser: state?.selectedConversation?.idOfUser,
          idOfShop: state?.selectedConversation?.idOfShop,
        });
      });
    }
  }, [state?.selectedConversation]);

  useEffect(() => {
    socket.emit("listConversation", {
      idOfShop: user?.idOfShop,
    });
  }, [user?.idOfShop]);

  useEffect(() => {
    socket.on("server-listConversation", async (data) => {
      const listIdUser = data.map((item: any) => item.idOfUser);
      let dataUser: any = await axios
        .get(`getAllUser`, {
          params: {
            filter: {
              where: {
                id: {
                  inq: listIdUser,
                },
              },
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));

      data = data.map((item: any) => {
        return {
          ...item,
          user: dataUser.find((user: any) => user.id === item.idOfUser),
        };
      });

      setListConversation(data);
    });

    socket.on("server-send-msg", (data) => {
      const { listMsg, listConversation } = state;
      if (listMsg?.[0] && listMsg[0].id != data.id) {
        setListMsg([data, ...listMsg]);
      }

      const listCon = listConversation?.map((item: any) => {
        if (item.idOfUser == data.idOfUser) {
          item.lastMsg = data.content;

          return item;
        }

        return item;
      });

      setListConversation(listCon);
    });

    socket.on("server-list-msg", (data) => {
      console.log(data);
      setListMsg(data);
    });
  }, [state]);

  useEffect(() => {
    socket.emit("list-msg", {
      idOfUser: state?.selectedConversation?.idOfUser,
      idOfShop: state?.selectedConversation?.idOfShop,
      limitmsg: 20,
    });
  }, [state?.selectedConversation]);

  const value = {
    ...state,
    setListConversation,
    setListMsg,
    setSelectedConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;

}