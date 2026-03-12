/* =====================================
   FinEdu AI Assistant
===================================== */


/* ===============================
   DOM ELEMENTS
=============================== */

const chatMessages = document.getElementById("chatMessages")
const welcomeScreen = document.getElementById("welcomeScreen")
const suggestionCards = document.getElementById("suggestionCards")

const chatForm = document.getElementById("chatForm")
const chatInput = document.getElementById("chatInput")
const sendBtn = document.querySelector(".send-btn")


/* ===============================
   STATE
=============================== */

let isSending = false

const BASE_API_URL = (
  window.BASE_API_URL
  || window.__ENV__?.BASE_API_URL
  || ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : "https://finedu-api.onrender.com")
).replace(/\/$/, "")


/* ===============================
   INIT
=============================== */

document.addEventListener("DOMContentLoaded", () => {

  setupEvents()

})


/* ===============================
   EVENT LISTENERS
=============================== */

function setupEvents(){

  /* form submit */
  chatForm?.addEventListener("submit", handleSubmit)

  /* input typing */
  chatInput?.addEventListener("input", handleInput)

  /* enter key */
  chatInput?.addEventListener("keydown",(e)=>{

if(e.key === "Enter" && !e.shiftKey){

e.preventDefault()

if(chatInput.value.trim().length > 0){

handleSubmit(e)

}

}

})

  /* suggestion cards */

  suggestionCards?.addEventListener("click",(e)=>{

    const card = e.target.closest(".suggestion-card")

    if(!card) return

    const prompt = card.dataset.prompt

    if(prompt){

      sendMessage(prompt)

    }

  })

}


/* ===============================
   INPUT HANDLING
=============================== */

function handleInput(){

autoResize()

const text = chatInput.value.trim()

sendBtn.disabled = text.length === 0

}

function autoResize(){

  chatInput.style.height = "auto"

  chatInput.style.height =
  Math.min(chatInput.scrollHeight,120)+"px"

}



/* ===============================
   SUBMIT
=============================== */

function handleSubmit(e){

  e.preventDefault()

  const message = chatInput.value.trim()

  if(!message || isSending) return

  sendMessage(message)

}



/* ===============================
   SEND MESSAGE
=============================== */

async function sendMessage(text){

  if(!text.trim() || isSending) return

  isSending = true

  sendBtn.disabled = true


  /* hide welcome */

  if(welcomeScreen){

   welcomeScreen.style.opacity = "0"

setTimeout(()=>{
welcomeScreen.style.display = "none"
},300)

  }


  /* add user message */

  addMessage("user",text)


  chatInput.value = ""

  autoResize()



  /* show loading */

  const loadingId = showLoading()



  try{

    const history = getHistory()


    const response = await fetch(`${BASE_API_URL}/api/assistant`,{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        message:text,
        history:history.slice(-10)

      })

    })


    const data = await response.json()


    removeLoading(loadingId)


    const reply =
      data.reply ||
      data.response ||
      "Sorry, I couldn't generate a response."


    addMessage("ai",reply)


    saveHistory("user",text)
    saveHistory("ai",reply)


  }catch(error){

    console.error(error)

    removeLoading(loadingId)

    addMessage("ai",
      "Connection issue. Please try again."
    )

  }


  isSending = false

  sendBtn.disabled = false

  chatInput.focus()

}



/* ===============================
   ADD MESSAGE
=============================== */

function addMessage(role,text){

  const message = document.createElement("div")

  message.className = `chat-message ${role}`


  if(role === "ai"){

    message.innerHTML = `

      <div class="message-avatar" aria-label="Assistant">
        •••
      </div>

      <div class="message-content">

        ${formatMessage(text)}

        <div class="message-actions">

          <button class="copy-btn">

            Copy

          </button>

        </div>

      </div>

    `

  }

  else{

    message.innerHTML = `

      <div class="message-content">

        ${formatMessage(text)}

      </div>

      <div class="message-avatar">You</div>

    `

  }


  chatMessages.appendChild(message)


  scrollToBottom()



  /* copy button */

  const copyBtn = message.querySelector(".copy-btn")

  if(copyBtn){

    copyBtn.addEventListener("click",()=>{

      navigator.clipboard.writeText(text)

      copyBtn.innerText = "Copied!"

      setTimeout(()=>{

        copyBtn.innerText = "Copy"

      },1500)

    })

  }

}



/* ===============================
   LOADING INDICATOR
=============================== */

function showLoading(){

  const id = "loading-"+Date.now()

  const loading = document.createElement("div")

  loading.id = id

  loading.className = "chat-message ai"

  loading.innerHTML = `

    <div class="message-avatar" aria-label="Assistant typing">
      •••
    </div>

    <div class="loading-dots" role="status" aria-live="polite" aria-label="Assistant is typing">

      <span></span>
      <span></span>
      <span></span>

    </div>

  `

  chatMessages.appendChild(loading)

  scrollToBottom()

  return id

}


function removeLoading(id){

  const el = document.getElementById(id)

  if(el) el.remove()

}



/* ===============================
   FORMAT MESSAGE
=============================== */

function formatMessage(text){

if(!text) return ""

let formatted = text

/* Escape HTML */
formatted = formatted
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")

/* HEADINGS */

formatted = formatted.replace(/^### (.*$)/gim,"<h4>$1</h4>")
formatted = formatted.replace(/^## (.*$)/gim,"<h3>$1</h3>")
formatted = formatted.replace(/^# (.*$)/gim,"<h2>$1</h2>")


/* BOLD */

formatted = formatted.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>")


/* ITALIC */

formatted = formatted.replace(/\*(.*?)\*/g,"<em>$1</em>")


/* BULLET LIST */

formatted = formatted.replace(/^\* (.*$)/gim,"<li>$1</li>")
formatted = formatted.replace(/^- (.*$)/gim,"<li>$1</li>")


/* NUMBERED LIST */

formatted = formatted.replace(/^\d+\. (.*$)/gim,"<li>$1</li>")


/* Wrap lists */

formatted = formatted.replace(/(<li>.*<\/li>)/gims,"<ul>$1</ul>")


/* PARAGRAPHS */

const lines = formatted.split("\n")

formatted = lines.map(line=>{

if(line.match(/^<h|<ul|<li/)) return line

if(line.trim()==="") return ""

return `<p>${line}</p>`

}).join("")


/* LINKS */

const urlRegex = /(https?:\/\/[^\s]+)/g

formatted = formatted.replace(urlRegex,'<a href="$1" target="_blank">$1</a>')

/* ===============================
   MARKDOWN TABLE SUPPORT
=============================== */

const tableRegex = /\|(.+)\|\n\|([-:\s|]+)\|\n((\|.+\|\n?)*)/g;

formatted = formatted.replace(tableRegex, function(match){

  const rows = match.trim().split("\n")

  const headers = rows[0].split("|").map(x=>x.trim()).filter(Boolean)

  const bodyRows = rows.slice(2)

  let tableHTML = "<table class='ai-table'>"

  tableHTML += "<thead><tr>"

  headers.forEach(header=>{
    tableHTML += `<th>${header}</th>`
  })

  tableHTML += "</tr></thead><tbody>"

  bodyRows.forEach(row=>{

    const cols = row.split("|").map(x=>x.trim()).filter(Boolean)

    tableHTML += "<tr>"

    cols.forEach(col=>{
      tableHTML += `<td>${col}</td>`
    })

    tableHTML += "</tr>"

  })

  tableHTML += "</tbody></table>"

  return tableHTML

})
return formatted
}

/* ===============================
   SCROLL
=============================== */

function scrollToBottom(){

chatMessages.scrollTo({
top:chatMessages.scrollHeight,
behavior:"smooth"
})

}



/* ===============================
   HISTORY
=============================== */

const HISTORY_KEY = "finedu_chat_history"


function getHistory(){

  try{

    const saved =
      localStorage.getItem(HISTORY_KEY)

    if(saved){

      return JSON.parse(saved)

    }

  }catch(e){

    console.warn("history error")

  }

  return []

}



function saveHistory(role,text){

  try{

    let history = getHistory()

    history.push({role,text})

    if(history.length > 20){

      history = history.slice(-20)

    }

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history)
    )

  }catch(e){

    console.warn("save error")

  }

}