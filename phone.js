class Product {
    constructor(productId, productName, productPrice, productQuantity,) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.productMoney = productPrice * productQuantity;
    }
}
var products = [];
const key_data = "product_data";
var position = 0;
function renderProductList(data) {
    let htmls = data.map(function (product) {
        return `
                    <tr id="tr_${product.productId}">
                        <td>${product.productId}</td>
                        <td>${product.productName}</td>
                        <td>${currencyFormat(product.productPrice)}</td>
                        <td>${product.productQuantity}</td>
                        <td>${currencyFormat(product.productMoney)}</td>
                        <td id="td_btn_${product.productId}">
                            <button type="button" onclick="editProduct(${product.productId})"  class="btn">Chỉnh sửa</button>
                            <button type="button" onclick="removeProduct(${product.productId})"  class="btn remove">Xóa</button>
                            <button type="button" class="d-none btn green" onclick="updateProduct(${product.productId})"  >Update</button>
                            <button type="button" class="d-none btn remove" onclick="cancelProduct(${product.productId})">Cancel</button>
                        </td>
                    </tr>
    `
    })
    document.querySelector('#productTotal').innerHTML = currencyFormat(productTotal());
    document.querySelector(".table-product>tbody").innerHTML = htmls.join("");
}

function initProduct() {
    if (getData(key_data) == null) {
        products = [
            new Product(1, "Iphone6", 300000, 6),
            new Product(2, "Iphone7", 400000, 5),
            new Product(3, "Iphone8", 500000, 6),
            new Product(4, "IphoneXs", 700000, 9),
            new Product(5, "Iphone10", 600000, 11),
            new Product(6, "Iphone11", 800000, 12),
            new Product(7, "Iphone12", 900000, 14),
            new Product(8, "Iphone13", 1000000, 15),
            new Product(9, "IphoneXSmax", 1100000, 4)
        ]
        setData(key_data, products);
    }
    else {
        products = getData(key_data);
    }
}
function getData(key) {
    return JSON.parse(localStorage.getItem(key))
}
function setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}
function btnAdd() {
    document.querySelector('.form-add').classList.remove("add-none")
}
function btnEdit(id) {
    document.querySelector('.form-edit').classList.remove("edit-none")

}
function addProduct() {
    let name = document.querySelector('#addName').value;
    let pri = Number(document.querySelector('#addPrice').value);
    let qua = Number(document.querySelector('#addQuantity').value);
    let id = productSort() + 1;
    if (name.trim() !== '') {
        let product = new Product(id, name, pri, qua);
        products.push(product);
        setData(key_data, products);
        renderProductList(products);
        reset();
    } else {
        alert('Xin nhập tên vào tên sản phẩm')
    }

}
function productSort() {
    let product1 = [...products];
    let sort = product1.sort(function (pdt1, pdt2) {
        return pdt2.productId - pdt1.productId;
    })[0].productId;
    console.log(sort);
    return sort;
}

function reset() {
    document.querySelector("#addName").value = "";
    document.querySelector("#addPrice").value = "";
    document.querySelector("#addQuantity").value = "";
}
function editProduct(productId) {
    let tr = document.getElementById(`tr_${productId}`);
    let product = getIdProduct(productId);
    tr.children[1].innerHTML = `<input type="text" id="editName" class="input-edit" min="0" value="${product.productName}">`;
    tr.children[2].innerHTML = `<input type="number" id="editPrice" class="input-edit" min="0" value="${product.productPrice}">`;
    tr.children[3].innerHTML = `<input type="number" id="editQuantity" class="input-edit" min="0" value="${product.productQuantity}">`;
    let hidden = document.getElementById(`td_btn_${productId}`);
    hidden.children[0].classList.add('d-none');
    hidden.children[1].classList.add('d-none');
    hidden.children[2].classList.remove('d-none');
    hidden.children[3].classList.remove('d-none');
    // setData(key_data, products);
}
function cancelProduct(productId) {
    console.log(productId);
    let tr = document.getElementById(`tr_${productId}`);
    let product = getIdProduct(productId);
    tr.children[1].innerHTML = product.productName;
    tr.children[2].innerHTML = Number(product.productPrice);
    tr.children[3].innerHTML = Number(product.productQuantity);
    let hidden = document.getElementById(`td_btn_${productId}`);
    hidden.children[0].classList.remove('d-none');
    hidden.children[1].classList.remove('d-none');
    hidden.children[2].classList.add('d-none');
    hidden.children[3].classList.add('d-none');
    // renderProductList();
}
function updateProduct(productId) {
    let tr = document.getElementById(`tr_${productId}`);
    let product = getIdProduct(productId);
    let productName = tr.children[1].children[0].value;
    let productPrice = Number(tr.children[2].children[0].value);
    let productQuantity = Number(tr.children[3].children[0].value);
    product.productName = productName;
    product.productPrice = productPrice
    product.productQuantity = productQuantity;
    product.productMoney = Number(product.productPrice) * Number(product.productQuantity);
    setData(key_data, products);
    renderProductList(products);
}

function getIdProduct(productId) {
    let product = products.find(function (value) {
        return value.productId == productId;
    });
    return product;
}
function removeProduct(productId) {
    let index = 0;
    for (let i = 0; i < products.length; i++) {
        if (products[i].productId == productId) {
            index = i;
        }
    }
    let confirmed = window.confirm(`Bạn có chắc chắn muốn xóa ${products[index].productName} không?`);
    if (confirmed) {
        products.splice(index, 1);
        renderProductList(products);
    }
    setData(key_data, products);
}

function currencyFormat(number) {
    return number.toLocaleString("vi-vn", {
        style: "currency",
        currency: "VND",
    })
}
function productTotal() {
    let total = products.reduce(function (total, product) {
        return total + product.productMoney;
    }, 0)
    return total;
}
function productSearch() {
    let keywork = document.querySelector('#keyword').value;
    let result = products.filter(function (product) {
        return product.productName.toLowerCase().indexOf(keywork.toLowerCase()) != -1;
    })
    renderProductList(result);
}

initProduct();
renderProductList(products);