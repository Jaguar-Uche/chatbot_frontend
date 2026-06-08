import { Avatar, Box, Typography } from "@mui/material"
import { useAuth } from "../../context/AuthContext"
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useEffect, useState } from "react";


function extractCodeFromString(message:string){
  if(message.includes("```")){
    const blocks = message.split("```");
    return blocks;
  }
}

function isCodeBlock(str: string) {
    return (
      str.includes("=") ||
      str.includes(";") ||
      str.includes("[") ||
      str.includes("]") ||
      str.includes("{") ||
      str.includes("}") ||
      str.includes("#") ||
      str.includes("//")
    );
  }

const ChatItem = ({content,role}:{content:string,role:"user"|"assistant"}) => {
  const auth = useAuth();
  const parts = auth?.user?.name?.trim().split(/\s+/) || [];
  const lastName = parts.length > 1 ? parts.at(-1) : "";
  const messageBlocks = extractCodeFromString(content);
  const [language, setLanguage] = useState('');

  useEffect(() => {
    if (messageBlocks && messageBlocks.length) {
      for (const block of messageBlocks) {
        if (isCodeBlock(block)) {
          const firstWord = block.trim().split(/\s+/)[0].toLowerCase();
          setLanguage(firstWord); // Set detected language
          break;
        }
      }
    }
  }, [messageBlocks]);

  useEffect(() => {
    // console.log("Detected language:", language);
  }, [language]);

  return (    role ==="assistant" 
    ?
    <Box sx={{display:"flex", p:2, bgcolor:"#004d5612", my:2, gap:2}}>
      <Avatar sx={{ml:"0",}}>
      <img src="openai.png" alt="openai avatar" width={"30px"} />
      </Avatar>
      <Box>
        
        {!messageBlocks && (<Typography sx={{ fontSize: "20px" }}>{content}</Typography>)}

        {messageBlocks
        && messageBlocks.length 
        && messageBlocks.map((block)=>(isCodeBlock(block) 
        ?
        <SyntaxHighlighter
        style={coldarkDark}
        language={language}
        >
          {block}
        </SyntaxHighlighter>
        :
        <Typography sx={{ fontSize: "20px" }}>{content}</Typography> ))}

      </Box>
    </Box>
    :
    <Box sx={{display:"flex", p:2, bgcolor:"#004d56", gap:2,my:2}}>
      <Avatar sx={{ml:"0",bgcolor:'black', color:"white"}}>
      {auth?.user?.name[0].toUpperCase()}
            {lastName ? lastName[0].toUpperCase() : ""}
      </Avatar>
      <Box>
        
        {!messageBlocks && (<Typography sx={{ fontSize: "20px" }}>{content}</Typography>)}

        {messageBlocks
        && messageBlocks.length 
        && messageBlocks.map((block)=>(isCodeBlock(block) 
        ?
        <SyntaxHighlighter
        style={coldarkDark}
        language={language}
        wrapLongLines={true} // ✅ enables line wrapping
        customStyle={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {block}
        </SyntaxHighlighter>
        :
        <Typography sx={{ fontSize: "20px" }}>{content}</Typography> ))}

      </Box>
    </Box>
  )
}

export default ChatItem