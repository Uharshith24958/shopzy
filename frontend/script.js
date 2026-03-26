// ==========================
// API URLs
// ==========================

const API_PRODUCTS = "http://localhost:3000/products";
const API_CART = "http://localhost:3000/cart";
const API_REVIEWS = "http://localhost:3000/reviews";


// ==========================
// LOAD PRODUCTS
// ==========================

async function loadProducts(){

const res = await fetch(API_PRODUCTS);
const products = await res.json();

const container = document.getElementById("productList");

if(!container) return;

container.innerHTML="";

products.forEach(p=>{

container.innerHTML += `
<div class="product">

<img src="${p.image}" alt="${p.name}">

<h3>${p.name}</h3>

<p>₹${p.price}</p>

<button onclick="addToCart(${p.id},'${p.name}',${p.price},'${p.image}')">
Add to Cart
</button>

</div>
`;

});

}


// ==========================
// TRENDING PRODUCTS
// ==========================

async function loadTrendingProducts(){

const res = await fetch(API_PRODUCTS);
const products = await res.json();

const container = document.getElementById("trendingProducts");

if(!container) return;

container.innerHTML="";

products.slice(0,4).forEach(p=>{

container.innerHTML += `
<div class="product">

<img src="${p.image}" alt="${p.name}">

<h3>${p.name}</h3>

<p>₹${p.price}</p>

<button onclick="addToCart(${p.id},'${p.name}',${p.price},'${p.image}')">
Add to Cart
</button>

</div>
`;

});

}


// ==========================
// SEARCH PRODUCTS
// ==========================

function searchProducts(){

const input = document.getElementById("searchInput").value.toLowerCase();

const products = document.querySelectorAll(".product");

products.forEach(product=>{

const name = product.querySelector("h3").innerText.toLowerCase();

if(name.includes(input)){
product.style.display="block";
}
else{
product.style.display="none";
}

});

}


// ==========================
// ADD TO CART
// ==========================

async function addToCart(id,name,price,image){

await fetch(API_CART,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
product_id:id,
product_name:name,
price:price,
quantity:1,
image:image,
user_id:1
})
});

alert("Added to cart");

}


// ==========================
// LOAD CART
// ==========================

async function loadCart(){

const res = await fetch(API_CART);
const cart = await res.json();

const container = document.getElementById("cartItems");

if(!container) return;

container.innerHTML="";

cart.forEach(item=>{

container.innerHTML+=`

<div class="cart-item">

<img src="${item.image}">

<div>

<h3>${item.product_name}</h3>

<p>₹${item.price}</p>

<p>Qty: ${item.quantity}</p>

<button onclick="removeItem(${item.id})">Remove</button>

</div>

</div>

`;

});

}


// ==========================
// REMOVE CART ITEM
// ==========================

async function removeItem(id){

await fetch(API_CART + "/" + id,{
method:"DELETE"
});

loadCart();

}


// ==========================
// BUY NOW FUNCTION (✅ ADDED)
// ==========================

function buyNow(){

// Popup message
alert("🎉 Order placed successfully!");

// Clear cart (optional but useful)
fetch(API_CART)
.then(res => res.json())
.then(cartItems => {
cartItems.forEach(item => {
fetch(API_CART + "/" + item.id, {
method: "DELETE"
});
});
});

// Redirect to order placed page
window.location.href = "orderplaced.html";

}


// ==========================
// REVIEWS SYSTEM
// ==========================


// LOAD REVIEWS
async function loadReviews(){

const res = await fetch(API_REVIEWS);
const reviews = await res.json();

const container = document.getElementById("reviewsContainer");

if(!container) return;

container.innerHTML="";

reviews.forEach(r=>{

const stars = "⭐".repeat(r.rating);

container.innerHTML += `

<div class="review-card">

<h4>${r.name} ${stars}</h4>

<p>${r.comment}</p>

</div>

`;

});

}


// SUBMIT REVIEW
async function submitReview(){

const name = document.getElementById("reviewName").value;
const rating = document.getElementById("reviewRating").value;
const comment = document.getElementById("reviewComment").value;

if(!name || !comment){
alert("Please fill all fields");
return;
}

await fetch(API_REVIEWS,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:name,
rating:rating,
comment:comment
})
});

alert("Review submitted!");

document.getElementById("reviewName").value="";
document.getElementById("reviewComment").value="";

loadReviews();

}


// ==========================
// LOGOUT
// ==========================

function logout(){

localStorage.removeItem("username");

location.reload();

}


// ==========================
// PAGE LOAD
// ==========================

loadProducts();
loadTrendingProducts();
loadCart();
loadReviews();