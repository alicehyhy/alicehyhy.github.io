const SUPABASE_URL = "https://ihxewxqyplbfedxkxrsu.supabase.co"
const SUPABASE_KEY = "sb_publishable_pgMFqgfZMVITkTQWM5i-1A_C-JB9xI_"

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

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

const { data, error } = await supabase.storage
.from("images")
.upload(fileName, file)

if(error){
console.error(error)
alert("Upload lỗi")
return
}

const { data: urlData } = supabase.storage
.from("images")
.getPublicUrl(fileName)

let imageUrl = urlData.publicUrl


await supabase
.from("gallery")
.insert([{ image: imageUrl, likes: 0 }])

loadGallery()

}


/* =========================
   LOAD GALLERY
========================= */

async function loadGallery(){

gallery.innerHTML = ""

const { data } = await supabase
.from("gallery")
.select("*")
.order("id",{ascending:false})

data.forEach(item=>{

let card = document.createElement("div")
card.className="card"

card.innerHTML=`
<img src="${item.image}">
<div class="heart">❤️ ${item.likes}</div>
`

gallery.appendChild(card)

})

}

loadGallery()



/* =========================
   SEND MESSAGE
========================= */

window.sendMessage = async function(){

let name = document.getElementById("nameInput").value
let text = document.getElementById("textInput").value

if(!text) return

await supabase
.from("chat")
.insert([{ name:name, text:text }])

document.getElementById("textInput").value=""

loadChat()

}


/* =========================
   LOAD CHAT
========================= */

async function loadChat(){

messages.innerHTML=""

const { data } = await supabase
.from("chat")
.select("*")
.order("id",{ascending:false})

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
