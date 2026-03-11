const SUPABASE_URL="https://ihxewxqyplbfedxkxrsu.supabase.co"
const SUPABASE_KEY="sb_publishable_pgMFqgfZMVITkTQWM5i-1A_C-JB9xI_"

const client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY)

const gallery=document.getElementById("gallery")
const messages=document.getElementById("messages")

let currentUser=null
let currentRole="member"

/* UPLOAD IMAGE */

window.uploadImage=async function(){

let file=document.getElementById("uploadImage").files[0]

if(!file){
alert("Chọn ảnh trước")
return
}

let fileName=Date.now()+"_"+file.name

const {error}=await client.storage
.from("images")
.upload(fileName,file)

if(error){
alert("Upload lỗi")
console.log(error)
return
}

const {data:urlData}=client.storage
.from("images")
.getPublicUrl(fileName)

let imageUrl=urlData.publicUrl

await client
.from("gallery")
.insert([{image:imageUrl,likes:0}])

loadGallery()

}

/* LOAD GALLERY */

async function loadGallery(){

gallery.innerHTML=""

const {data,error}=await client
.from("gallery")
.select("*")
.order("id",{ascending:false})

if(error){
console.log(error)
return
}

data.forEach(item=>{

let card=document.createElement("div")
card.className="card"

card.innerHTML=`<img src="${item.image}">`

let img=card.querySelector("img")

img.onclick=()=>{

let modal=document.getElementById("imageModal")
let modalImg=document.getElementById("modalImg")

modalImg.src=item.image
modal.classList.add("show")

}

card.addEventListener("mousemove",e=>{

const rect=card.getBoundingClientRect()

const x=e.clientX-rect.left
const y=e.clientY-rect.top

const centerX=rect.width/2
const centerY=rect.height/2

const rotateX=(y-centerY)/15
const rotateY=(centerX-x)/15

img.style.transform=
`scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

})

card.addEventListener("mouseleave",()=>{
img.style.transform="scale(1)"
})

gallery.appendChild(card)

})

}

loadGallery()

/* CLOSE IMAGE MODAL */

const modal=document.getElementById("imageModal")

modal.onclick=()=>{
modal.classList.remove("show")
}

/* SEND MESSAGE */

window.sendMessage=async function(){

if(!currentUser){

alert("Bạn phải đăng nhập để chat")
openSignup()
return

}

let text=document.getElementById("textInput").value

let file=document.getElementById("chatImage").files[0]

let imageUrl=null

/* upload image chat */

if(file){

let fileName="chat_"+Date.now()+"_"+file.name

await client.storage
.from("images")
.upload(fileName,file)

const {data:urlData}=client.storage
.from("images")
.getPublicUrl(fileName)

imageUrl=urlData.publicUrl

}

if(!text && !imageUrl) return

await client
.from("chat")
.insert([{
name:currentUser,
role:currentRole,
text:text,
image:imageUrl
}])

document.getElementById("textInput").value=""
document.getElementById("chatImage").value=""

loadChat()

}

/* LOAD CHAT */

async function loadChat(){

messages.innerHTML=""

const {data}=await client
.from("chat")
.select("*")
.order("id",{ascending:true})

data.forEach(msg=>{

let roleIcon=""

if(msg.role==="admin"){
roleIcon="👑"
}

let time=new Date(msg.created_at || Date.now())

let timestamp=time.getHours()+":"+String(time.getMinutes()).padStart(2,"0")

let div=document.createElement("div")
div.className="message"

div.innerHTML=`

<img src="images/avatar.jpg" class="chat-avatar">

<div class="chat-content">

<div class="chat-header-line">

<span class="chat-name ${msg.role}">
${msg.name}
</span>

<span class="role-icon">
${roleIcon}
</span>

<span class="chat-time">
${timestamp}
</span>

</div>

<div class="chat-text">
${msg.text || ""}
</div>

${msg.image ? `<img src="${msg.image}" class="chat-image">` : ""}

</div>

`

messages.appendChild(div)

/* animation */

div.style.opacity="0"
div.style.transform="translateY(10px)"

setTimeout(()=>{
div.style.transition="0.3s"
div.style.opacity="1"
div.style.transform="translateY(0)"
},50)

})

messages.scrollTop=messages.scrollHeight

}

loadChat()

/* SIGNUP MODAL */

function openSignup(){
document.getElementById("signupModal").classList.add("show")
}

function closeSignup(){
document.getElementById("signupModal").classList.remove("show")
}

/* REGISTER */

function register(){

let user=document.getElementById("user").value
let pass=document.getElementById("pass").value
let msg=document.getElementById("authMessage")
let box=document.getElementById("signupBox")

msg.className=""
msg.innerText=""

if(user=="" || pass==""){

msg.className="auth-error"
msg.innerText="Vui lòng nhập tài khoản và mật khẩu"
return

}

if(pass.length<4){

msg.className="auth-error"
msg.innerText="Mật khẩu phải ≥ 4 ký tự"

box.classList.add("shake")

setTimeout(()=>{
box.classList.remove("shake")
},300)

return
}

localStorage.setItem(user,pass)

msg.className="auth-success"
msg.innerText="Tạo tài khoản thành công"

}

/* LOGIN */

function login(){

let user=document.getElementById("user").value
let pass=document.getElementById("pass").value

let msg=document.getElementById("authMessage")
let box=document.getElementById("signupBox")

msg.className=""
msg.innerText=""

let savedPass=localStorage.getItem(user)

if(savedPass===pass){

currentUser=user

if(user==="thanh" || user==="thanh"){
currentRole="admin"
}else{
currentRole="member"
}

localStorage.setItem("chatUser",user)
localStorage.setItem("chatRole",currentRole)

msg.className="auth-success"
msg.innerText="Đăng nhập thành công"

document.getElementById("createBtn").style.display="none"
document.getElementById("userAvatar").style.display="block"
document.getElementById("logoutBtn").style.display="block"

setTimeout(()=>{
closeSignup()
},600)

}else{

msg.className="auth-error"
msg.innerText="Sai tài khoản hoặc mật khẩu"

box.classList.add("shake")

setTimeout(()=>{
box.classList.remove("shake")
},300)

}

}

/* CHAT TOGGLE */

function toggleChat(){

let chat=document.getElementById("chatBox")

if(chat.style.display==="flex"){
chat.style.display="none"
}else{
chat.style.display="flex"
}

}

/* AUTO LOGIN */

let savedUser=localStorage.getItem("chatUser")
let savedRole=localStorage.getItem("chatRole")

if(savedUser){

currentUser=savedUser
currentRole=savedRole

document.getElementById("userAvatar").style.display="block"
document.getElementById("logoutBtn").style.display="block"

}

/* LOGOUT */

function logout(){

localStorage.removeItem("chatUser")
localStorage.removeItem("chatRole")

location.reload()

}
