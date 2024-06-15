import { ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import { useEffect, useState } from "react";
 

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [thm, setThm] = useState(true);

  useEffect(() => {
    const apiKey = window.localStorage.getItem("api-key");
    if (!apiKey) {
      setModalOpen(true);
    }
    if (localStorage.getItem('theme') === 'light') setThm(false);
    
  }, []);
  return (
    <ChatContextProvider>
      <div className="flex transition duration-500 ease-in-out">
        <SideBar setThm={setThm} />
        <ChatView thm={thm}/>
      </div>
    </ChatContextProvider>
  );
};

export default App;
