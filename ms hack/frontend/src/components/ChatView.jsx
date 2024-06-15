import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { ChatContext } from "../context/chatContext";
import Thinking from "./Thinking";
import { MdSend } from "react-icons/md";
import { replaceProfanities } from "no-profanity";
import axios from 'axios';
import Select from 'react-select';
import symptoms from '../assets/symptoms.js'; // Make sure this path is correct
  
const template = [
  {
    title: "How to use",
    prompt: "Welcome to our Health Care Chatbot! Simply enter your symptoms in the chat box, and our intelligent assistant will provide possible diagnoses and helpful information. Please note, this tool is for informational purposes and not a substitute for professional medical advice. For serious concerns, consult a healthcare provider. We're here to assist you 24/7.",
  },
];

const ChatView = ({thm}) => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState(false);
   
  const [messages, addMessage, clearChat, deleteMessage, sliceMessages] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEmptyResponse, setIsEmptyResponse] = useState(false); // State to track empty response
  const flagRef = useRef(1);
  
  // Listen for changes in localStorage 
   
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const slowScrollToBottom = () => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      const scrollStep = 5;
      const scrollInterval = setInterval(() => {
        if (chatContainer.scrollTop + chatContainer.clientHeight < chatContainer.scrollHeight) {
          chatContainer.scrollTop += scrollStep;
        } else {
          clearInterval(scrollInterval);
        }
      }, 16);  
    }
  };
  const updateMessage = async (newValue, ai = false, selected, showSatisfactionPrompt = false) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      showSatisfactionPrompt: showSatisfactionPrompt,
      selected: `${selected}`,
    };
    await addMessage(newMsg);
  };

  const handleSatisfactionResponse = async (messageId, satisfied) => {
    const index = messages.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      if (satisfied) {
        flagRef.current = 1;
        setThinking(false);
        await sliceMessages(index);
      } else {
        await deleteMessage(messageId);
      }
    }
    scrollToBottom();
  };
 
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: thm ? '#1f2937' : '#f3f4f6', // Dark or light background
      borderColor: thm ? '#374151' : '#e5e7eb',     // Dark or light border
      color: 'hsl(var(--nc) / var(--tw-text-opacity))', // Custom text color
      minHeight: '3rem',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: thm ? '#1f2937' : '#f3f4f6', // Dark or light background
      color: 'hsl(var(--nc) / var(--tw-text-opacity))', // Custom text color
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: thm ? '#374151' : '#e5e7eb', // Dark or light background
      color: 'hsl(var(--nc) / var(--tw-text-opacity))', // Custom text color
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'hsl(var(--nc) / var(--tw-text-opacity))', // Custom text color
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'hsl(var(--nc) / var(--tw-text-opacity))', // Custom text color
      ':hover': {
        backgroundColor: thm ? '#4b5563' : '#d1d5db', // Dark or light hover background
        color: thm ? '#f9fafb' : '#1f2937',          // Dark or light text color
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? (thm ? '#374151' : '#d1d5db') : (thm ? '#1f2937' : '#f3f4f6'), // Selected or normal background
      color: 'hsl(var(--nc) / var(--tw-text-opacity))', // Custom text color
      ':hover': {
        backgroundColor: thm ? '#4b5563' : '#d1d5db', // Dark or light hover background
        color: '#f9fafb',           // Tailwind text color (gray-50)
      },
    }),
    input: (provided) => ({
      ...provided,
      color: 'hsl(var(--nc) / var(--tw-text-opacity))', // Custom input text color
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'hsl(var(--nc) / var(--tw-text-opacity))', // Custom single value color
    }),
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const cleanPrompt = replaceProfanities(formValue.map(item => item.label).join(", "));
    const req =  formValue.map(item => item.label);
    const aiModel = selected;
    const requestData = { symptoms: req };
    flagRef.current = 0;
    setThinking(true);
    setFormValue([]);
    await updateMessage(cleanPrompt, false, aiModel);

    try {
     
      const response = await axios.post('http://127.0.0.1:4000/predict/', requestData);
      const { result, value_input, message } = response.data;

      if (!result || !Array.isArray(result) || result.length === 0) {
        // Set state to true for empty response
       
        setThinking(false);
        return; // Exit early if response is empty
      }

       // Reset state if response is not empty

      for (let diagnosis of result) {
        if (flagRef.current === 1) break;
             
        let trimmedDiagnose = diagnosis.diagnose.trim();
        if (trimmedDiagnose.includes('\u000b')) {
          trimmedDiagnose = trimmedDiagnose.substring(0, trimmedDiagnose.indexOf('\u000b')).trim();
        }

        try {
          const dataResponse = await axios.post('http://127.0.0.1:4000/get_data', { term: trimmedDiagnose });
          const { medlineplus_data } = dataResponse.data[0];
          if (medlineplus_data && medlineplus_data.entries && medlineplus_data.entries.length > 0) {
            const firstEntry = medlineplus_data.entries[0];
            
            const detailedInfo = `I have identified a possible diagnosis for your symptoms: ${firstEntry.title}. Here are some details: ${firstEntry.summary}`;

            if (flagRef.current === 1) break;
            await updateMessage(detailedInfo, true, aiModel, false);
           
            await updateMessage(
              `Based on the information provided, do you feel that ${firstEntry.title} accurately describes your symptoms? If not, we can explore other possibilities.`,
              true,
              aiModel,
              true
            );
            if (flagRef.current === 1) break;
          }
        } catch (err) {
          console.error(`Error fetching data for diagnosis ${trimmedDiagnose}:`, err.message);
        }
      }
      if (flagRef.current == 0) {
        await updateMessage(
          `We're sorry, but we couldn't identify a specific condition based on the symptoms provided. Please review and select your symptoms carefully, or consider consulting with a healthcare professional for a more accurate diagnosis. Your well-being is important to us.`,
          true,
          aiModel,
          false
        );
        flagRef.current = 1;
    }

      console.log(value_input);
      console.log(message);
    } catch (err) {
      console.error('Error:', err.message);
      window.alert(`Error: ${err.message}. Please try again later.`);
    }
    
    setThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(e);
    }
  };

  useEffect(() => {
    slowScrollToBottom();
  }, [thinking, messages]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const Compo = () => {
    let components = [];
    for (let index = 0; index < messages.length; index++) {
      const message = messages[index];
      components.push(
        <Message key={index} message={{ ...message }} onSatisfactionResponse={handleSatisfactionResponse} />
      );
      if (message.showSatisfactionPrompt) break;
    }
    slowScrollToBottom();
    return components;
  };

  const symptomOptions = symptoms.map(symptom => ({ label: symptom, value: symptom }));

  return (
    <main className="w-[100vw] relative flex flex-col h-screen p-2 overflow-hidden dark:bg-light-grey">
      <section className="chat-container flex flex-col flex-grow w-full px-4 overflow-y-scroll sm:px-10 md:px-32 my-4">
        { 
          messages.length ? (
            <Compo />
          ) : (
            <div className="flex my-2 w-full">
              <div className="w-full">
                <ul className="gap-4 w-full mt-8">
                  {template.map((item, index) => (
                    <li key={index} className="p-6 border rounded-lg border-slate-300 hover:border-slate-500">
                      <p className="text-base font-semibold text-lg">{item.title}</p>
                      <p className="text-md">{item.prompt}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        }
        {thinking && <Thinking />}
        <span ref={messagesEndRef}></span>
      </section>
      <form className="flex flex-col px-10 mb-2 md:px-32 join sm:flex-row" onSubmit={sendMessage}>
        <div className="flex items-stretch justify-between w-full">
        <Select
  ref={inputRef}
  isMulti
  options={symptomOptions}
  className="w-full max-h-[20rem] bg-red dark:bg-light-grey"
  value={formValue}
  styles={customStyles}
  onChange={(selectedOptions) => setFormValue(selectedOptions)}
  placeholder="Enter symptoms"
            menuPlacement="top"
            isDisabled={flagRef.current === 0}
/>
          <button type="submit" className="join-item btn" disabled={formValue.length === 0}>
            <MdSend size={30} />
          </button>
        </div>
      </form>
    </main>
  );
};

export default ChatView;
