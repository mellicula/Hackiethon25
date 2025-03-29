// real one <3
import React, { useState , useEffect} from 'react';
//import "./cc-styles.css";
import ICAL from "ical.js";


const MyWidget = () => {
  const [ friends, setFriends ] = useState([]);
  const [ name, setName ] = useState("");
  const [ file, setFile ] = useState(null);
  const [ cal, setCal ] = useState("");
  const [ msg, setMsg ] = useState("");
  const [ gen, setGen ] = useState(null);
  const [ date, setDate ] = useState(null);

  useEffect(() => {
    if (!date) {
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [date]);

  function getRandomMsg() {
    const msgs = ["another friend 😄😆", "🤩 the more the merrier 💗", "🤗 ur so popular", "🤨 interesting choice 🫣"]
    return msgs[Math.floor(Math.random() * msgs.length)]
  }


  function handleUpload() {
    if (!file || !name) {
      setMsg("Please add a name AND upload a file!");
      return;
    }
    setMsg("");

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jcalData = ICAL.parse(event.target.result);
        const comp = new ICAL.Component(jcalData);
        setFriends(prev => [...prev, { name, attendsLectures: true, jcalData: comp }]);
        setName("");
        setFile(null);
        setMsg(getRandomMsg());
        document.getElementById("file-input").value = "";
      } catch (error) {
        setMsg("idkkk man try smth else");
      }
    };
    reader.readAsText(file);

  }

  function checkbox(index) {
    setFriends(prev => prev.map((friend, i) => 
      i === index ? { ...friend, attendsLectures: !friend.attendsLectures } : friend
      ));
  }

  function getEvents(selectedDate) {
    allEvents = [];
    for (let i = 0; i<friends.length; i++) {
      friendEvents = filterByDate(friends[i].jcalData.getAllSubcomponents("vevent"), selectedDate, friends[i].attendsLectures);
      for (let j = 0; j<friendEvents.length; j++) {
        allEvents.push({name: friends[i].name, event: friendEvents[j]});
      }
    }
    return allEvents;
  }

  function filterByDate(events, selectedDate, skips) {
    return events.filter((vevent) => {
      const eventStart = vevent.getFirstPropertyValue("dtstart").toString().slice(0,10);
      if (!eventStart) return false;
      const icalTime = new ICAL.Time();
      icalTime.fromJSDate(new Date(eventStart.toString()), true);
      const eventDate = new Date(icalTime.toJSDate()).toISOString().slice(0, 10);
      return eventDate===selectedDate && (skips || !vevent.getFirstPropertyValue("summary").includes("Lecture"));
    });
  }

  function updateCell(row, col, ev, chck) {
    console.log("updated!!");
    console.log(row);
    console.log(col);
    console.log(ev.getFirstPropertyValue("summary"));
    const table = document.getElementById("timetable");
    const r = table.getElementsByTagName("tr")[row+1];
    const cell = r.getElementsByTagName("td")[col];
    if (cell) {
      if (chck) cell.textContent = ev.getFirstPropertyValue("summary");
      cell.style.backgroundColor = "#152f6b";
    }
  }

  function createTable() {
    var table = document.getElementById("timetable");
    while (table.firstChild) table.removeChild(table.firstChild);
    table.classList.add("test")

    // each row is a time, each column is a person.
    var headerRow = document.createElement("tr");
    var th = document.createElement("th");
    var h = document.createElement("h1");
    h.textContent = "Times";
    th.appendChild(h);
    headerRow.appendChild(th);
    console.log("friends:");
    console.log(friends.length);
    var times = Array.from({ length: 11}, (_, i) => `${i+8}:00`);
    for (let i = 0; i<friends.length; i++) {
      var th = document.createElement("th");
      var h = document.createElement("h1");
      h.textContent = friends[i].name;
      th.appendChild(h);
      headerRow.appendChild(th);
    }

    table.appendChild(headerRow);

    times.forEach(time => {
      var row = document.createElement("tr");

      var timeCell = document.createElement("td");
      timeCell.textContent = time;
      row.appendChild(timeCell);

      for (var i = 0; i < friends.length; i++) {
          var td = document.createElement("td");
          td.style.pointerEvents = "none";  
          row.appendChild(td);
      }

      table.appendChild(row);
    });

    for (var i = 0; i<friends.length; i++) {
      var friendEvents = filterByDate(friends[i].jcalData.getAllSubcomponents("vevent"), date, friends[i].attendsLectures);
      for (var j = 0; j<friendEvents.length; j++) {
        // get the start hour of the event.
        // update row i and col hour-1 with the summary of event
        const event = new ICAL.Event(friendEvents[j]);
        //const eventStart = event.getFirstPropertyValue("dtstart").toString();
        const eventStart = event.startDate.toString();
        const eventHour = new Date(eventStart).getHours();
        const eventSummary = event.summary;

        const evnt = friendEvents[j]; 
        const evntStart = evnt.getFirstPropertyValue("dtstart").toString();
        const evntHour = new Date(evntStart).getHours();

        console.log(evntHour);
        console.log(event.duration.hours);
        console.log(evntHour);

        for (var tm = evntHour-8; tm < evntHour - 8+event.duration.hours; tm++) {
          updateCell(tm, i + 1, evnt, tm===evntHour-8);
        }

      }
    }
  }
  const style = document.createElement("style");
  style.innerHTML = `
    .widget {
      font-family: "Fira Code", mono;
    }
    .test {
      border: 1px solid #666666;
      text-align:center;
      margin-top: 40px;
      margin-bottom: 30px;
    }
    .test th, .test td {
      width: 100px; 
      text-align: center; 
    }
    .test th:nth-child(1), .test td:nth-child(1) {
      width: 60px; 
    }

    .test tr, .test td {
      height: 90px; /* Adjust the height as needed */
    }

  `;
  document.head.appendChild(style);










  function whenToMeet() {
    const allAv = [];

    for (var i = 0; i < friends.length; i++) {
      var friendsEvents = filterByDate(friends[i].jcalData.getAllSubcomponents("vevent"), date, friends[i].attendsLectures);
      var availability = (1 << 12) - 1; 

      for (var j = 0; j < friendsEvents.length; j++) {
        const event = friendsEvents[j]; 
        const eventStart = event.getFirstPropertyValue("dtstart").toString();
        const eventHour = new Date(eventStart).getHours();
        availability &= ~(1 << (eventHour - 8));  
      }
      allAv.push(availability);
    }

    let temp = (1 << 12) - 1;

    for (var i = 0; i < allAv.length; i++) {
      temp &= allAv[i]; 
    }

    const times = [];
    for (let hr = 8; hr < 19; hr++) {
      if ((temp & (1 << (hr - 8))) !== 0) {
        times.push(`${hr}:00`);
      }
    }

    return times;
  }


/*
  function switchFormat(events) {
    // currently events are per person. we want to order by start time.
    const allEvents = [];
    events.map(

  }*/


  
return (
  <div className= "widget max-w-4xl bg-gradient-to-r  from-emerald-900 via-indigo-700 to-blue-800 mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300" >
      <div className="max-h-400 p-4 bg-gray-900 rounded-lg mt-4">
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
            className="p-2 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200 transition-colors"
          />


          <button
            onClick={handleUpload}
            className="ml-2 bg-sky-500 text-white px-4 py-2 rounded hover:bg-indigo-300 transition">
            Upload ICS file
          </button>

        </div>

        {msg && <p className="text-green-400 mb-2">{msg}</p>}
        <h2 className = ""> Friends List </h2>
        <ul className="list-disc pl-6">
          {friends.map((friend, index) => (
            <li key={index} className="flex justify-between p-2 border-b">
              <span>{friend.name}</span>
              <input
                type="checkbox" 
                id={index} 
                name={index}
                checked={friend.attendsLectures}
                value="Lecture" 
                onChange={() => checkbox(index)}
                />
            </li>
          ))}
        </ul>
        <input
          type="date"
          value={date || new Date().toISOString().split("T")[0]}
          placeholder = "pick a date"
          onChange={(e) => {setDate(e.target.value)} }
        />
        <button 
          onClick={() => setGen(1)}
          className="ml-2 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          What's on {date}?
        </button>
        <button 
          onClick={() => {
            setGen(2);
          }}
          className="ml-2 bg-emerald-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Best times to meet
        </button>
        {gen===1 && (
          <div className="p-4 bg-gray-800 rounded-lg" style={{height: '600px', overflow: 'scroll'}}>
            {friends.map((friend, index) => {
              const evnts = friend.jcalData.getAllSubcomponents("vevent");
              const filtered = filterByDate(evnts, date, friend.attendsLectures);

              return (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold">🗓️ {friend.name}'s Events 🗓️</h3>
                  <ul className="list-disc pl-6">
                    {filtered.map((vevent, i) => (
                      <li key={i} className="p-2 border-b">
                        <span>{vevent.getFirstPropertyValue("summary") || "No Title"}</span>
                        <span>{" at " + vevent.getFirstPropertyValue("dtstart").toString().slice(11,16)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
        {gen===2 && (
          <div className="p-4 bg-gray-800 rounded-lg" style={{height: '600px', overflow: 'scroll'}}>
           <button 
              onClick={() => {
                setGen(2);
                createTable();
              }}
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              Generate the timetable!
            </button>

            <p className="text-blue-300">The best times to meet are</p>
            <p className="">
              {whenToMeet().map((time, i) => (
                  "🕰️ " + time + " 🕰️"
              ))}
            </p>
            <table id="timetable" className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            </table>
          </div>
        )}

      </div>
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
