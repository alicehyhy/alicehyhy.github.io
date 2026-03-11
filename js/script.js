let gallery=document.getElementById("gallery")
let messages=document.getElementById("messages")
let nameInput=document.getElementById("nameInput")
let textInput=document.getElementById("textInput")
let chatImage=document.getElementById("chatImage")

function uploadImage(){

let file=document.getElementById("uploadImage").files[0]
if(!file) return

let reader=new FileReader()

reader.onload=function(e){

let card=document.createElement("div")
card.className="card"

card.innerHTML=`
<div class="heart" onclick="likeImage(this)">❤️</div>
<img src="${e.target.result}" onclick="openImage(this)">
<div class="comment-box">
<input class="comment-input">
<button onclick="addComment(this)">💬</button>
<div class="comments"></div>
</div>
`

gallery.prepend(card)

saveGallery()

}

reader.readAsDataURL(file)

}

function addComment(btn){

let box=btn.parentElement
let input=box.querySelector(".comment-input")
let list=box.querySelector(".comments")

if(input.value==="") return

let p=document.createElement("p")
p.textContent="💬 "+input.value
list.appendChild(p)

input.value=""

saveGallery()

}

function likeImage(el){

el.innerHTML=el.innerHTML==="❤️"?"💖":"❤️"

}

function openImage(img){

let modal=document.getElementById("imageModal")
let modalImg=document.getElementById("modalImg")

modal.style.display="flex"
modalImg.src=img.src

}

document.getElementById("imageModal").onclick=()=>imageModal.style.display="none"

document.getElementById("textInput").addEventListener("keydown",e=>{
if(e.key==="Enter"&&!e.shiftKey){
e.preventDefault()
sendMessage()
}
})

function addEmoji(){

let emojis=["😀","😂","😍","🥰","🔥","❤️"]
let e=emojis[Math.floor(Math.random()*emojis.length)]

textInput.value+=e

}

function sendMessage(){

let name=nameInput.value||"Guest"
let text=textInput.value
let img=chatImage.files[0]

if(!text && !img) return

let time=new Date().toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
})

let reader=new FileReader()

reader.onload=function(e){

let msg={
name:name,
text:text,
img:e.target.result,
time:time
}

saveMessage(msg)
addMessage(msg)

}

if(img) reader.readAsDataURL(img)
else{

let msg={name,text,img:null,time}
saveMessage(msg)
addMessage(msg)

}

textInput.value=""
chatImage.value=""

}

function addMessage(msg){

messages.innerHTML+=`
<div class="message">

<div class="avatar">${msg.name[0]}</div>

<div>
<b>${msg.name}</b> ${msg.time}
<div>${msg.text||""}</div>
${msg.img?`<img src="${msg.img}" class="msg-image">`:""}
<div class="react" onclick="react(this)">❤️</div>
</div>

</div>
`

}

function react(el){

el.innerHTML=el.innerHTML==="❤️"?"💖":"❤️"

}

function saveMessage(msg){

let chat=JSON.parse(localStorage.getItem("chat")||"[]")
chat.push(msg)
localStorage.setItem("chat",JSON.stringify(chat))

}

function loadChat(){

let chat=JSON.parse(localStorage.getItem("chat")||"[]")
chat.forEach(addMessage)

}

function clearChat(){

if(confirm("Xoá toàn bộ chat?")){
localStorage.removeItem("chat")
messages.innerHTML=""
}

}

function saveGallery(){

localStorage.setItem("gallery",gallery.innerHTML)

}

function loadGallery(){

let data=localStorage.getItem("gallery")
if(data) gallery.innerHTML=data

}

loadChat()
loadGallery()
