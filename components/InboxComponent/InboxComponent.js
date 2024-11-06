import React, { useState, useEffect } from "react";
import { ref, onValue, push, set, get } from "firebase/database";
import { database } from "../../lib/firebaseConfig";
import classes from "./InboxComponent.module.css";
import { useUser } from "../../context/UserContext";
import { LuLoader } from "react-icons/lu";

const InboxComponent = ({ chatId = null, recipientInfos = null }) => {
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(chatId);
  const [recipientInfo, setRecipientInfo] = useState(null); // State to hold recipient info
  const { userId } = useUser();
  const [searchTerm, setSearchTerm] = useState("");

  const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Today | ${messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else if (isYesterday) {
      return `Yesterday | ${messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else {
      return `${messageDate.toLocaleDateString()} | ${messageDate.toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit", hour12: true }
      )}`;
    }
  };

  // Helper function to get user name and profile image by userId
  const fetchUserInfo = async (userId) => {
    const userRef = ref(database, `users/${userId}/inputfields`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const { displayName, profileImage } = snapshot.val();
      return {
        name: displayName || "Unknown User",
        image: profileImage || "/Images/inbox.png",
      };
    }
    return { name: "Unknown User", image: "/Images/inbox.png" };
  };

  // Fetch list of chats for the current user
  useEffect(() => {
    setLoading(true);
    const fetchChatList = async () => {
      const chatListRef = ref(database, `userChats/${userId}`);
      onValue(chatListRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formattedChatList = await Promise.all(
            Object.keys(data).map(async (chatId) => {
              const chatData = data[chatId];
              const recipientId = chatData.recipientId;
              const recipientInfo = await fetchUserInfo(recipientId); // Fetch both name and image
              return {
                chatId,
                recipientId,
                recipientName: recipientInfo.name,
                recipientImage: recipientInfo.image, // Add image here
                lastMessage: chatData.lastMessage,
                timestamp: chatData.timestamp,
              };
            })
          );
          setChatList(formattedChatList);
          setLoading(false);
        }
      });
    };

    fetchChatList();
  }, [userId]);

  // Update recipient info whenever selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      const selectedChatData = chatList.find(
        (chat) => chat.chatId === selectedChat
      );
      if (selectedChatData) {
        setRecipientInfo({
          name: selectedChatData.recipientName,
          image: selectedChatData.recipientImage, // Set recipient image from chat data
        });
      }
    }
  }, [selectedChat, chatList]);

  // Fetch messages for the selected chat
  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = () => {
        const messagesRef = ref(database, `messages/${selectedChat}`);
        onValue(messagesRef, (snapshot) => {
          const data = snapshot.val();
          const loadedMessages = [];
          for (let key in data) {
            loadedMessages.push({ id: key, ...data[key] });
          }
          setMessages(loadedMessages);
        });
      };
      fetchMessages();
    }
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
  
    const messageData = {
      senderId: userId,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
  
    const messagesRef = ref(database, `messages/${selectedChat}`);
    const newMessageRef = push(messagesRef);
    set(newMessageRef, messageData);
  
    const recipientId = selectedChat.replace(userId, "").replace("_", "");
  
    // Update the current user’s chat list
    const userChatRef = ref(database, `userChats/${userId}/${selectedChat}`);
    set(userChatRef, {
      recipientId,
      lastMessage: newMessage,
      timestamp: messageData.timestamp,
    });
  
    // Update the recipient’s chat list (for first-time messaging)
    const recipientChatRef = ref(database, `userChats/${recipientId}/${selectedChat}`);
    get(recipientChatRef).then((snapshot) => {
      if (!snapshot.exists()) {
        set(recipientChatRef, {
          recipientId: userId,
          lastMessage: newMessage,
          timestamp: messageData.timestamp,
        });
      }
    });
  
    // Update chatList state
    setChatList((prevChatList) =>
      prevChatList.map((chat) =>
        chat.chatId === selectedChat
          ? { ...chat, lastMessage: newMessage, timestamp: messageData.timestamp }
          : chat
      )
    );
  
    setNewMessage("");
  };
  
  return (
    <div className={classes.container}>
      {/* Left Sidebar */}
      <div className={classes.sidebar}>
        <h3>All Messages</h3>
        <input
          type="text"
          placeholder="Search or start a new chat"
          className={classes.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isLoading && chatList.length > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <LuLoader style={{ width: "50px", height: "50px" }} />
          </div>
        ) : (
          <div className={classes.chatList}>
            {chatList
              .filter((chat) =>
                chat.recipientName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((chat) => (
                <div
                  key={chat.chatId}
                  className={`${classes.chatItem} ${
                    selectedChat === chat.chatId ? classes.activeChat : ""
                  }`}
                  onClick={() => setSelectedChat(chat.chatId)}
                >
                  <img
                    src={chat.recipientImage}
                    alt="Profile"
                    className={classes.profilePic}
                  />
                  <div className={classes.chatInfo}>
                    <h4>{chat.recipientName}</h4>
                    <p>{chat.lastMessage}</p>
                    <span>{formatTimestamp(chat.timestamp)}</span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Right Chat Area */}
      <div className={classes.chatArea}>
        {selectedChat ? (
          <>
            <div
              className={classes.chatHeader}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={recipientInfo?.image || "/Images/inbox.png"}
                alt={
                  recipientInfo?.name
                    ? recipientInfo?.name
                    : recipientInfos?.name || "User"
                }
                className={classes.profilePic}
              />
              <h4>
                {recipientInfo?.name
                  ? recipientInfo?.name
                  : recipientInfos?.name || "User"}
              </h4>
            </div>
            <div className={classes.messages}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`${classes.message} ${
                    msg.senderId === userId
                      ? classes.ownMessage
                      : classes.otherMessage
                  }`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      msg.senderId === userId ? "flex-end" : "flex-start",
                    maxWidth: "70%",
                    padding: "8px",
                    marginBottom: "10px",
                    position: "relative",
                  }}
                >
                  <p
                    style={{
                      backgroundColor:
                        msg.senderId === userId ? "#4f9ded" : "#e6f4ff",
                      color: msg.senderId === userId ? "white" : "black",
                      padding: "10px",
                      borderRadius: "15px",
                      margin: 0,
                      wordWrap: "break-word",
                      maxWidth: "100%",
                    }}
                  >
                    {msg.text}
                  </p>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "gray",
                      marginTop: "5px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
              ))}
            </div>
            <div className={classes.messageInputArea}>
              <input
                type="text"
                placeholder="Type your message here ..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className={classes.chatHeader}
          >
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxComponent;
