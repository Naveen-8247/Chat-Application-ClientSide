import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import TableResponse from "./TableResponse";
import AnswerFeedback from "./AnswerFeedback";


export default function ChatWindow() {
const { sessionId } = useParams();
const [history, setHistory] = useState([]);
const [message, setMessage] = useState("");


useEffect(() => {
fetch(`http://localhost:5000/api/session/${sessionId}`)
.then(res => res.json())
.then(data => setHistory(data));
}, [sessionId]);


const sendMessage = () => {
fetch(`http://localhost:5000/api/chat/${sessionId}` , {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ question: message })
})
.then(res => res.json())
.then(newMsg => setHistory([...history, newMsg]));


setMessage("");
};


return (
<div>
<h2 className="text-xl font-bold mb-4">Chat Session: {sessionId}</h2>


{history.map((msg, index) => (
<div key={index} className="mb-4 p-4 bg-gray-200 dark:bg-gray-700 rounded">
<p><strong>You:</strong> {msg.question}</p>
<p className="mt-2"><strong>Bot:</strong> {msg.answer}</p>
<TableResponse table={msg.table} />
<AnswerFeedback />
</div>
))}


<ChatInput message={message} setMessage={setMessage} sendMessage={sendMessage} />
</div>
);
}