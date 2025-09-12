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
      // send an api post request with proposal topic
      const response = await api.post(`/proposal?topic=${encodeURIComponent(topic)}`);
      console.log(response.data)
      // sets proposal response from CrewAI
      setProposalResponse(response.data)
      setProposalTopic(topic)
    } catch (error) {
      console.error("Error adding proposal", error);
    }
  };
  
  // format response
  const splitTextIntoSections = (text) => {
    const pattern = /\d+\.\s[^.\n]+/g // creates pattern to search for sections in this format (1. Introduction)
    const titles = text.match(pattern); // titles match pattern (in the array)
    console.log(titles)
    const sections = text.split(pattern).filter(section => section.trim() !== ''); // text sections are split into array based on pattern
    sections.forEach(function(entry) {
      console.log("new section: " + entry)
    });

    // create a map of the titles and corresponding index
    const titlesMap = new Map();
    for (const [i, title] of titles.entries()) {
      titlesMap.set(i, title);
    }

    // format text (also creates a map of each section and corresponding index)
    return sections.map((section, sectionIndex) => (
    <div key={sectionIndex} className="section-box">
      {/* separate div for the section title */}
      <div className="section-header">
        {titlesMap.get(sectionIndex)}
      </div>
      <div className="section-content">
        {section.split('\n').map((line, lineIndex) => 
          line.trim() ? <p key={lineIndex}>{line}</p> : <br key={lineIndex} />
        )}
      </div>
    </div>
  ));

  }

  return (
    <div>
      <FileUploader />
      <AddProposalForm addProposalTopic={addProposalTopic} />
      <h2>Proposal Response from CrewAI:</h2>
      <h4>Topic: {proposalTopic}</h4>
      {proposalResponse ? splitTextIntoSections(proposalResponse) : ''}
    </div>
  );
};

export default Proposals;