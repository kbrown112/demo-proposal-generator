import React, { useEffect, useState } from 'react';
import api from "../api.js";
import AddProposalForm from './AddProposal.jsx';

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

  return (
    <div>
      <AddProposalForm addProposalTopic={addProposalTopic} />
      <h2>Proposal Response from CrewAI:</h2>
      <h4>Topic: {proposalTopic}</h4>
      <p>{proposalResponse}</p>
    </div>
  );
};

export default Proposals;