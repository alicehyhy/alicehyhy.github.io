const supabaseClient = supabase.createClient(
"https://ihxewxqyplbfedxkxrsu.supabase.co",
"sb_publishable_pgMFqgfZMVITkTQWM5i-1A_C-JB9xI_"
)

const gallery = document.getElementById("gallery")
const messages = document.getElementById("messages")


/* UPLOAD IMAGE */

window.uploadImage = async function(){

let file=document.getElementById("uploadImage").files[0]
if(!file) return

let fileName=Date.now()+"_"+file.name

// upload lên storage
await supabaseClient.storage
.from("images")
.upload(fileName,file)

// lấy link ảnh
let {data} = supabaseClient.storage
.from("images")
.getPublicUrl(fileName)

let url=data.publicUrl

// lưu database
await supabaseClient
.from("gallery")
.insert([{image:url,likes:0}])

loadGallery()

}



/* LOAD GALLERY */

async function loadGallery(){

let {data} = await supabaseClient
.from("gallery")
.select("*")
.order("id",{ascending:false})

gallery.innerHTML=""

data.forEach(img=>{

gallery.innerHTML+=`
<div class="card">
<img src="${img.image}">
<div class="heart">❤️ ${img.likes}</div>
</div>
`

})

}



/* SEND MESSAGE */

window.sendMessage = async function(){

let name=document.getElementById("nameInput").value || "Guest"
let text=document.getElementById("textInput").value

if(!text) return

await supabaseClient
.from("chat")
.insert([{name:name,text:text}])

document.getElementById("textInput").value=""

loadChat()

}



/* LOAD CHAT */

async function loadChat(){

let {data} = await supabaseClient
.from("chat")
.select("*")
.order("id",{ascending:false})

messages.innerHTML=""

data.forEach(msg=>{

messages.innerHTML+=`
<div class="msg">
<b>${msg.name}</b><br>
${msg.text}
</div>
`

})

}



loadGallery()
loadChat()

setInterval(loadChat,2000)
