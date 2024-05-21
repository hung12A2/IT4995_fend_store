import { BASE_URL } from "./constant";

export const signIn = async (email: string, password: string) => {
  const result = await fetch(`${BASE_URL}/login/Customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const json = await result.json();
  const token = json.token;
  if (typeof window !== "undefined") {
    localStorage.setItem("token", JSON.stringify({ token }));
  }

  const user = await (
    await fetch(`${BASE_URL}/whoAmI`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).json();
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify({ user }));
  }
  return json;
};
