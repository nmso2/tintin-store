const loadProducts = () => {
  const url = `https://fakestoreapi.com/products`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => showProducts(data));
  // const url = `https://raw.githubusercontent.com/ProgrammingHero1/ranga-store-api/main/ranga-api.json?fbclid=IwAR0aCrmtdlL08-9XMNibiIabxu7JCWC31XlXNPFzg_N9OzWN5F3Il37Mmc0`;
  // fetch(url)
  //   .then((response) => response.json())
  //   .then((data) => showProducts(data));
};
loadProducts();

// show all product in UI 
const showProducts = (products) => {
  document.getElementById('search-error').style.display = 'none';
  const allProducts = products.map((pd) => pd);
  for (const product of allProducts) {
    const image = product.image;
    const div = document.createElement("div");
    div.classList.add("col");
    div.innerHTML = `<div class="single-product">
      <div>
    <img class="product-image" src=${image}></img>
      </div>
      <h3>${product.title}</h3>
      <p>Category: ${product.category}</p>
      <h2>Price: $ ${product.price}</h2>
      <p><i class="fas fa-star orange"></i> ${product.rating.rate} (${product.rating.count})</p>
      <div class="buttons">
      <button onclick="addToCart(${product.id},${product.price})" class="btn btn-warning addToCart-btn">Add to cart</button>
      <button class="details-btn" onclick="showModal(${product.id})">Details</button></div>
      </div>
      `;
    document.getElementById("all-products").appendChild(div);

  }
};


//----------show modal--------//
const showModal = (id) => {
  console.log(id)
  const url = `https://fakestoreapi.com/products/${id}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => modalHtml(data));
};

const modalHtml = (data) => {
  document.getElementById('modalId').innerHTML = `<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
aria-labelledby="staticBackdropLabel" aria-hidden="true">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title" id="staticBackdropLabel">${data.title}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <div class="text-center">
        <img class="product-image img-fluid" src=${data.image}></img>
      </div>
      ${data.description}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button onclick="addToCart(${data.id},${data.price})" class="btn btn-warning addToCart-btn" data-bs-dismiss="modal">Add to cart</button>
    </div>
  </div>
</div>
</div>`;
  var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
  myModal.show();
}

//-----------add to cart---------//
let count = 0;
const addToCart = (id, price) => {
  count = count + 1;
  updatePrice("price", price);

  updateTaxAndCharge();
  updateTotal();
  document.getElementById("total-Products").innerText = count;
};


const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = value.toFixed(2);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  if (priceConverted > 200) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", priceConverted * 0.2);
  }
  if (priceConverted > 400) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", priceConverted * 0.3);
  }
  if (priceConverted > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", priceConverted * 0.4);
  }
};

//grandTotal update function
const updateTotal = () => {
  const grandTotal =
    getInputValue("price") + getInputValue("delivery-charge") +
    getInputValue("total-tax");
  document.getElementById("total").innerText = grandTotal.toFixed(2);
};

//............search product........

const searchProducts = () => {
  const searchInput = document.getElementById('input-field').value;
  document.getElementById('spinner').classList.remove("visually-hidden");
  document.getElementById("all-products").textContent = '';
  document.getElementById('search-error').style.display = 'none';
  document.getElementById('empty-search-error').style.display = 'none';
  if (searchInput==='') {
    document.getElementById('empty-search-error').style.display = 'block';
    document.getElementById('spinner').classList.add("visually-hidden");
    return
  }
  const searchBtn = document.getElementById('search-btn');
  const url = `https://fakestoreapi.com/products`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {

      
      const searchProduct = [];
      for (const product of data) {
        if (product.title.toLowerCase().includes(searchInput.toLowerCase())) {
          searchProduct.push(product);
          document.getElementById("all-products").textContent = '';
          document.getElementById('spinner').classList.add("visually-hidden");
          showProducts(searchProduct);
        }
        else {
          document.getElementById("all-products").textContent = '';
          document.getElementById('spinner').classList.add("visually-hidden");
          document.getElementById('search-error').style.display = 'block';
          document.getElementById('empty-search-error').style.display = 'none';
        }
      }
      document.getElementById('input-field').value = '';
    });
}