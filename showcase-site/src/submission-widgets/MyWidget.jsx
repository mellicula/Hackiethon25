import React, { useState , useEffect} from 'react';
import ICAL from "ical.js";
import axios from "axios";


const MyWidget = () => {
  const [ file, setFile ] = useState(null);
  const [ progress, setProgress ] = useState({started: false, pc: 0});
  const [ msg, setMsg ] = useState("");

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
      setMsg("Upload successfull");
      console.log(res.data);
    })
    .catch(err => {
      setMsg("Error");
      console.error(err);
    });
  }
  //console.log(mycal);

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Upload file</h2>

        <div className="text-2xl font-bold text-blue-600">
          {msg}
        </div>

        <div className="flex justify-center">
          <input onChange ={(e) => {setFile(e.target.files[0])} } type="file"/>
          <button onClick={handleUpload} className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
            Upload ICS file
          </button>
          {progress.started && <progress max ="100" value={progress.pc}></progress> }
        </div>
      </div>
    </div>
  );
};

export default MyWidget;


