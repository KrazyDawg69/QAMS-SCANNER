// ========== FIREBASE CONFIG ==========
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9_SnkZwUKhTxWPw0xH5q6RjLSPTWjJDw",
  authDomain: "qams-2025.firebaseapp.com",
  projectId: "qams-2025",
  storageBucket: "qams-2025.firebasestorage.app",
  messagingSenderId: "827453407305",
  appId: "1:827453407305:web:c1eba2c58cb57b85d9ff98"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========== MAKE ALL FUNCTIONS GLOBAL ==========
window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.serverTimestamp = serverTimestamp;

// ========== PAGE NAVIGATION ==========
window.goPage = function(pageNumber) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const nextPage = document.getElementById("page" + pageNumber);
  if (nextPage) {
    nextPage.classList.add("active");
  }
}

// ========== PHOTOS ARRAY ==========
const photos = [
  "/IMAGES/f627057a-67a9-4553-af2e-6fd5d35cc91b.jpeg",
  "/IMAGES/9787b17e-89f2-4533-9bc4-88ebd4620316.jpeg",
  "/IMAGES/0ec2d0ae-3884-4909-80b3-4458a09eaecd.jpeg",
  "/IMAGES/fe652c68-e10d-4314-9908-ad3a35bb352f.jpeg"
];

let photoIndex = 0;

// ========== NEXT BUTTON ==========
window.next = function() {
  const activePage = document.querySelector(".page.active");
  if (!activePage) return;

  const img = activePage.querySelector("img");
  if (!img) return;

  img.style.transition = "opacity 0.4s ease";
  img.style.opacity = 0;

  setTimeout(() => {
    photoIndex = (photoIndex + 1) % photos.length;
    img.src = photos[photoIndex];
    img.style.opacity = 1;
  }, 400);
}

// ========== SAVE DATE DETAILS ==========
window.saveDateDetails = async function() {
  console.log("💾 Saving date details...");
  
  try {
    // Get values using IDs
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const whoInput = document.getElementById('whoInput');
    const whereInput = document.getElementById('whereInput');
    
    // Check if elements exist
    if (!dateInput || !timeInput || !whoInput || !whereInput) {
      console.error("Input elements not found!");
      alert("Input fields not found!");
      window.goPage(5);
      return false;
    }
    
    const dateDetails = {
      date: dateInput.value || 'Not set',
      time: timeInput.value || 'Not set',
      who: whoInput.value || 'You & Me',
      location: whereInput.value || 'Not set',
      timestamp: serverTimestamp(),
      page: "page4"
    };
    
    console.log("📝 Date details:", dateDetails);
    
    // Save to Firebase
    const docRef = await addDoc(collection(db, "datePlans"), dateDetails);
    console.log("✅ SAVED! Document ID:", docRef.id);
    alert("NOTED Abigel! See you on " + (dateDetails.date || "our date") + " 💕");
    
    // Proceed to next page
    window.goPage(5);
    return true;
    
  } catch (error) {
    console.error("❌ ERROR:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    alert("NOTED PUU! 💕 (Error: " + error.code + ")");
    window.goPage(5);
    return false;
  }
}

// ========== TOGGLE LETTER ==========
window.toggleLetter = function() {
  const letter = document.querySelector('.letter');
  if (letter) {
    letter.classList.toggle('open');
  }
}

// ========== VALENTINE MESSAGE FUNCTION ==========
window.saveValentineMessage = async function(message) {
  try {
    const docRef = await addDoc(collection(db, "valentineMessages"), {
      message: message,
      timestamp: serverTimestamp(),
      page: "page6",
      from: "Valentine Website"
    });
    console.log("✅ Message saved with ID: ", docRef.id);
    alert("Thank you Abigel! Message saved 💕");
    return true;
  } catch (error) {
    console.error("❌ Error saving message: ", error);
    alert("Sorry, there was an error. But I still love you! 💕");
    return false;
  }
}

// ========== SETUP SUBMIT BUTTON ==========
window.setupSubmitButton = function() {
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.onclick = async function() {
      const messageInput = document.getElementById('messageInput');
      const message = messageInput.value.trim();
      
      if (message) {
        await window.saveValentineMessage(message);
        messageInput.value = '';
      } else {
        alert("Write a message (optional) 💕");
      }
    }
  }
}

// ========== TEST FUNCTION ==========


// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
  window.setupSubmitButton();
  console.log("✅ Valentine app loaded!");
  console.log("🔍 Firebase DB:", db);
  
  // Auto-run test
  setTimeout(() => window.testFirebase(), 1000);
});