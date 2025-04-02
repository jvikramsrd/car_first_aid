import { useState } from "react";

function SoundRecorder() {
  const [audioURL, setAudioURL] = useState(null);

  const handleRecord = () => {
    // Implement recording logic here
    console.log("Recording started...");
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioURL(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🔊 Car Sound Analysis</h2>
      <p className="text-gray-600 mb-4">Upload or record a car sound for analysis.</p>

      <button
        onClick={handleRecord}
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition duration-300 text-lg"
      >
        🎙 Start Recording
      </button>

      <input type="file" accept="audio/*" onChange={handleUpload} className="mt-4" />

      {audioURL && (
        <audio controls className="mt-4">
          <source src={audioURL} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}

export default SoundRecorder;
