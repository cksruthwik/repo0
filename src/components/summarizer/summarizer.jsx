// import React, { useState, useEffect } from 'react';
// import './Summarizer.css';
// // --- Import Icons ---
// import { FaInfoCircle, FaEdit, FaThumbsUp, FaThumbsDown, FaCopy } from 'react-icons/fa'; // Header info, Summary Actions + Copy
// import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'; // Suggestion button icon

// // Function to inject into the target page (Ensure this exists and works)
// function scrapeText() {
//   // Keep your existing scrapeText logic
//   // Example:
//   return document.body.innerText || ''; // Return empty string if no text
// }

// function Summarizer() {
//   // State for summary text, loading, error, and questions/answers
//   const [summary, setSummary] = useState('');
//   const [isLoading, setIsLoading] = useState(false); // Use one loading state for all async actions
//   const [error, setError] = useState('');
//   const [suggestedQuestions, setSuggestedQuestions] = useState([]);
//   const [answers, setAnswers] = useState({}); // Store answers keyed by question index
//   const [loadingAnswerIndex, setLoadingAnswerIndex] = useState(null); // Track which question's answer is loading
//   // const [pageTitle, setPageTitle] = useState(''); // Keep if needed elsewhere

//   // Get page title on mount (Optional)
//   useEffect(() => {
//     if (chrome?.tabs) {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const currentTab = tabs?.[0];
//         // if (currentTab) setPageTitle(currentTab.title || 'Current Page'); // Uncomment if needed
//       });
//     } else {
//       console.warn("Chrome tabs API not available.");
//       // setPageTitle("Current Page (Dev Mode)");
//     }
//   }, []);

//   // --- SIMULATED API CALLS ---
//   const getSummaryFromApi = async () => {
//     console.log("Simulating getSummaryFromApi...");
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     // Formatted dummy summary with headings and bullets
//     return `### AI Technology Overview (ChatGPT Focus)

// **Key Applications:**
// *   **Custom Math Tutor:** Demonstrates educational potential.
// *   **OpenAI for Business:** Highlights commercial uses and integration.

// **Research & Development:**
// *   Mentions recent advancements in the AI field.
// *   Suggests ongoing work and potential future capabilities.
// *   *Note:* Tone might be promotional.

// **Overall Impression:**
// The page showcases AI capabilities, aiming to attract developers and businesses by emphasizing versatility and potential, particularly around ChatGPT and OpenAI services. Ethical considerations and technical details might be secondary to demonstrating broad applicability. This detailed exploration provides a comprehensive overview for potential adopters and interested parties. Additional paragraphs could delve into specific API features, developer resources, and community support forums, encouraging further investigation and experimentation with the technology.`;
//   };

//   const getQuestionsFromApi = async () => {
//     console.log("Simulating getQuestionsFromApi...");
//     await new Promise(resolve => setTimeout(resolve, 500));
//     // Keep the example questions
//     return [
//       "What is the purpose of the 'NextGenAI Stories' section?",
//       "What is the relationship between Lyndon Barrios & Sara Leo?",
//       "How is ChatGPT being used in the 'custom math tutor'?"
//     ];
//   };

//   // Simulate getting an answer for a clicked question
//   const getAnswerForQuestion = async (question) => {
//     console.log("Simulating getAnswerForQuestion:", question);
//     // Don't set global isLoading here, use loadingAnswerIndex
//     setError('');
//     await new Promise(resolve => setTimeout(resolve, 900));
//     // Dummy answer logic...
//     if (question.includes("NextGenAI")) return "The 'NextGenAI Stories' section likely showcases real-world applications and user testimonials related to the AI technology discussed on the page. It aims to provide concrete examples and build credibility.";
//     if (question.includes("Barrios")) return "Information regarding the specific relationship between Lyndon Barrios and Sara Leo is not available in the provided context. This might require accessing external data or specific knowledge bases not covered in the summary.";
//     if (question.includes("math tutor")) return "ChatGPT is likely used in the custom math tutor example as the core conversational engine, providing explanations, generating practice problems, offering step-by-step guidance, and adapting to the student's learning pace based on their input.";
//     return `Could not find a specific answer for "${question}" in this simulation. Further details might be needed.`;
//   };
//   // --- End Simulations ---

//   // --- Handlers ---
//   const handleSummarize = async () => {
//     console.log("Summarizer: [handleSummarize] Start.");
//     setIsLoading(true); setError(''); setSummary(''); setSuggestedQuestions([]); setAnswers({}); setLoadingAnswerIndex(null); // Reset all content
//     try {
//       // --- Placeholder for actual content scraping ---
//       // Ensure scrapeText function exists and works
//       // const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
//       // if (!activeTab?.id || !activeTab?.url ...) { throw new Error("Cannot summarize...") }
//       // const results = await chrome.scripting.executeScript(...).catch(...);
//       // if (!results...) { throw new Error("Could not retrieve...") }
//       // const pageText = results[0].result || "";
//       // if (pageText.trim().length < 50) throw new Error("Not enough text...");
//       // --- End scraping placeholder ---

//       const result = await getSummaryFromApi(/* pageText */); // Pass pageText if using real API
//       setSummary(result);
//       // Do NOT automatically fetch questions here
//     } catch (err) { setError(`Summarization error: ${err.message}`); }
//     finally { setIsLoading(false); }
//   };

//   // Fetch and display questions, don't clear other state
//   const handleSuggestQuestions = async () => {
//      console.log("Summarizer: [handleSuggestQuestions] Start.");
//      setIsLoading(true); setError(''); // Indicate loading for questions
//      setSuggestedQuestions([]); // Clear old questions before fetching new ones
//      setAnswers({}); // Clear old answers when fetching new questions
//      try {
//         const result = await getQuestionsFromApi();
//         setSuggestedQuestions(result); // Just set the questions
//      } catch (err) { setError(`Error fetching questions: ${err.message}`); }
//      finally { setIsLoading(false); } // Stop loading indicator
//   };

//   // Fetch and display answer below the specific question
//   const handleQuestionItemClick = async (question, index) => {
//      console.log("Summarizer: [handleQuestionItemClick] Start for index:", index, question);
//      setLoadingAnswerIndex(index); // Indicate which answer is loading
//      setError('');
//      // Clear only the specific answer before fetching
//      setAnswers(prev => ({ ...prev, [index]: undefined }));

//      try {
//         const answer = await getAnswerForQuestion(question);
//         // Store answer using the index as the key
//         setAnswers(prev => ({ ...prev, [index]: answer }));
//      } catch (err) {
//          setError(`Error fetching answer: ${err.message}`);
//          // Optionally clear the specific answer on error
//          setAnswers(prev => ({ ...prev, [index]: undefined }));
//         }
//      finally {
//          setLoadingAnswerIndex(null); // Stop loading for this index
//      }
//   };

//   // Handle copying summary text
//   const handleCopySummary = () => {
//       if (summary) {
//           navigator.clipboard.writeText(summary)
//               .then(() => console.log("Summary copied!")) // Add user feedback later
//               .catch(err => console.error("Failed to copy summary:", err));
//       }
//   };

//   return (
//     // This main container will handle scrolling if needed
//     <div className="summarizer-container">
//       {/* Header */}
//       <div className="page-info-header">
//         <span>Llama 3.38B by Meta</span>
//         <FaInfoCircle className="info-icon-header" title="Model Information" />
//       </div>

//       {/* Summarize Button */}
//       <button onClick={handleSummarize} disabled={isLoading} className="summarize-button primary-action-button">
//          {/* Show specific loading text based on what's happening */}
//         {isLoading && !summary && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a) ? 'Summarizing...' : 'Summarize this page'}
//       </button>

//       {/* Error Message */}
//       {error && <p className="error-message">{error}</p>}

//       {/* Display Summary Section (if summary exists) */}
//       {summary && (
//         <div className="summary-output">
//            <div className="summary-text-container">
//             <div className="static-header">
//               {/* Markdown-like rendering */}
//               {summary.split('\n').map((line, index) => {
//                    if (line.startsWith('### ')) return <h3 key={index} className="summary-h3">{line.substring(4)}</h3>;
//                    if (line.startsWith('**')) return <p key={index} className="summary-strong">{line.substring(2, line.length - (line.endsWith('**') ? 2 : 0))}</p>;
//                    if (line.startsWith('*   ')) return <li key={index} className="summary-li">{line.substring(4)}</li>;
//                    if (line.startsWith('*Note:*')) return <p key={index} className="summary-note"><em>{line.substring(1)}</em></p>;
//                    if (line.trim() === '') return <br key={index} />;
//                    return <p key={index}>{line}</p>;
//               })}
//            </div>
//            </div>
//            <div className="summary-actions">
//              <button className="action-button" onClick={handleCopySummary}> <FaCopy /> Copy</button>
//              <button className="action-button"> <FaEdit /> Edit</button>
//              <button className="action-button"> <FaThumbsUp /> Like</button>
//              <button className="action-button"> <FaThumbsDown /> Dislike</button>
//            </div>
//         </div>
//       )}

//       {/* Suggest Questions Button Area */}
//       {/* Show suggest button if summary exists OR if nothing else shown yet and not loading */}
//       {(summary || (!isLoading && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a))) && (
//          <div className="summarizer-suggestion-area">
//            <button
//              className="suggestion-button-followup"
//              onClick={handleSuggestQuestions}
//              disabled={isLoading} // Disable while any loading is happening
//            >
//              <IoChatbubbleEllipsesOutline className="suggestion-icon" /> Suggest questions ?
//            </button>
//          </div>
//        )}

//       {/* Display Suggested Questions List (if questions exist) */}
//       {suggestedQuestions.length > 0 && (
//         <div className="questions-list-container">
//           {suggestedQuestions.map((question, index) => (
//             // Use Fragment to group question and potential answer/loading state
//             <React.Fragment key={index}>
//               <button
//                 className="question-item-button"
//                 onClick={() => handleQuestionItemClick(question, index)}
//                 // Disable button if its answer is currently loading OR if it already has an answer displayed
//                 disabled={loadingAnswerIndex === index || !!answers[index]}
//               >
//                 {question}
//               </button>
//               {/* Loading indicator specifically for this question's answer */}
//               {loadingAnswerIndex === index && <p className="loading-indicator answer-loading">Fetching answer...</p>}
//               {/* Display answer specific to this question index */}
//               {answers[index] && loadingAnswerIndex !== index && (
//                   <div className="summary-output answer-output question-answer"> {/* Add specific class */}
//                      <div className="summary-text-container">
//                          {/* Optionally add a heading: <h4>Answer:</h4> */}
//                          <p>{answers[index]}</p>
//                      </div>
//                      {/* Optional actions for answers */}
//                   </div>
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       )}

//       {/* General Loading Indicator (if loading summary/questions and nothing else shown) */}
//       {isLoading && !summary && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a) && <p className="loading-indicator">Processing...</p> }

//     </div>
//   );
// }

// export default Summarizer;



// import React, { useState, useEffect } from 'react';
// import './Summarizer.css';
// // --- Import Icons ---
// import { FaInfoCircle, FaEdit, FaThumbsUp, FaThumbsDown, FaCopy } from 'react-icons/fa'; // Header info, Summary Actions + Copy
// import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'; // Suggestion button icon

// // Utility: Read a cookie by name
// function getCookie(name) {
//   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//   return match ? decodeURIComponent(match[2]) : null;
// }

// // Function to inject into the target page (Ensure this exists and works)
// function scrapeText() {
//   // Keep your existing scrapeText logic
//   return document.body.innerText || ''; // Return empty string if no text
// }

// function Summarizer() {
//   // State for summary text, loading, error, and questions/answers
//   const [summary, setSummary] = useState('');
//   const [isLoading, setIsLoading] = useState(false); // Use one loading state for all async actions
//   const [error, setError] = useState('');
//   const [suggestedQuestions, setSuggestedQuestions] = useState([]);
//   const [answers, setAnswers] = useState({}); // Store answers keyed by question index
//   const [loadingAnswerIndex, setLoadingAnswerIndex] = useState(null); // Track which question's answer is loading

//   // Get page title on mount (Optional)
//   useEffect(() => {
//     if (chrome?.tabs) {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         // const currentTab = tabs?.[0];
//       });
//     } else {
//       console.warn("Chrome tabs API not available.");
//     }
//   }, []);

//   // --- API CALLS ---
//   const getSummaryFromApi = async () => {
//     const url = getCookie('pageUrl'); // name of cookie where URL is stored
//     if (!url) {
//       throw new Error('Page URL not found in cookies.');
//     }
//     const response = await fetch('http://localhost:8000/summarize', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ url }),
//     });
//     if (!response.ok) {
//       throw new Error(`API error: ${response.status} ${response.statusText}`);
//     }
//     const data = await response.json();
//     // Assuming API returns { summary: string }
//     return data.summary;
//   };

//   const getQuestionsFromApi = async () => {
//     console.log("Simulating getQuestionsFromApi...");
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return [
//       "What is the purpose of the 'NextGenAI Stories' section?",
//       "What is the relationship between Lyndon Barrios & Sara Leo?",
//       "How is ChatGPT being used in the 'custom math tutor'?"
//     ];
//   };

//   const getAnswerForQuestion = async (question) => {
//     console.log("Simulating getAnswerForQuestion:", question);
//     setError('');
//     await new Promise(resolve => setTimeout(resolve, 900));
//     if (question.includes("NextGenAI")) return "The 'NextGenAI Stories' section likely showcases real-world applications and user testimonials related to the AI technology discussed on the page. It aims to provide concrete examples and build credibility.";
//     if (question.includes("Barrios")) return "Information regarding the specific relationship between Lyndon Barrios and Sara Leo is not available in the provided context. This might require accessing external data or specific knowledge bases not covered in the summary.";
//     if (question.includes("math tutor")) return "ChatGPT is likely used in the custom math tutor example as the core conversational engine, providing explanations, generating practice problems, offering step-by-step guidance, and adapting to the student's learning pace based on their input.";
//     return `Could not find a specific answer for "${question}" in this simulation. Further details might be needed.`;
//   };

//   // --- Handlers ---
//   const handleSummarize = async () => {
//     console.log("Summarizer: [handleSummarize] Start.");
//     setIsLoading(true);
//     setError(''); setSummary(''); setSuggestedQuestions([]); setAnswers({}); setLoadingAnswerIndex(null);
//     try {
//       // Optionally: scrape text if needed
//       // const pageText = scrapeText();
//       const result = await getSummaryFromApi();
//       setSummary(result);
//     } catch (err) {
//       setError(`Summarization error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSuggestQuestions = async () => {
//     console.log("Summarizer: [handleSuggestQuestions] Start.");
//     setIsLoading(true); setError(''); setSuggestedQuestions([]); setAnswers({});
//     try {
//       const result = await getQuestionsFromApi();
//       setSuggestedQuestions(result);
//     } catch (err) {
//       setError(`Error fetching questions: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleQuestionItemClick = async (question, index) => {
//     console.log("Summarizer: [handleQuestionItemClick] Start for index:", index, question);
//     setLoadingAnswerIndex(index); setError(''); setAnswers(prev => ({ ...prev, [index]: undefined }));
//     try {
//       const answer = await getAnswerForQuestion(question);
//       setAnswers(prev => ({ ...prev, [index]: answer }));
//     } catch (err) {
//       setError(`Error fetching answer: ${err.message}`);
//       setAnswers(prev => ({ ...prev, [index]: undefined }));
//     } finally {
//       setLoadingAnswerIndex(null);
//     }
//   };

//   const handleCopySummary = () => {
//     if (summary) {
//       navigator.clipboard.writeText(summary)
//         .then(() => console.log("Summary copied!"))
//         .catch(err => console.error("Failed to copy summary:", err));
//     }
//   };

//   return (
//     <div className="summarizer-container">
//       <div className="page-info-header">
//         <span>Llama 3.38B by Meta</span>
//         <FaInfoCircle className="info-icon-header" title="Model Information" />
//       </div>

//       <button onClick={handleSummarize} disabled={isLoading} className="summarize-button primary-action-button">
//         {isLoading && !summary && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a) ? 'Summarizing...' : 'Summarize this page'}
//       </button>

//       {error && <p className="error-message">{error}</p>}

//       {summary && (
//         <div className="summary-output">
//           <div className="summary-text-container">
//             {summary.split('\n').map((line, idx) => {
//               if (line.startsWith('### ')) return <h3 key={idx} className="summary-h3">{line.substring(4)}</h3>;
//               if (line.startsWith('**')) return <p key={idx} className="summary-strong">{line.substring(2, line.length - (line.endsWith('**') ? 2 : 0))}</p>;
//               if (line.startsWith('*   ')) return <li key={idx} className="summary-li">{line.substring(4)}</li>;
//               if (line.startsWith('*Note:*')) return <p key={idx} className="summary-note"><em>{line.substring(1)}</em></p>;
//               if (line.trim() === '') return <br key={idx} />;
//               return <p key={idx}>{line}</p>;
//             })}
//           </div>
//           <div className="summary-actions">
//             <button className="action-button" onClick={handleCopySummary}><FaCopy /> Copy</button>
//             <button className="action-button"><FaEdit /> Edit</button>
//             <button className="action-button"><FaThumbsUp /> Like</button>
//             <button className="action-button"><FaThumbsDown /> Dislike</button>
//           </div>
//         </div>
//       )}

//       {(summary || (!isLoading && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a))) && (
//         <div className="summarizer-suggestion-area">
//           <button
//             className="suggestion-button-followup"
//             onClick={handleSuggestQuestions}
//             disabled={isLoading}
//           >
//             <IoChatbubbleEllipsesOutline className="suggestion-icon" /> Suggest questions ?
//           </button>
//         </div>
//       )}

//       {suggestedQuestions.length > 0 && (
//         <div className="questions-list-container">
//           {suggestedQuestions.map((question, index) => (
//             <React.Fragment key={index}>
//               <button
//                 className="question-item-button"
//                 onClick={() => handleQuestionItemClick(question, index)}
//                 disabled={loadingAnswerIndex === index || !!answers[index]}
//               >
//                 {question}
//               </button>
//               {loadingAnswerIndex === index && <p className="loading-indicator answer-loading">Fetching answer...</p>}
//               {answers[index] && loadingAnswerIndex !== index && (
//                 <div className="summary-output answer-output question-answer">
//                   <div className="summary-text-container">
//                     <p>{answers[index]}</p>
//                   </div>
//                 </div>
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       )}

//       {isLoading && !summary && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a) && <p className="loading-indicator">Processing...</p>}
//     </div>
//   );
// }

// export default Summarizer;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import './Summarizer.css';
// // --- Import Icons ---
// import { FaInfoCircle, FaEdit, FaThumbsUp, FaThumbsDown, FaCopy } from 'react-icons/fa'; // Header info, Summary Actions + Copy
// import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'; // Suggestion button icon

// // Utility: Read a cookie by name (not used now, kept as-is)
// function getCookie(name) {
//   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//   return match ? decodeURIComponent(match[2]) : null;
// }

// // Function to inject into the target page (Ensure this exists and works)
// function scrapeText() {
//   // Keep your existing scrapeText logic
//   return document.body.innerText || ''; // Return empty string if no text
// }

// function Summarizer() {
//   // State for summary text, loading, error, and questions/answers
//   const [summary, setSummary] = useState('');
//   const [isLoading, setIsLoading] = useState(false); // Use one loading state for all async actions
//   const [error, setError] = useState('');
//   const [suggestedQuestions, setSuggestedQuestions] = useState([]);
//   const [answers, setAnswers] = useState({}); // Store answers keyed by question index
//   const [loadingAnswerIndex, setLoadingAnswerIndex] = useState(null); // Track which question's answer is loading

//   // Get page title on mount (Optional)
//   useEffect(() => {
//     if (chrome?.tabs) {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         // const currentTab = tabs?.[0];
//       });
//     } else {
//       console.warn("Chrome tabs API not available.");
//     }
//   }, []);

//   // --- API CALLS ---
//   // Updated: Retrieve current tab's URL instead of reading from cookies
//   const getSummaryFromApi = async () => {
//     // Wrap chrome.tabs.query in a Promise to get the active tab's URL
//     const url = await new Promise((resolve, reject) => {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const currentTab = tabs && tabs[0];
//         if (!currentTab || !currentTab.url) {
//           return reject(new Error('Page URL not found.'));
//         }
//         resolve(currentTab.url);
//       });
//     });

//     const response = await fetch('http://localhost:8000/summarize', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       // Send the URL and an empty content field so that the API can scrape if needed
//       body: JSON.stringify({ url, content: "" }),
//     });
//     if (!response.ok) {
//       throw new Error(`API error: ${response.status} ${response.statusText}`);
//     }
//     const data = await response.json();
//     // Assuming API returns { summary: string }
//     return data.summary;
//   };

//   const getQuestionsFromApi = async () => {
//     console.log("Simulating getQuestionsFromApi...");
//     await new Promise(resolve => setTimeout(resolve, 500));
//     return [
//       "What is the purpose of the 'NextGenAI Stories' section?",
//       "What is the relationship between Lyndon Barrios & Sara Leo?",
//       "How is ChatGPT being used in the 'custom math tutor'?"
//     ];
//   };

//   const getAnswerForQuestion = async (question) => {
//     console.log("Simulating getAnswerForQuestion:", question);
//     setError('');
//     await new Promise(resolve => setTimeout(resolve, 900));
//     if (question.includes("NextGenAI")) return "The 'NextGenAI Stories' section likely showcases real-world applications and user testimonials related to the AI technology discussed on the page. It aims to provide concrete examples and build credibility.";
//     if (question.includes("Barrios")) return "Information regarding the specific relationship between Lyndon Barrios and Sara Leo is not available in the provided context. This might require accessing external data or specific knowledge bases not covered in the summary.";
//     if (question.includes("math tutor")) return "ChatGPT is likely used in the custom math tutor example as the core conversational engine, providing explanations, generating practice problems, offering step-by-step guidance, and adapting to the student's learning pace based on their input.";
//     return `Could not find a specific answer for "${question}" in this simulation. Further details might be needed.`;
//   };

//   // --- Handlers ---
//   const handleSummarize = async () => {
//     console.log("Summarizer: [handleSummarize] Start.");
//     setIsLoading(true);
//     setError(''); setSummary(''); setSuggestedQuestions([]); setAnswers({}); setLoadingAnswerIndex(null);
//     try {
//       // Optionally: scrape text if needed (e.g., const pageText = scrapeText(); )
//       const result = await getSummaryFromApi();
//       setSummary(result);
//     } catch (err) {
//       setError(`Summarization error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSuggestQuestions = async () => {
//     console.log("Summarizer: [handleSuggestQuestions] Start.");
//     setIsLoading(true); setError(''); setSuggestedQuestions([]); setAnswers({});
//     try {
//       const result = await getQuestionsFromApi();
//       setSuggestedQuestions(result);
//     } catch (err) {
//       setError(`Error fetching questions: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleQuestionItemClick = async (question, index) => {
//     console.log("Summarizer: [handleQuestionItemClick] Start for index:", index, question);
//     setLoadingAnswerIndex(index); setError(''); setAnswers(prev => ({ ...prev, [index]: undefined }));
//     try {
//       const answer = await getAnswerForQuestion(question);
//       setAnswers(prev => ({ ...prev, [index]: answer }));
//     } catch (err) {
//       setError(`Error fetching answer: ${err.message}`);
//       setAnswers(prev => ({ ...prev, [index]: undefined }));
//     } finally {
//       setLoadingAnswerIndex(null);
//     }
//   };

//   const handleCopySummary = () => {
//     if (summary) {
//       navigator.clipboard.writeText(summary)
//         .then(() => console.log("Summary copied!"))
//         .catch(err => console.error("Failed to copy summary:", err));
//     }
//   };

//   return (
//     <div className="summarizer-container">
//       <div className="page-info-header">
//         <span>Llama 3.38B by Meta</span>
//         <FaInfoCircle className="info-icon-header" title="Model Information" />
//       </div>

//       <button onClick={handleSummarize} disabled={isLoading} className="summarize-button primary-action-button">
//         {isLoading && !summary && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a) ? 'Summarizing...' : 'Summarize this page'}
//       </button>

//       {error && <p className="error-message">{error}</p>}

//       {summary && (
//         <div className="summary-output">
//           <div className="summary-text-container">
//             {summary.split('\n').map((line, idx) => {
//               if (line.startsWith('### ')) return <h3 key={idx} className="summary-h3">{line.substring(4)}</h3>;
//               if (line.startsWith('**')) return <p key={idx} className="summary-strong">{line.substring(2, line.length - (line.endsWith('**') ? 2 : 0))}</p>;
//               if (line.startsWith('*   ')) return <li key={idx} className="summary-li">{line.substring(4)}</li>;
//               if (line.startsWith('*Note:*')) return <p key={idx} className="summary-note"><em>{line.substring(1)}</em></p>;
//               if (line.trim() === '') return <br key={idx} />;
//               return <p key={idx}>{line}</p>;
//             })}
//           </div>
//           <div className="summary-actions">
//             <button className="action-button" onClick={handleCopySummary}><FaCopy /> Copy</button>
//             <button className="action-button"><FaEdit /> Edit</button>
//             <button className="action-button"><FaThumbsUp /> Like</button>
//             <button className="action-button"><FaThumbsDown /> Dislike</button>
//           </div>
//         </div>
//       )}

//       {(summary || (!isLoading && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a))) && (
//         <div className="summarizer-suggestion-area">
//           <button
//             className="suggestion-button-followup"
//             onClick={handleSuggestQuestions}
//             disabled={isLoading}
//           >
//             <IoChatbubbleEllipsesOutline className="suggestion-icon" /> Suggest questions ?
//           </button>
//         </div>
//       )}

//       {suggestedQuestions.length > 0 && (
//         <div className="questions-list-container">
//           {suggestedQuestions.map((question, index) => (
//             <React.Fragment key={index}>
//               <button
//                 className="question-item-button"
//                 onClick={() => handleQuestionItemClick(question, index)}
//                 disabled={loadingAnswerIndex === index || !!answers[index]}
//               >
//                 {question}
//               </button>
//               {loadingAnswerIndex === index && <p className="loading-indicator answer-loading">Fetching answer...</p>}
//               {answers[index] && loadingAnswerIndex !== index && (
//                 <div className="summary-output answer-output question-answer">
//                   <div className="summary-text-container">
//                     <p>{answers[index]}</p>
//                   </div>
//                 </div>
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//       )}

//       {isLoading && !summary && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a) && <p className="loading-indicator">Processing...</p>}
//     </div>
//   );
// }

// export default Summarizer;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useState, useEffect } from 'react';
import './Summarizer.css';
// --- Import Icons ---
import { FaInfoCircle, FaEdit, FaThumbsUp, FaThumbsDown, FaCopy } from 'react-icons/fa'; // Header info, Summary Actions + Copy
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'; // Suggestion button icon
 
// Utility: Read a cookie by name (not used now, kept as-is)
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}
 
// Function to inject into the target page (Ensure this exists and works)
function scrapeText() {
  // Keep your existing scrapeText logic
  return document.body.innerText || ''; // Return empty string if no text
}
 
function Summarizer() {
  // State for summary text, loading, error, and questions/answers
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Use one loading state for all async actions
  const [error, setError] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // Store answers keyed by question index
  const [loadingAnswerIndex, setLoadingAnswerIndex] = useState(null); // Track which question's answer is loading
 
  // Get page title on mount (Optional)
  useEffect(() => {
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // const currentTab = tabs?.[0];
      });
    } else {
      console.warn("Chrome tabs API not available.");
    }
  }, []);
 
  // --- API CALLS ---
  // Updated: Retrieve current tab's URL instead of reading from cookies
  const getSummaryFromApi = async () => {
    // Wrap chrome.tabs.query in a Promise to get the active tab's URL
    const url = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs && tabs[0];
        if (!currentTab || !currentTab.url) {
          return reject(new Error('Page URL not found.'));
        }
        resolve(currentTab.url);
      });
    });
 
    const response = await fetch('http://localhost:8000/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Send the URL and an empty content field so that the API can scrape if needed
      body: JSON.stringify({ url, content: "" }),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    // Assuming API returns { summary: string }
    return data.summary;
  };
 
  const getQuestionsFromApi = async () => {
    const url = await new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs?.[0];
        if (!currentTab?.url) {
          return reject(new Error("Page URL not found."));
        }
        resolve(currentTab.url);
      });
    });
  
    const response = await fetch('http://localhost:8000/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, content: "" })  // we scrape in backend
    });
  
    if (!response.ok) {
      throw new Error(`Question generation API error: ${response.status}`);
    }
  
    const data = await response.json();
    return data.questions;
  };
  
 
  // const getAnswerForQuestion = async (question) => {
  //   console.log("Simulating getAnswerForQuestion:", question);
  //   setError('');
  //   await new Promise(resolve => setTimeout(resolve, 900));
  //   if (question.includes("NextGenAI")) return "The 'NextGenAI Stories' section likely showcases real-world applications and user testimonials related to the AI technology discussed on the page. It aims to provide concrete examples and build credibility.";
  //   if (question.includes("Barrios")) return "Information regarding the specific relationship between Lyndon Barrios and Sara Leo is not available in the provided context. This might require accessing external data or specific knowledge bases not covered in the summary.";
  //   if (question.includes("math tutor")) return "ChatGPT is likely used in the custom math tutor example as the core conversational engine, providing explanations, generating practice problems, offering step-by-step guidance, and adapting to the student's learning pace based on their input.";
  //   return `Could not find a specific answer for "${question}" in this simulation. Further details might be needed.`;
  // };

  // --- Handlers ---
  const handleSummarize = async () => {
    console.log("Summarizer: [handleSummarize] Start.");
    setIsLoading(true);
    setError(''); setSummary(''); setSuggestedQuestions([]); setAnswers({}); setLoadingAnswerIndex(null);
    try {
      // Optionally: scrape text if needed (e.g., const pageText = scrapeText(); )
      const result = await getSummaryFromApi();
      setSummary(result);
    } catch (err) {
      setError(`Summarization error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleSuggestQuestions = async () => {
    console.log("Summarizer: [handleSuggestQuestions] Start.");
    setIsLoading(true); setError(''); setSuggestedQuestions([]); setAnswers({});
    try {
      const result = await getQuestionsFromApi();
      setSuggestedQuestions(result);
    } catch (err) {
      setError(`Error fetching questions: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleQuestionItemClick = async (question, index) => {
    console.log("Summarizer: [handleQuestionItemClick] Start for index:", index, question);
    setLoadingAnswerIndex(index); setError(''); setAnswers(prev => ({ ...prev, [index]: undefined }));
    try {
      const answer = await getAnswerForQuestion(question);
      setAnswers(prev => ({ ...prev, [index]: answer }));
    } catch (err) {
      setError(`Error fetching answer: ${err.message}`);
      setAnswers(prev => ({ ...prev, [index]: undefined }));
    } finally {
      setLoadingAnswerIndex(null);
    }
  };
 
  const handleCopySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary)
        .then(() => console.log("Summary copied!"))
        .catch(err => console.error("Failed to copy summary:", err));
    }
  };
 
  return (
    <div className="summarizer-container">
      <div className="page-info-header">
        <span>Llama 3.38B by Meta</span>
        <FaInfoCircle className="info-icon-header" title="Model Information" />
      </div>
 
      <button onClick={handleSummarize} disabled={isLoading} className="summarize-button primary-action-button">
        {isLoading && !summary && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a) ? 'Summarizing...' : 'Summarize this page'}
      </button>
 
      {error && <p className="error-message">{error}</p>}
 
      {summary && (
        <div className="summary-output">
          <div className="summary-text-container">
            {summary.split('\n').map((line, idx) => {
              if (line.startsWith('### ')) return <h3 key={idx} className="summary-h3">{line.substring(4)}</h3>;
              if (line.startsWith('**')) return <p key={idx} className="summary-strong">{line.substring(2, line.length - (line.endsWith('**') ? 2 : 0))}</p>;
              if (line.startsWith('*   ')) return <li key={idx} className="summary-li">{line.substring(4)}</li>;
              if (line.startsWith('*Note:*')) return <p key={idx} className="summary-note"><em>{line.substring(1)}</em></p>;
              if (line.trim() === '') return <br key={idx} />;
              return <p key={idx}>{line}</p>;
            })}
          </div>
          <div className="summary-actions">
            <button className="action-button" onClick={handleCopySummary}><FaCopy /> Copy</button>
            <button className="action-button"><FaEdit /> Edit</button>
            <button className="action-button"><FaThumbsUp /> Like</button>
            <button className="action-button"><FaThumbsDown /> Dislike</button>
          </div>
        </div>
      )}
 
      {/* {(summary || (!isLoading && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a))) && (
        <div className="summarizer-suggestion-area">
          <button
            className="suggestion-button-followup"
            onClick={handleSuggestQuestions}
            disabled={isLoading}
          >
            <IoChatbubbleEllipsesOutline className="suggestion-icon" /> Suggest questions ?
          </button>
        </div>
      )} */}
 
      {suggestedQuestions.length > 0 && (
        <div className="questions-list-container">
          {suggestedQuestions.map((question, index) => (
            <React.Fragment key={index}>
              <button
                className="question-item-button"
                onClick={() => handleQuestionItemClick(question, index)}
                disabled={loadingAnswerIndex === index || !!answers[index]}
              >
                {question}
              </button>
              {loadingAnswerIndex === index && <p className="loading-indicator answer-loading">Fetching answer...</p>}
              {answers[index] && loadingAnswerIndex !== index && (
                <div className="summary-output answer-output question-answer">
                  <div className="summary-text-container">
                    <p>{answers[index]}</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
 
      {isLoading && !summary && suggestedQuestions.length === 0 && !Object.values(answers).some(a => a) && <p className="loading-indicator">Processing...</p>}
    </div>
  );
}
 
export default Summarizer;