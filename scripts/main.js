import { CreateProduct, GetProducts } from "../api/api-endpoints.js";
import { DrawCarProduct } from "./draw.js";

const targetListProducts = document.querySelector("#list__products");

export const showProducts = async () => {
  const products = await GetProducts();

  products.forEach((product) => {
    let p = DrawCarProduct(product);
    targetListProducts.append(p);
  });
};

export const createProduct = async (e) => {
  e.preventDefault();

  const newForm = new FormData(e.target);
  const product = Object.fromEntries(newForm);

  const response = await CreateProduct(product);
  const p = DrawCarProduct(response);
  targetListProducts.prepend(p);

  e.target.reset();
};

export const changeViewList = (newTypeList) =>
  targetListProducts.setAttribute("type", newTypeList);

const callbackMutation = function (mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes") {
      if (mutation.attributeName === "type") {
        const type = targetListProducts.getAttribute("type");
        if (type === "list") {
          document
            .querySelector("#header__list-buttons-list")
            .setAttribute("enable", "true");

          document
            .querySelector("#header__list-buttons-square")
            .setAttribute("enable", "false");
        } else if (type === "square") {
          document
            .querySelector("#header__list-buttons-square")
            .setAttribute("enable", "true");

          document
            .querySelector("#header__list-buttons-list")
            .setAttribute("enable", "false");
        }
      }
    }
  }
};

const observer = new MutationObserver(callbackMutation);
observer.observe(targetListProducts, { attributes: true });

showProducts();

window.createProduct = createProduct;
window.changeViewList = changeViewList;
