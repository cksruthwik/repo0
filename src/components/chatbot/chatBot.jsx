// // ChatBot.jsx
// // Final version with Edit, Copy, and Rerun on user messages + Quick Actions for Paraphrase & Improve

// import React, { useState, useRef, useEffect } from 'react';
// import './ChatBot.css';
// import { IoInformationCircleOutline } from 'react-icons/io5';
// import { FaMicrophone, FaEdit, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
// import { GrAttachment } from 'react-icons/gr';
// import { IoSend, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
// import { BsSlashLg } from "react-icons/bs";
// import { FaRegCopy } from "react-icons/fa";




// const coeusLogoPath = '/icons/coeus-logo-purple.png';

// function ChatBot({ setActiveView, VIEWS }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [shapeBasedOnPage, setShapeBasedOnPage] = useState(true);
//   const [showQuickActions, setShowQuickActions] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
//   }, [messages, isLoading]);

//   const getBotResponse = async (userInput) => {
//     setIsLoading(true);
//     await new Promise(resolve => setTimeout(resolve, 800));

//     const lowerInput = userInput.toLowerCase();
//     let response = {
//       id: Date.now() + Math.random(),
//       sender: 'bot',
//       text: '',
//       isSummary: false,
//       showSuggestions: false,
//       suggestions: []
//     };

//     const stories = {
//       "how was coeus created": "Coeus was born in a quiet lab filled with buzzing servers and brilliant minds. A group of researchers set out to build an assistant that could understand complex human questions and respond with wisdom — and Coeus emerged from their efforts.",
//   "who trained coeus": "Coeus was trained by a diverse team of linguists, engineers, and domain experts. They fed it a mix of scientific literature, web data, and curated conversations to shape its unique personality.",
//   "what makes coeus different": "What sets Coeus apart is its ability to not only retrieve facts, but to engage in meaningful storytelling and dialogue that adapts to the user's style.",
//   "can coeus write stories": "Absolutely! Coeus crafts stories ranging from mythological retellings to futuristic adventures. Just give it a prompt and watch the tale unfold.",
//   "what is the coeus mission": "The mission of Coeus is to democratize intelligence. It aims to make expert-level reasoning accessible to everyone — from students to CEOs.",
//   "who are coeus users": "Coeus helps product teams summarize reports, marketers rewrite content, and students grasp tough topics. Anyone seeking clarity and creativity can rely on Coeus.",
//   "tell me a story about space": "Once upon a time in a distant galaxy, a curious AI named Coeus was deployed on a spacecraft. Its mission: to collect ancient alien tales and translate them into human languages. One day, Coeus found a glowing crystal etched with a message — not just a story, but a guide to peaceful interstellar communication.",
//   "give me a story about a coder": "There was a self-taught coder named Maya who lived in a small village. Despite limited access to the internet, she built an app that helped farmers predict the weather. Her story became a legend in open-source communities, and her project now powers farming in 13 countries.",
//   "tell me about coeus and humans": "Coeus was designed to bridge the gap between AI and people. It didn't just answer questions — it learned how people think, what inspires them, and how to respond with empathy. Over time, Coeus became more than a tool — it became a companion for curiosity."
// };

// if (stories[lowerInput]) {
//   response.text = stories[lowerInput];
//   setIsLoading(false);
//   return response;
// }

// if (lowerInput.includes("summarize this page")) {
//       response.text = `Okay, this page seems to be about AI technology and ChatGPT applications...`;
//       response.showSuggestions = true;
//       response.suggestions = ["Suggest questions?"];
//     } else if (lowerInput.includes("suggest questions?")) {
//       response.text = "Here are some relevant questions:";
//       response.showSuggestions = true;
//       response.suggestions = [
//         "What is the purpose of the 'NextGenAI Stories' section?",
//         "What is the relationship between Lyndon Batoris & Sora? Leo?",
//         "How is ChatGPT being used in the \"custom math tutor\"?"
//       ];
//     } else if (lowerInput.includes("nextgenai")) {
//       response.text = "The 'NextGenAI Stories' section showcases real-world applications of AI across industries...";
//       response.showSuggestions = true;
//       response.suggestions = ["Elaborate more?"];
//     } else if (lowerInput.includes("relationship between lyndon") || lowerInput.includes("batoris") || lowerInput.includes("sora")) {
//       response.text = "Info on Lyndon Batoris & Sora/Leo's relationship requires specific context from the narrative...";
//       response.showSuggestions = true;
//       response.suggestions = ["Elaborate more?"];
//     } else if (lowerInput.includes("custom math tutor")) {
//       response.text = "ChatGPT acts as the conversational engine in the custom math tutor, guiding students interactively...";
//       response.showSuggestions = true;
//       response.suggestions = ["Elaborate more?"];
//     } else if (lowerInput.includes("elaborate more")) {
//       response.text = "This section emphasizes innovation by sharing impactful stories from education, healthcare, and customer service domains...";
//     } else {
//       response.text = `I received: \"${userInput}\". How else can I help?`;
//     }

//     setIsLoading(false);
//     return response;
//   };

//   const handleSend = async () => {
//     const trimmed = input.trim();
//     if (!trimmed || isLoading) return;
//     const userMsg = { id: Date.now(), sender: 'user', text: trimmed, isPrompt: true };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     setShowQuickActions(false);
//     const botReply = await getBotResponse(trimmed);
//     setMessages(prev => [...prev, botReply]);
//   };

//   const handleSuggestionClick = async (text) => {
//     const userMsg = { id: Date.now(), sender: 'user', text, isPrompt: true };
//     setMessages(prev => [...prev, userMsg]);
//     const botReply = await getBotResponse(text);
//     setMessages(prev => [...prev, botReply]);
//   };

//   const toggleQuickActions = () => setShowQuickActions(prev => !prev);
//   const canSend = input.trim().length > 0 && !isLoading;

//   return (
//     <div className="chatbot-container">
//       <div className="chat-content-area">
//         {messages.length === 0 && !isLoading ? (
//           <div className="initial-prompt-container" style={{ paddingTop: '12%' }}>
//             <h2 className="initial-heading" style={{ fontSize: '1.6em' }}>Ask our Coeus anything!</h2>
//             <p className="initial-description" style={{ fontSize: '1.05em' }}>An AI-powered intelligent assistant</p>
//             <div className="initial-suggestions">
//               <button className="suggestion-button" onClick={() => handleSuggestionClick("Summarize this page")}>Summarize this page</button>
//               <button className="suggestion-button" onClick={() => handleSuggestionClick("Suggest questions?")}>Suggest questions?</button>
//             </div>
//           </div>
//         ) : (
//           <div className="message-list">
//             {messages.map((msg) => (
//               <div key={msg.id} className={`message-container ${msg.sender}`}>
//                 <div className={`message ${msg.sender}`}>
//                   <div className="message-bubble">{msg.text}</div>
//                 </div>
//                 {msg.sender === 'bot' && !isLoading && (
//   <div className="bot-message-actions">
//     <button className="user-action-button" title="Edit" onClick={() => setInput(msg.text)}><FaEdit /></button>
//     <button className="user-action-button" title="Copy" onClick={() => navigator.clipboard.writeText(msg.tet)}><FaRegCopy /></button>
//   </div>
// )}
//                 {msg.sender === 'user' && !isLoading && (
//                   <div className="user-message-actions">
//                     <button className="user-action-button" title="Edit" onClick={() => setInput(msg.text)}><FaEdit /></button>
//                     <button className="user-action-button" title="Copy" onClick={() => navigator.clipboard.writeText(msg.text)}><FaRegCopy /></button>
//                     <button className="user-action-button" title="Rerun" onClick={() => handleSuggestionClick(msg.text)}><span role="img" aria-label="sparkle">✨</span></button>
//                   </div>
//                 )}
//               </div>
//             ))}
//             {isLoading && <div className="message bot typing"><div className="message-bubble">...</div></div>}
//             {!isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
//               <div className="last-bot-actions-container">
//                 {messages[messages.length - 1].showSuggestions && (
//                   <div className="suggested-questions">
//                     {messages[messages.length - 1].suggestions.map((sugg, i) => (
//                       <button key={i} onClick={() => handleSuggestionClick(sugg)}>{sugg}</button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </div>

//       <div className="chat-footer">
//         <div className="page-context-toggle-container">
//           <label htmlFor="pageContextToggleSwitch" className="page-context-label">
//             Shape answers based on page's content
//           </label>
//           <div className="toggle-switch-wrapper">
//             <span className="info-icon" title="Info"><IoInformationCircleOutline /></span>
//             <label className="switch">
//               <input
//                 type="checkbox"
//                 id="pageContextToggleSwitch"
//                 checked={shapeBasedOnPage}
//                 onChange={(e) => setShapeBasedOnPage(e.target.checked)}
//                 disabled={isLoading}
//               />
//               <span className="slider round"></span>
//             </label>
//           </div>
//         </div>

//         <div className="input-area">
//           {showQuickActions && (
//             <div className="quick-actions-menu">
//               <div className="quick-actions-header">REWRITE</div>
//               <button className="quick-action-button" onClick={() => handleSuggestionClick('Paraphrase')}>Paraphrase</button>
//               <button className="quick-action-button" onClick={() => handleSuggestionClick('Improve')}>Improve</button>
//             </div>
//           )}

//           <div className="input-icons-left">
//             <button className="icon-button"><FaMicrophone /></button>
//             <button className="icon-button"><GrAttachment /></button>
//             <button className={`icon-button quick-action-trigger ${showQuickActions ? 'active' : ''}`} onClick={toggleQuickActions}><BsSlashLg /></button>
//           </div>

//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Enter Your Prompt here"
//             onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
//             disabled={isLoading}
//             className="prompt-input"
//           />
//           <button onClick={handleSend} disabled={!canSend} className={`send-button ${canSend ? 'enabled' : ''}`}><IoSend /></button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatBot;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ChatBot.jsx
// Final version with Edit, Copy, and Rerun on user messages + Quick Actions for Paraphrase & Improve

import React, { useState, useRef, useEffect } from 'react';
import './ChatBot.css';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { FaMicrophone, FaEdit, FaThumbsUp, FaThumbsDown, FaRegCopy } from 'react-icons/fa';
import { GrAttachment } from 'react-icons/gr';
import { IoSend, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { BsSlashLg } from "react-icons/bs";
import ReactMarkdown from 'react-markdown';

const coeusLogoPath = '/icons/coeus-logo-purple.png';

function ChatBot({ setActiveView, VIEWS }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shapeBasedOnPage, setShapeBasedOnPage] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages, isLoading]);

  // Retrieve the active tab’s URL via chrome.tabs.query
  const fetchActiveTabUrl = () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs && tabs[0];
        if (!currentTab || !currentTab.url) {
          return reject(new Error("Active tab URL not found."));
        }
        resolve(currentTab.url);
      });
    });
  };

  // // Instead of simulation, get the answer from your API:
  // const getBotResponse = async (userInput) => {
  //   setIsLoading(true);
  //   try {
  //     // Retrieve the active tab's URL
  //     const pageUrl = await fetchActiveTabUrl();
      
  //     // Build the payload following your API schema:
  //     // For QA: { url: string, content: string, question: string }
  //     const payload = {
  //       url: pageUrl,
  //       content: "", // Optionally: you could pass additional page content if desired.
  //       question: userInput
  //     };

  //     // Call your QA endpoint (replace with your actual API URL)
  //     const response = await fetch('http://localhost:8000/qa', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       credentials: 'include', // Include cookies if your server requires them
  //       body: JSON.stringify(payload)
  //     });

  //     if (!response.ok) {
  //       throw new Error(`API error: ${response.status} ${response.statusText}`);
  //     }
  //     const data = await response.json();
      
  //     // According to your API schema, expect { answer: string }
  //     const botResponse = {
  //       id: Date.now() + Math.random(),
  //       sender: 'bot',
  //       text: data.answer,
  //       isSummary: false,
  //       showSuggestions: false,
  //       suggestions: []
  //     };
  //     setIsLoading(false);
  //     return botResponse;
  //   } catch (err) {
  //     setIsLoading(false);
  //     return {
  //       id: Date.now() + Math.random(),
  //       sender: 'bot',
  //       text: `Error: ${err.message}`,
  //       isSummary: false,
  //       showSuggestions: false,
  //       suggestions: []
  //     };
  //   }
  // };
  // const getBotResponse = async (userInput) => {
  //   setIsLoading(true);
  //   const lowerInput = userInput.toLowerCase();
  
  //   // Default bot response object
  //   let response = {
  //     id: Date.now() + Math.random(),
  //     sender: 'bot',
  //     text: '',
  //     isSummary: false,
  //     showSuggestions: false,
  //     suggestions: []
  //   };
  
  //   try {
  //     if (lowerInput.includes("summarize this page")) {
  //       response.text = `Okay, this page seems to be about AI technology and ChatGPT applications...`;
  //       response.showSuggestions = true;
  //       response.suggestions = ["Suggest questions?"];
  //     } else if (lowerInput.includes("suggest questions?")) {
  //       response.text = "Here are some relevant questions:";
  //       response.showSuggestions = true;
  //       response.suggestions = [
  //         "What is the purpose of the 'NextGenAI Stories' section?",
  //         "What is the relationship between Lyndon Batoris & Sora? Leo?",
  //         "How is ChatGPT being used in the \"custom math tutor\"?"
  //       ];
  //     } else if (lowerInput.includes("nextgenai")) {
  //       response.text = "The 'NextGenAI Stories' section showcases real-world applications of AI across industries...";
  //       response.showSuggestions = true;
  //       response.suggestions = ["Elaborate more?"];
  //     } else if (lowerInput.includes("relationship between lyndon") || lowerInput.includes("batoris") || lowerInput.includes("sora")) {
  //       response.text = "Info on Lyndon Batoris & Sora/Leo's relationship requires specific context from the narrative...";
  //       response.showSuggestions = true;
  //       response.suggestions = ["Elaborate more?"];
  //     } else if (lowerInput.includes("custom math tutor")) {
  //       response.text = "ChatGPT acts as the conversational engine in the custom math tutor, guiding students interactively...";
  //       response.showSuggestions = true;
  //       response.suggestions = ["Elaborate more?"];
  //     } else if (lowerInput.includes("elaborate more")) {
  //       response.text = "This section emphasizes innovation by sharing impactful stories from education, healthcare, and customer service domains...";
  //     } else {
  //       // Existing API call preserved here
  //       const pageUrl = await fetchActiveTabUrl();
  
  //       const payload = {
  //         url: pageUrl,
  //         content: "",
  //         question: userInput
  //       };
  
  //       const apiResponse = await fetch('http://localhost:8000/qa', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         credentials: 'include',
  //         body: JSON.stringify(payload)
  //       });
  
  //       if (!apiResponse.ok) {
  //         throw new Error(`API error: ${apiResponse.status} ${apiResponse.statusText}`);
  //       }
  
  //       const data = await apiResponse.json();
  //       response.text = data.answer || "I couldn't find an answer for your query.";
  //     }
  
  //     setIsLoading(false);
  //     return response;
  //   } catch (err) {
  //     setIsLoading(false);
  //     response.text = `Error: ${err.message}`;
  //     return response;
  //   }
  // };
  const getBotResponse = async (userInput) => {
    setIsLoading(true);
    const lowerInput = userInput.toLowerCase();
  
    let response = {
      id: Date.now() + Math.random(),
      sender: 'bot',
      text: '',
      isSummary: false,
      showSuggestions: false,
      suggestions: []
    };
  
    try {
      const pageUrl = await fetchActiveTabUrl();
  
      if(lowerInput.includes("suggest questions?")) {
        // Hit questions endpoint to get dynamic questions
        const questionsRes = await fetch('http://localhost:8000/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: pageUrl, content: "" })
        });
        const questionsData = await questionsRes.json();
  
        response.text = "Here are some relevant questions:";
        response.showSuggestions = true;
        response.suggestions = questionsData.questions;
  
      } else {
        // For all other inputs, hit the QA endpoint
        const qaRes = await fetch('http://localhost:8000/qa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: pageUrl, content: "", question: userInput })
        });
        const qaData = await qaRes.json();
  
        response.text = qaData.answer || "I couldn't find an answer for your query.";
      }
  
      setIsLoading(false);
      return response;
    } catch (err) {
      setIsLoading(false);
      response.text = `Error: ${err.message}`;
      return response;
    }
  };
  

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    const userMsg = { id: Date.now(), sender: 'user', text: trimmed, isPrompt: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowQuickActions(false);
    const botReply = await getBotResponse(trimmed);
    setMessages(prev => [...prev, botReply]);
  };

  const handleSuggestionClick = async (text) => {
    const userMsg = { id: Date.now(), sender: 'user', text, isPrompt: true };
    setMessages(prev => [...prev, userMsg]);
    const botReply = await getBotResponse(text);
    setMessages(prev => [...prev, botReply]);
  };

  const toggleQuickActions = () => setShowQuickActions(prev => !prev);
  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="chatbot-container">
      <div className="chat-content-area">
        {messages.length === 0 && !isLoading ? (
          <div className="initial-prompt-container" style={{ paddingTop: '12%' }}>
            <h2 className="initial-heading" style={{ fontSize: '1.6em' }}>Ask our Coeus anything!</h2>
            <p className="initial-description" style={{ fontSize: '1.05em' }}>An AI-powered intelligent assistant</p>
            <div className="initial-suggestions">
              <button className="suggestion-button" onClick={() => setActiveView(VIEWS.SUMMARIZER)}>
                Summarize this page
              </button>
              <button className="suggestion-button" onClick={() => handleSuggestionClick("Suggest questions?")}>Suggest questions?</button>
            </div>
          </div>
        ) : (
          <div className="message-list">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-container ${msg.sender}`}>
                <div className={`message ${msg.sender}`}>
                  <div className="message-bubble">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
                {msg.sender === 'bot' && !isLoading && (
                  <div className="bot-message-actions">
                    <button className="user-action-button" title="Edit" onClick={() => setInput(msg.text)}><FaEdit /></button>
                    <button className="user-action-button" title="Copy" onClick={() => navigator.clipboard.writeText(msg.text)}><FaRegCopy /></button>
                  </div>
                )}
                {msg.sender === 'user' && !isLoading && (
                  <div className="user-message-actions">
                    <button className="user-action-button" title="Edit" onClick={() => setInput(msg.text)}><FaEdit /></button>
                    <button className="user-action-button" title="Copy" onClick={() => navigator.clipboard.writeText(msg.text)}><FaRegCopy /></button>
                    <button className="user-action-button" title="Rerun" onClick={() => handleSuggestionClick(msg.text)}><span role="img" aria-label="sparkle">✨</span></button>
                  </div>
                )}
              </div>
            ))}
            {isLoading && <div className="message bot typing"><div className="message-bubble">...</div></div>}
            {!isLoading && messages.length > 0 && messages[messages.length - 1].sender === 'bot' && (
              <div className="last-bot-actions-container">
                {messages[messages.length - 1].showSuggestions && (
                  <div className="suggested-questions">
                    {messages[messages.length - 1].suggestions.map((sugg, i) => (
                      <button key={i} onClick={() => handleSuggestionClick(sugg)}>{sugg}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="chat-footer">
        <div className="input-area">
          {showQuickActions && (
            <div className="quick-actions-menu">
              <div className="quick-actions-header">REWRITE</div>
              <button className="quick-action-button" onClick={() => handleSuggestionClick('Paraphrase')}>Paraphrase</button>
              <button className="quick-action-button" onClick={() => handleSuggestionClick('Improve')}>Improve</button>
            </div>
          )}

          <div className="input-icons-left">
            <button className="icon-button"><FaMicrophone /></button>
            <button className="icon-button"><GrAttachment /></button>
            <button className={`icon-button quick-action-trigger ${showQuickActions ? 'active' : ''}`} onClick={toggleQuickActions}><BsSlashLg /></button>
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Your Prompt here"
            onKeyPress={(e) => { if (e.key === 'Enter') handleSend(); }}
            disabled={isLoading}
            className="prompt-input"
          />
          <button onClick={handleSend} disabled={!canSend} className={`send-button ${canSend ? 'enabled' : ''}`}><IoSend /></button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
