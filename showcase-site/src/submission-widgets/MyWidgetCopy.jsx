import React, { useState , useEffect} from 'react';
import ICAL from "ical.js";
import axios from "axios";


const MyWidgetCopy = () => {
  const [ file, setFile ] = useState(null);
  const [ friends, setFriends ] = useState([]);
  const [ progress, setProgress ] = useState({started: false, pc: 0});
  const [ msg, setMsg ] = useState("");
  const [ cal, setCal ] = useState("");

  useEffect(() => {
    if (cal) {
      showTimetable();
    }
  }, [cal]);

  function showTimetable() {
    console.log("yes");
    if (!cal) {
      return;
    }
    var jcalData = ICAL.parse(cal);
    var comp = new ICAL.Component(jcalData);
    var vevent = comp.getFirstSubcomponent("vevent");
    var event = new ICAL.Event(vevent);
    var summary = event.summary;
    console.log(summary);
  }
  function handleUpload() {
    if (!file) {
      setMsg("no file selected");
      return;
    }
    const fd = new FormData();
    fd.append('file', file);

    setMsg("Uploading...");
    setProgress(prevState => {
      return {...prevState, started:true}
    })
    axios.post('http://httpbin.org/post', fd, {
      onUploadProgress: (progressEvent) => { setProgress(prevState => { 
      return {...prevState, pc: progressEvent.progress*100}
      }) },
      headers: {
        "Custom-Header": "value",
      }
    })
    .then(res => {
      setMsg("Upload successful");
      setCal(res.data.files.file.toString());
      
      //console.log(res.data.files.file);
    })
    .catch(err => {
      setMsg("Error");
      console.error(err);
    });
  }
  //console.log(mycal);
  //

  

  return (
    <div className="p-6 mx-auto bg-white rounded-xl shadow-lg max-w-[9000px]">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Upload file</h2>
        <input type="text" placeholder="Enter name" className="flex-1 p-2 rounded text-white"/>

        <div className="text-2xl font-bold text-blue-600">
          {msg}
        </div>
        <div className="flex justify-center">
          
          <input onChange ={(e) => {setFile(e.target.files[0])} } type="file" accept=".ics" className ="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors" />
          <button onClick={handleUpload} className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
            Upload ICS file
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyWidgetCopy;


