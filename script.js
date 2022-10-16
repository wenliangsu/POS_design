// 3.變數宣告
const menu = document.getElementById("menu");
const cart = document.getElementById("cart");
const totalAmount = document.getElementById("total-amount");
const cartButton = document.getElementById("cart-button");
const orderListButton = document.getElementById("");

let productData = [];
let cartItems = [];
let total = 0;

// 4.GET API 菜單產品資料
axios
  .get("https://ac-w3-dom-pos.firebaseio.com/products.json")
  .then(function (res) {
    productData = res.data;
    displayProduct(productData);
  })
  .catch();

// 5.將產品資料加入菜單區塊
displayProduct(productData);

function displayProduct(products) {
  products.forEach(
    (product) =>
      (menu.innerHTML += `
    <div class="col-3">
       <div class="card">
          <img src=${product.imgUrl} class="card-img-top" alt="..." data-id="${product.id}">
          <div class="card-body" data-id="${product.id}">
            <h5 class="card-title" data-id="${product.id}">${product.name}</h5>
            <p class="card-text" data-id="${product.id}">${product.price}</p>
            <a href="#" class="btn btn-primary" data-id="${product.id}">加入購物車</a>
          </div>
        </div>
      </div>
  `)
  );
}

// 6.加入購物車
function addToCart(event) {
  // 找到觸發event的node元素，並得到其產品id
  // console.log(event);
  const id = event.target.dataset.id;
  // console.log(id)
  // console.log(productData)
  // 在productData的資料裡，找到點擊的產品資訊，加入 cartItems
  const addedProduct = productData.find((product) => product.id === id);
  const name = addedProduct.name;
  const price = addedProduct.price;
  // 加入購物車變數cartItems 分：有按過、沒按過
  const targetItem = cartItems.find((item) => item.id === id);

  if (targetItem) {
    targetItem.quantity += 1;
    //沒按過
  } else {
    cartItems.push({
      id: id,
      name: name,
      price: price,
      quantity: 1,
    });
  }
  displayCart(cartItems);
  totalPrice(price);
}
// 畫面顯示購物車清單
//thinking 在送出訂單後會造成每行間距過大，有可能是多了font awesome 的+-以及trash圖形所導致的，因此要在送出訂單那部分，將其清單轉成單獨字串
function displayCart(cartItems) {
  cart.innerHTML = cartItems
    .map(
      (item) => `
      <li class="list-group-item" data-id="${item.id}">
        <h class="item-detail">${item.name} X ${item.quantity} 小計：${
        item.price * item.quantity
      }</h>
            
        <div class="list-button">
         <i class="fa-regular fa-square-plus fa-xl add-item"></i>
         <i class="fa-regular fa-square-minus fa-xl minus-item"></i>
         <i class="fa-solid fa-trash fa-xl remove-item"></i>
        </div>
      </li>
  `
    )
    .join("");
}

//購物車品項個別增減
function addOrRemoveOrder(event) {
  const target = event.target;
  const targetId = target.parentElement.parentElement.dataset.id;
  // console.log(targetId)
  const modifiedItem = cartItems.find((item) => item.id === targetId);
  let modifiedPrice = modifiedItem.price;

  console.log(cartItems.indexOf(modifiedItem));

  if (target.matches(".add-item")) {
    //物品增加1個
    modifiedItem.quantity += 1;
    totalPrice(modifiedPrice);
  } else if (target.matches(".minus-item")) {
    // 物品減少1個
    modifiedItem.quantity -= 1;
    totalPrice(-modifiedPrice);
    if (modifiedItem.quantity <= 0) {
      cartItems.splice(cartItems.indexOf(modifiedItem), 1);
    }
  } else {
    //整個物品丟棄
    modifiedPrice = modifiedItem.price * modifiedItem.quantity;
    totalPrice(-modifiedPrice);
    cartItems.splice(cartItems.indexOf(modifiedItem), 1);
  }

  displayCart(cartItems);
}

// 7.計算總金額
function totalPrice(price) {
  total += price;
  totalAmount.textContent = total;
}
// 8.送出訂單
function submitOrClean(event) {
  const id = event.target.id;
  // console.log(id);
  if (id === "submit-button") {
    if (total === 0) {
      alert("請選購產品");
    } else {
      //send the order
      //thinking 送出後每行間距過大，所以多增加為將清單變成字串後顯現
      const cartList = cartItems
        .map(
          (item) =>
            `${item.name} X ${item.quantity}  小計：${
              item.quantity * item.price
            }`
        )
        .join("\n");
      alert(`感謝購買：\n${cartList}\n總金額為：${totalAmount.textContent}`);
      reset();
    }
  } else {
    reset();
  }
}

// 9.重置資料
function reset() {
  cartItems = [];
  total = 0;
  totalAmount.textContent = "0";
  displayCart(cartItems);
}

// 10. 加入事件監聽
// 將商品加入購物車
menu.addEventListener("click", addToCart);

// 送出訂單或清空購物車
cartButton.addEventListener("click", submitOrClean);

//購物車內品項增加或是移除
cart.addEventListener("click", addOrRemoveOrder);
