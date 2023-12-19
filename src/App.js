import React, { useState, useEffect } from "react";
import './App.css';

const API_KEY = ""; //put your api key here

const App = () => {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [questionType, setQuestionType] = useState("conceptual");
    const [message, setMessage] = useState('');
    
    function formatMessage(message) {
        return message.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
        ))
    }

    async function processMessage(s, t, qtype) {
        
        const systemMessage = {
            role: "system",
            content: "Talk to me as if I am a " + s + "student."
        }

        const apiMessage = {
            role: "user",
            content: "Generate three practice question about " + t + "that have " + qtype + "answers. After showing all the questions, show an answer key with solutions and explainations to all the questions, and verify that the answers are correct. Leave some blank space between the questions and the answer key."
        }

        const apiRequestBody = {
            "model": "gpt-4-1106-preview", //change this to the best model that is available to you
            'max_tokens': 1000,
            'messages': [
                systemMessage, apiMessage
                ]
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data);
            console.log(data.choices[0].message.content);
            setMessage(data.choices[0].message.content);
        });
    }

    return (
        <div>
            <div className="app">
                <h1>BrainSpark</h1>
            </div>

            <div className="col">    
                <h2>Subject:</h2>
                <div className="search">
                    <input
                        placeholder="Ex: Algebra"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>        
            </div>
        
            <div className="col">
                <h2>Specific Topic:</h2>
                <div className="search">
                    <input
                        placeholder="Ex: slope of a line"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                </div>
            </div>
            <div className="col">
                <h2>Select type of question:</h2>
                <select 
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                >
                    <option value="conceptual" defaultValue>conceptual</option>
                    <option value="numerical">numerical</option>
                    <option value="mc conceptual">multiple choice conceptual</option>
                    <option value="mc numerical">multiple choice numerical</option>
                    {/* Add as many options as you want */}
                </select>                
                
            </div>
            <div>
                <button onClick={async () => await processMessage(subject, topic, questionType)}>Generate</button>
            </div>

            <div>
                <p>{formatMessage(message)}</p>
            </div>
            
            
        </div>
    );
}

export default App;