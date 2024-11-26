import { RemoveProduct, RestoreDefaultData } from "../api/api-endpoints.js";
import { showProducts } from "../scripts/main.js";

/*
 * Dibuja la tarjeta de un producto
 * @param {Object} product información del producto
 */
export const DrawCarProduct = (product) => {
  const div = document.createElement("div");
  div.setAttribute("class", "car__product");
  div.setAttribute("aria-label", `Tarjeta de producto ${product.name}`);
  div.setAttribute("id", `card_product_id-${product.id}`);
  div.onclick = () => ShowModalProduct(product);

  const image = document.createElement("img");
  image.setAttribute("aria-label", `Imagen del producto ${product.name}`);
  image.setAttribute("src", product.photo);
  image.setAttribute("loading", "lazy");
  image.setAttribute("alt", `Imagen del producto ${product.name}`);

  const divDataProduct = document.createElement("div");
  divDataProduct.setAttribute(
    "aria-label",
    `Contenedor de la información del producto ${product.name}`,
  );
  divDataProduct.setAttribute("class", "car__product-data");

  const h3Name = document.createElement("h3");
  h3Name.setAttribute("aria-label", `Nombre del producto ${product.name}`);
  h3Name.innerHTML = product.name;

  const pDescription = document.createElement("p");
  pDescription.setAttribute(
    "aria-label",
    `Descripción del producto ${product.name}`,
  );
  pDescription.innerHTML = product.description;

  const spPrice = document.createElement("span");
  spPrice.setAttribute("aria-label", `Precio del producto ${product.name}`);
  spPrice.setAttribute("class", "car__product-price");
  spPrice.innerHTML = parseFloat(product.price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
  divDataProduct.append(h3Name, pDescription, spPrice);

  div.append(image, divDataProduct);
  return div;
};

/*
 * Muestra un modal con la información del producto indicado
 * @param {Object} product información del producto
 */
const ShowModalProduct = (product) => {
  const divModalProduct = document.createElement("div");
  divModalProduct.setAttribute(
    "aria-label",
    `Modal con información del producto ${product.name}`,
  );
  divModalProduct.setAttribute("class", "modal");

  const bodyModal = document.createElement("div");
  bodyModal.setAttribute(
    "aria-label",
    `Contenido del modal con información del producto ${product.name}`,
  );
  bodyModal.setAttribute("class", "modal__body");

  const image = document.createElement("img");
  image.setAttribute("aria-label", `Imagen del producto ${product.name}`);
  image.setAttribute("src", product.photo);
  image.setAttribute("class", "modal__body-image");
  image.setAttribute("alt", `Imagen del producto ${product.name}`);

  const h3Name = document.createElement("h3");
  h3Name.setAttribute("aria-label", `Nombre del producto ${product.name}`);
  h3Name.innerHTML = product.name;

  const pDescription = document.createElement("p");
  pDescription.setAttribute(
    "aria-label",
    `Descripción del producto ${product.name}`,
  );
  pDescription.innerHTML = product.description;

  const spPrice = document.createElement("span");
  spPrice.setAttribute("aria-label", `Precio del producto ${product.name}`);
  spPrice.setAttribute("class", "car__product-price");
  spPrice.innerHTML = parseFloat(product.price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

  const btnRemoveProduct = document.createElement("button");
  btnRemoveProduct.setAttribute(
    "aria-label",
    "Botón para eliminar el producto",
  );
  btnRemoveProduct.setAttribute("class", "modal__body-remove");
  btnRemoveProduct.innerHTML = "Eliminar producto";
  btnRemoveProduct.onclick = () => {
    ShowModalConfirmationRemove(product, () => {
      RemoveProduct(product.id).then((x) => {
        if (x.status == 200) {
          divModalProduct.remove();
          const card = document.getElementById(`card_product_id-${product.id}`);
          card.remove();
          ShowToast("Producto eliminado correctamente", "success");

          const listProducts = document.getElementById("list__products");
          const listProductsCount = listProducts.childElementCount;

          if (listProductsCount == 0) {
            RestoreDefaultData().then(() => {
              showProducts();
              ShowToast("Se restauraron los productos por defecto", "success");
            });
          }
        }
      });
    });
  };

  const buttonClose = document.createElement("button");
  buttonClose.setAttribute("aria-label", "Botón para cerrar el modal");
  buttonClose.setAttribute("class", "modal__body-close");
  buttonClose.innerHTML = "&times;";
  buttonClose.onclick = () => divModalProduct.remove();

  bodyModal.append(
    h3Name,
    image,
    pDescription,
    spPrice,
    buttonClose,
    btnRemoveProduct,
  );

  const ShowModalConfirmationRemove = (product, callRemove) => {
    const modalConfirmation = document.createElement("div");
    modalConfirmation.setAttribute(
      "aria-label",
      "Modal de confirmación de eliminar producto",
    );
    modalConfirmation.setAttribute("class", "modal");

    const bodyModalConfirmation = document.createElement("div");
    bodyModalConfirmation.setAttribute(
      "aria-label",
      "Contenido del modal de confirmación de eliminar producto",
    );
    bodyModalConfirmation.setAttribute("class", "modal__body");

    const message = document.createElement("span");
    message.setAttribute(
      "aria-label",
      "Mensaje del modal de confirmación de eliminar producto",
    );
    message.setAttribute("class", "modal__body-message");
    message.innerHTML = `¿Seguro que quieres eliminar el producto ${product.name}?`;

    const message2 = document.createElement("span");
    message2.setAttribute(
      "aria-label",
      "Texto de advertencia del modal de confirmación de eliminar producto",
    );
    message2.setAttribute("class", "modal__body-message-alert");
    message2.innerHTML = `Esta acción no se puede deshacer.`;

    const divModalButtons = document.createElement("div");
    divModalButtons.setAttribute(
      "aria-label",
      "Botones del modal de confirmación de eliminar producto",
    );
    divModalButtons.setAttribute("class", "modal__body-buttons");

    const buttonRemove = document.createElement("button");
    buttonRemove.setAttribute("aria-label", "Botón para eliminar el producto");
    buttonRemove.setAttribute("class", "modal__body-buttons-ok");
    buttonRemove.innerHTML = "Eliminar";
    buttonRemove.onclick = () => {
      callRemove(product);
      modalConfirmation.remove();
    };

    const buttonCancel = document.createElement("button");
    buttonCancel.setAttribute(
      "aria-label",
      "Botón para cancelar la eliminación del producto",
    );
    buttonCancel.setAttribute("class", "modal__body-buttons-cancel");
    buttonCancel.innerHTML = "Cancelar";
    buttonCancel.onclick = () => {
      modalConfirmation.remove();
    };

    divModalButtons.append(buttonRemove, buttonCancel);
    bodyModalConfirmation.append(message, message2, divModalButtons);
    modalConfirmation.append(bodyModalConfirmation);
    document.body.append(modalConfirmation);
  };

  divModalProduct.append(bodyModal);
  document.body.append(divModalProduct);
};

/*
 * Muestra un mensaje tipo toast con la información indicada
 * @param {string} message mensaje a mostrar
 * @param {string} type tipo de toast ["success", "error"]
 */
export const ShowToast = (message, type) => {
  const toast = document.createElement("div");
  toast.setAttribute("class", "toast");
  toast.setAttribute("type", type);
  toast.innerHTML = message;

  setTimeout(() => {
    toast.remove();
  }, 6000);

  document.body.append(toast);
};
