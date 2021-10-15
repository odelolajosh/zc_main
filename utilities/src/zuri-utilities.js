import axios from "axios"
import Centrifuge from "centrifuge"

let currentWorkspace = localStorage.getItem("currentWorkspace")
let token = sessionStorage.getItem("token")

export const GetUserInfo = async () => {
  let user = JSON.parse(sessionStorage.getItem("user"))
  let token = sessionStorage.getItem("token")

  if ((user && token) !== null) {
    try {
      const response = await axios.get(
        `https://api.zuri.chat/organizations/${currentWorkspace}/members/?query=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      let userData = { currentWorkspace, token, ...response.data.data[0] }
      // console.log('getuserinfo', response.data.data[0])
      // console.log(userData)
      return userData
    } catch (err) {
      console.error(err)
    }
  } else {
    console.warn("YOU ARE NOT LOGGED IN, PLEASE LOG IN")
  }
}

export const GetWorkspaceUser = async identifier => {
  if (!identifier) return new Error("No workspace user identifier provided")

  // User identifier should be email address
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!identifier.match(emailRegex))
    throw Error("Workspace user identifier must be a valid email address.")

  let user = JSON.parse(sessionStorage.getItem("user"))
  const currentWorkspace = localStorage.getItem("currentWorkspace")
  const token = sessionStorage.getItem("token")

  try {
    const response = await axios.get(
      `https://api.zuri.chat/organizations/${currentWorkspace}/members/?query=${identifier}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (response.data.data) {
      return response.data.data[0]
    } else {
      throw Error("No users matching identifier found in workspace")
    }
  } catch (error) {
    throw Error(error)
  }
}

GetUserInfo();

export const GetWorkspaceUsers = async () => {
  try {
    const res = await axios.get(
      `https://api.zuri.chat/organizations/${currentWorkspace}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    let user = res.data.data
    // let workSpaceUsersData = { totalUsers: user.length, ...user.slice(0, 100) }

    let workSpaceUsersData = { totalUsers: user.length, ...user }
    // console.log(user.slice(0, 100))
    // console.log(workSpaceUsersData)
    return workSpaceUsersData
  } catch (err) {
    console.error(err)
  }

  // localStorage.setItem('WorkspaceUsers', JSON.stringify(res.data.data))
}

// Setup Centrifugo Route
const centrifuge = new Centrifuge(
  "wss://realtime.zuri.chat/connection/websocket", { debug: true }
)

centrifuge.setConnectData({ bearer: token })

centrifuge.connect()
centrifuge.on("connect", function (connectCtx) {
  console.warn("connected", connectCtx)
})

export const SubscribeToChannel = (plugin_id, callback) => {
  centrifuge.subscribe(plugin_id, ctx => {
    callback(ctx)
  })
}

const CallAllApis = () => {
  let user = JSON.parse(sessionStorage.getItem("user"))
  let token = sessionStorage.getItem("token")
  const currentWorkspace = localStorage.getItem("currentWorkspace")

  if ((user && token) !== null) {
    try {
      const response = axios.get(
        `https://api.zuri.chat/organizations/${currentWorkspace}/members/?query=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      let userData = { currentWorkspace, token, ...response.data.data[0] }
      // console.log('getuserinfo', response.data.data[0])
      // console.log(userData)
      return userData
    } catch (err) {
      console.error(err)
    }
  } else {
    console.warn("YOU ARE NOT LOGGED IN, PLEASE LOG IN")
  }
}

// CallAllApis();


const SetUpDb = () => {
  let luser = JSON.parse(sessionStorage.getItem("user"))
  let token = sessionStorage.getItem("token")
  const currentWorkspace = localStorage.getItem("currentWorkspace")


  if ((luser && token) !== null) {
    try {
      const response = axios.get(
        `https://api.zuri.chat/organizations/${currentWorkspace}/members/?query=${luser.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      let userData = { currentWorkspace, token, ...response.data.data[0] }
      // console.log('getuserinfo', response.data.data[0])
      // console.log(userData)
      return userData
    } catch (err) {
      console.error(err)
    }
  } else {
    console.warn("YOU ARE NOT LOGGED IN, PLEASE LOG IN")
  }

  let db;
  let dbReq = indexedDB.open('myDatabase', 1);
  // let userDat = CallAllApis();

  dbReq.onupgradeneeded = function (event) {
    db = event.target.result;
    let userDb = db.createObjectStore('userDb', { autoIncrement: true });

  }

  dbReq.onsuccess = function (event) {
    db = event.target.result;

    // Add some sticky notes
    addStickyNote(db, 'userDat');
  }

  function addStickyNote(db, message) {
    // Start a database transaction and get the notes object store
    let tx = db.transaction(['userDb'], 'readwrite');
    let store = tx.objectStore('userDb');

    // Put the sticky note into the object store
    let user = {text: message, timestamp: Date.now()};
    // let user = message;

    store.add(user);

    // Wait for the database transaction to complete
    tx.oncomplete = function () { 
      // console.log('stored note!') 
    }
    tx.onerror = function (event) {
      alert('error storing note ' + event.target.errorCode);
    }
  }
}

// SetUpDb();

  // Anything exported from this file is importable by other in-browser modules.
  export function publicApiFunction() { }
