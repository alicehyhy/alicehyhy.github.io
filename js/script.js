<script type="module">

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import { getDatabase, ref, push, onChildAdded } 
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

import { getStorage, ref as sRef, uploadBytes, getDownloadURL }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyB-jTOaLN-akLBAmuMrj724bRG4boYw1E4",
  authDomain: "alicehyhy-gallery.firebaseapp.com",
  projectId: "alicehyhy-gallery",
  storageBucket: "alicehyhy-gallery.firebasestorage.app",
  messagingSenderId: "204662302298",
  appId: "1:204662302298:web:5ca9bf9b83c5efa7fe5a63",
  measurementId: "G-379T855NXV"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const storage = getStorage(app);



/* UPLOAD IMAGE */

window.uploadImage = async function(){

let file=document.getElementById("uploadImage").files[0]

if(!file) return

let storageRef = sRef(storage,"images/"+file.name)

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

</script>
