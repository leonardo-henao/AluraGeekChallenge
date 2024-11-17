import { URL_API } from "./config.js";
import { DefaultData } from "./default-data.js";

const urlAPI = URL_API;
const headers = {
  "content-type": "application/json",
};

export const GetProducts = async () => {
  const url = new URL(`${urlAPI}/products`);
  url.searchParams.append("sortBy", "id");
  url.searchParams.append("order", "asc");

  const products = await fetch(url);
  return products.json();
};

export const CreateProduct = async (product) => {
  const response = await fetch(`${urlAPI}/products`, {
    method: "POST",
    headers,
    body: JSON.stringify(product),
  });

  return response.json();
};

export const RemoveProduct = async (id) =>
  await fetch(`${urlAPI}/products/${id}`, {
    method: "DELETE",
    headers,
  });

export const RestoreDefaultData = async () =>
  new Promise((resolve) =>
    DefaultData.forEach((product, i) => {
      fetch(`${urlAPI}/products`, {
        method: "POST",
        headers,
        body: JSON.stringify(product),
      }).then(() => i == 4 && resolve());
    }),
  );
