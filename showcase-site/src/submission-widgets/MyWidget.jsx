// real one <3
import React, { useState , useEffect} from 'react';
import ICAL from "ical.js";


const MyWidget = () => {
  const [ friends, setFriends ] = useState([]);
  const [ name, setName ] = useState("");
  const [ file, setFile ] = useState(null);
  const [ cal, setCal ] = useState("");
  const [ msg, setMsg ] = useState("");
  const [ gen, setGen ] = useState(null);
  const [ date, setDate ] = useState(null);


  function handleUpload() {
    if (!file || !name) {
      setMsg("Please add a name and upload a file/url!");
      return;
    }
    setMsg("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jcalData = ICAL.parse(event.target.result);
        const comp = new ICAL.Component(jcalData);
        setFriends(prev => [...prev, { name, attendsLectures: false, jcalData: comp }]);
        setName("");
        setFile(null);
        setMsg("success!");
        document.getElementById("file-input").value = "";
      } catch (error) {
        setMsg("idkkk");
      }
    };
    reader.readAsText(file);

  }

  function checkbox(index) {
    setFriends(prev => prev.map((friend, i) => 
      i === index ? { ...friend, attendsLectures: !friend.attendsLectures } : friend
      ));
  }


  
return (
    <div className = "max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <input type="text" placeholder="group name" className="font-bold text-center"/>
      <div className="flex mb-4">
        <input
          type = "text"
          placeholder = "friend name here"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 p-2 rounded text-white"
        />

        <input
          id = "file-input"
          onChange = {(e) => {setFile(e.target.files[0])} }
          type = "file"
          accept=".ics"
          className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
        />

        <input
          type="date"
          onChange={(e) => {setDate(e.target.value)} }
        />

        <button
          onClick={handleUpload}
          className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Upload ICS file
        </button>
      </div>

      {msg && <p className="text-red-400 mb-2">{msg}</p>}
      <h2 className = ""> Friends List </h2>
      <ul className="list-disc pl-6">
        {friends.map((friend, index) => (
          <li key={index} className="flex justify-between p-2 border-b">
            <span>{friend.name}</span>
            <span className="text-sm text-gray-400">📅 {friend.jcalData.getAllSubcomponents("vevent").length} events</span>
            <input
              type="checkbox" 
              id={index} 
              name={index}
              checked={friend.attendsLectures}
              value="Lecture" 
              onChange={() => toggleAttendance(index)}
              />
          </li>
        ))}
      </ul>
      <button 
        onClick={() => setGen((prev) => !prev)}
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
        {gen ? "Hide Tables" : "Show Tables"}
      </button>
      {gen && (
        <div className="p-4 bg-gray-800 rounded-lg">
          {friends.map((friend, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">{friend.name}'s Events</h3>
              <ul className="list-disc pl-6">
                {friend.jcalData.getAllSubcomponents("vevent").map((vevent, i) => (
                  <li key={i} className="p-2 border-b">
                    <span>{vevent.getFirstPropertyValue("summary") || "No Title"}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWidget;

/* Project Plan
 *
 * can add multiple friends' ics files and store the parsed
 * jcalData or whatever is easiest to query on.
 *
 * all of this should get added as a list in friends every
 * time you upload a file and a name.
 *
 */
