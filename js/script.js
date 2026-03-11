<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import { getDatabase, ref, push, onChildAdded } 
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

import { getStorage, ref as sRef, uploadBytes, getDownloadURL }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "alicehyhy-gallery.firebaseapp.com",
  projectId: "alicehyhy-gallery",
  storageBucket: "alicehyhy-gallery.firebasestorage.app",
  messagingSenderId: "204662302298",
  appId: "1:204662302298:web:5ca9bf9b83c5efa7fe5a63"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

const gallery = document.getElementById("gallery")
const messages = document.getElementById("messages")



/* UPLOAD IMAGE */

window.uploadImage = async function(){

let file=document.getElementById("uploadImage").files[0]

if(!file) return

let storageRef = sRef(storage,"images/"+Date.now()+file.name)

await uploadBytes(storageRef,file)

let url = await getDownloadURL(storageRef)

push(ref(db,"gallery"),{
image:url,
likes:0
})

}



/* LOAD GALLERY REALTIME */

onChildAdded(ref(db,"gallery"),(snap)=>{

let data=snap.val()

let card=document.createElement("div")
card.className="card"

card.innerHTML=`
<img src="${data.image}">
<div class="heart">❤️ ${data.likes}</div>
`

gallery.prepend(card)

})



/* SEND MESSAGE */

window.sendMessage=function(){

let name=document.getElementById("nameInput").value
let text=document.getElementById("textInput").value

push(ref(db,"chat"),{
name:name,
text:text
})

document.getElementById("textInput").value=""

}



/* LOAD CHAT REALTIME */

onChildAdded(ref(db,"chat"),(snap)=>{

let data=snap.val()

let msg=document.createElement("div")
msg.className="msg"

msg.innerHTML=`
<b>${data.name}</b><br>
${data.text}
`

messages.prepend(msg)

})

</script>
