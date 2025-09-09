import axios from "axios";
import React, { useState } from "react";

const SampleProposalUpload = () => {
  const [sampleProposalFile, setSampleProposalFile] = useState(null);
  const onFileChange = (event) => {
    setSampleProposalFile(event.target.files[0])
  };
  const onFileUpload = () => {
    const formData = new FormData();
    formData.append(
        "myFile",
        sampleProposalFile,
        sampleProposalFile.name
    )
    console.log(sampleProposalFile.name)
    axios.post("upload_file", formData);
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    if (sampleProposalFile) {
      return (
            <div>
                <p> File Name: {sampleProposalFile.name}</p>
            </div>
        )
    }
  };

  return (
    <div>
    <input type="file" onChange={onFileChange} />
    <button onClick={onFileUpload}>Upload!</button>
    </div>
  );
};

export default SampleProposalUpload;