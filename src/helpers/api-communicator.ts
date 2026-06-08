import axios from "axios"

export const loginUser = async (email:string, password:string)=>{
  const res = await axios.post('/user/login', {email, password});
  if(res.status!==200){
    throw new Error("Unable to login");
  }

  const data = await res.data;
  return data;
}

export const checkAuthStatus = async ()=>{
  const res = await axios.get('/user/auth-status');
  if(res.status!==200){
    throw new Error("Unable to authenticate user");
  }

  const data = await res.data;
  return data;
}

export const sendChatRequest = async (message:string)=>{
  const res = await axios.post('/chats/new', {
    message
  });
  if(res.status!==200){
    throw new Error("Unable to send chat");
  }

  const data = await res.data;
  return data;
}

export const getAllChats = async ()=>{
  const res = await axios.get('/chats/all-chats');
  if(res.status!==200){
    throw new Error("Unable to get chats");
  }

  const data = await res.data;
  return data;
}

export const deleteAllChats = async ()=>{
  const res = await axios.delete('/chats/delete');
  if(res.status!==200){
    throw new Error("Unable to delete chats");
  }

  const data = await res.data;
  return data;
}

export const LogoutUser = async ()=>{
  const res = await axios.get('/user/logout');
  if(res.status!==200){
    throw new Error("Unable to delete chats");
  }

  const data = await res.data;
  return data;
}

export const signupUser = async (name:string, email:string, password:string)=>{
  const res = await axios.post('/user/signup', {name,email, password});
  if(res.status!==201){
    throw new Error("Unable to sign user up");
  }

  const data = await res.data;
  return data;
}