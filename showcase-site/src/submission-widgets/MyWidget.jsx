// real one <3
import React, { useState , useEffect} from 'react';
import ICAL from "ical.js";
import axios from "axios";


const MyWidget = () => {
  const [ friends, setFriends ] = useState([]);
  const [ name, setName ] = useState("");
  const [ file, setFile ] = useState(null);
  const [ url, setURL ] = useState("");
  const [ cal, setCal ] = useState("");
  const [ msg, setMsg ] = useState("");

  function handleUpload() {
    if ((!file && !url) || !name) {
      setMsg("Please add a name and upload a file/url!");
    }
    setMsg("");
    const fd = new FormData();
    fd.append('file', file);


  }

  
  return (
    <div className = "max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className = "font-bold text-center">Campus Calendar G1</h1>
      <div className="flex mb-4">
        <input
          type = "text"
          placeholder = "friend name here"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-2 rounded text-white"
        />
        <input
          type = "text"
          placeholder = "ical url"
          value={name}
          onChange={(e) => setURL(e.target.value)}
          className="flex-1 p-2 rounded bg-pink text-white"
        />

        <input
          onChange = {(e) => {setFile(e.target.files[0])} }
          type = "file"
          accept=".ics"
          className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
        />

        <button
          onClick={handleUpload}
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Upload ICS file
        </button>
      </div>

      {msg && <p className="text-red-400 mb-2">{msg}</p>}
    </div>
  );
};

export default MyWidget;

/* Project Plan
 *
 * 
 *
 *
 *
 *
 *
 *
 *
 *
 */
