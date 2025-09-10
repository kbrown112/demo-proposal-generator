import React, { useEffect, useState } from 'react';
import api from "../api.js";
import AddProposalForm from './AddProposal.jsx';
import SampleProposalUpload from './SampleProposalUpload.jsx';
import FileUploader from './FileUploader';

const Proposals = () => {
  const [proposalResponse, setProposalResponse] = useState('');
  const [proposalTopic, setProposalTopic] = useState('');

  const addProposalTopic = async (topic) => {
    try {
      const response = await api.post(`/proposal?topic=${encodeURIComponent(topic)}`);
      console.log(response.data)
      setProposalResponse(response.data)
      setProposalTopic(topic)
    } catch (error) {
      console.error("Error adding proposal", error);
    }
  };

  const formatText = (text) => {
  return text
    .split('\n')
    .map((line, index) => {
      // Handle headers
      if (line.startsWith('# ')) {
        return <h1 key={index}>{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index}>{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index}>{line.substring(4)}</h3>;
      }
      // Handle bold text
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        return (
          <p key={index}>
            {parts.map((part, i) => 
              part.startsWith('**') && part.endsWith('**') 
                ? <strong key={i}>{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      }
      // Regular paragraphs
      return line.trim() ? <p key={index}>{line}</p> : <br key={index} />;
    });
};

  return (
    <div>
      <FileUploader />
      <AddProposalForm addProposalTopic={addProposalTopic} />
      <h2>Proposal Response from CrewAI:</h2>
      <h4>Topic: {proposalTopic}</h4>
      <div style={{whiteSpace: 'pre-wrap', lineHeight: '1.6'}}>
      {proposalResponse ? formatText(proposalResponse) : ''}
    </div>
    </div>
  );
};

export default Proposals;