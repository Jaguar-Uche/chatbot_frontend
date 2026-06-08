import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import {useEffect, useLayoutEffect, useRef, useState } from "react";
import toast from 'react-hot-toast'
import { deleteAllChats, getAllChats, sendChatRequest } from "../helpers/api-communicator";
import {useNavigate} from 'react-router-dom'


type Messages = {
  role:"user"|"assistant",
  content:string
}
const Chat = () => {
  const auth = useAuth();
  const parts = auth?.user?.name?.trim().split(/\s+/) || []; // array or []

  const navigate = useNavigate();


  // last name only if there’s more than one word
  const lastName = parts.length > 1 ? parts.at(-1) : ""; // "" when no last name

  const inputRef = useRef<HTMLInputElement|null>(null);
  
  const [chatMessages, setChatMessages]= useState<Messages[]>([])

  const handleSubmit =async ()=>{
    const content = inputRef.current?.value as string;
    if(!content.trim()){
      return toast.error("Please Enter a message");
    }
    if(inputRef && inputRef.current){
      inputRef.current.value ="";
    }
    const newMessage:Messages = {role:"user", content};
    setChatMessages((prev)=>[...prev, newMessage]);

    //send the message to the backend and get the response and display it too and store the message so on update, it is showing

    const chatData = await sendChatRequest(content);

    setChatMessages([...chatData.chats])
  }

  const handleDeleteChats = async () =>{
    try {
      toast.loading("Deleting chats", {id:"deletechats"});
      await deleteAllChats();
      setChatMessages([]);
      toast.success("Chats deleted Successfully", {id:"deletechats"})
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting chats", {id:"deletechats"})
    }
  }

  useLayoutEffect(()=>{
    //use Layout effect runs before it is rendered on the ui
    if(auth?.isLoggedIn && auth.user){
      toast.loading("Loading chats", {id:"loadchats"});
      getAllChats().then((data)=>{
        setChatMessages([...data.chats])
        toast.success("Successfully Loaded Chats", {id:"loadchats"})
      }).catch(err=>{
        console.log(err);
        toast.error("Loading Failed",{id:"loadchats"})
      });
      
    }
  },[auth])

  //@ts-ignore
  useEffect(()=>{
    if(!auth?.user){
      return navigate('/login');
      
    }
  },[auth])

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "65vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0].toUpperCase()}
            {lastName ? lastName[0].toUpperCase() : ""}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to the JAGbot
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask questions related to Knowledge, business,
            advices,education,etc. But avoid sharing personal information
          </Typography>
          <Button
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}

            onClick={handleDeleteChats}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
          overflowX:"hidden"
        }}
      >
        <Typography
          sx={{
            mx: "auto",
            fontSize: "40px",
            color: "white",
            mb: 2,
            fontWeight: "600",
          }}
        >
          Model - GPT 3.5 Turbo
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",     
            msOverflowStyle: "none",    
            "&::-webkit-scrollbar": {   
              display: "none"
            }
          }}
        >
          {chatMessages.map((chat,index)=>
          //@ts-ignore
          <ChatItem content={chat.content} role={chat.role} key={index} />)}
        </Box>
        <div style={{width:"100%", padding:"20px", borderRadius:8, backgroundColor:"rgb(17,27,39)", display:"flex", marginRight:"auto"}}>
          <Avatar
            sx={{
              mx: "auto",
              bgcolor: "black",
              color: "white",
              fontWeight: 400,
            }}
          >
            {auth?.user?.name[0].toUpperCase()}
            {lastName ? lastName[0].toUpperCase() : ""}
          </Avatar>
          <input ref={inputRef} type="text" style={{width:"100%", backgroundColor:"transparent", padding:"10px", border:"none", outline:"none", color:"white", fontSize:"20px"}} />
          <IconButton sx={{ml:"auto", color:"white"}} onClick={handleSubmit}>
            <IoMdSend/>
          </IconButton>
        </div>
        
      </Box>
    </Box>
  );
};

export default Chat;
