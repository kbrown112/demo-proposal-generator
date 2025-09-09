import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import api from "../api.js";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>("idle")

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    }

    async function handleFileUpload() {
        if (!file) return;

        setStatus("uploading");

        const formData = new FormData();
        formData.append('file', file);
        console.log(formData)

        try {
            await api.post(`/upload`, formData)
            setStatus("success");
        } catch {
            setStatus("error")
        };
    }

    return (
        <div>
            <p>Upload RFP for AI Agents to reference:</p>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>

            {status === "success" && (
                <p>File uploaded successfully!</p>
            )}

            {status === "error" && (
                <p>ERROR ERROR ERROR</p>
            )}
        </div>
    );
}