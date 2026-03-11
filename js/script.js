const SUPABASE_URL = "https://ihxewxqyplbfedxkxrsu.supabase.co"
const SUPABASE_KEY = "sb_publishable_pgMFqgfZMVITkTQWM5i-1A_C-JB9xI_"

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

const gallery = document.getElementById("gallery")
const messages = document.getElementById("messages")


/* =========================
   UPLOAD IMAGE
========================= */

window.uploadImage = async function(){

let file = document.getElementById("uploadImage").files[0]

if(!file){
alert("Chọn ảnh trước")
return
}

let fileName = Date.now() + "_" + file.name

const { data, error } = await client.storage
.from("images")
.upload(fileName, file)

if(error){
console.error("Upload error:", error)
alert("Upload lỗi")
return
}

const { data: urlData } = client.storage
.from("images")
.getPublicUrl(fileName)

let imageUrl = urlData.publicUrl


const { error: dbError } = await client
.from("gallery")
.insert([{ image: imageUrl, likes: 0 }])

if(dbError){
console.error("DB error:", dbError)
alert("Lỗi lưu database")
return
}

loadGallery()

}



/* =========================
   LOAD GALLERY
========================= */

async function loadGallery(){

gallery.innerHTML = ""

const { data, error } = await client
.from("gallery")
.select("*")
.order("id",{ascending:false})

if(error){
console.error(error)
return
}

data.forEach(item=>{

let card = document.createElement("div")
card.className="card"

card.innerHTML=`
<img src="${item.image}" onclick="openImage('${item.image}')">
<div class="heart">❤️ ${item.likes}</div>
`
`

gallery.appendChild(card)

})

}

loadGallery()



/* =========================
   SEND MESSAGE
========================= */

window.sendMessage = async function(){

let name = document.getElementById("nameInput").value || "Guest"
let text = document.getElementById("textInput").value

if(!text) return

const { error } = await client
.from("chat")
.insert([{ name:name, text:text }])

if(error){
console.error(error)
return
}

document.getElementById("textInput").value=""

loadChat()

}



/* =========================
   LOAD CHAT
========================= */

async function loadChat(){

messages.innerHTML=""

const { data, error } = await client
.from("chat")
.select("*")
.order("id",{ascending:false})

if(error){
console.error(error)
return
}

data.forEach(msg=>{

let div=document.createElement("div")
div.className="msg"

div.innerHTML=`
<b>${msg.name}</b><br>
${msg.text}
`

messages.appendChild(div)

})

}

loadChat()


window.openImage = function(url){

const modal = document.getElementById("imageModal")
const modalImg = document.getElementById("modalImg")

modal.style.display = "flex"
modalImg.src = url

}

document.getElementById("imageModal").onclick = function(){
this.style.display = "none"
}
.modal{
display:none;
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.9);
justify-content:center;
align-items:center;
z-index:999;
}

.modal img{
max-width:90%;
max-height:90%;
border-radius:10px;
}
