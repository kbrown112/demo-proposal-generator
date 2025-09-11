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

  const splitTextIntoSections = (text) => {
    const pattern = /\d+\.\s[^.\n]+/g
    const titles = text.match(pattern);
    console.log(titles)
    const sections = text.split(pattern).filter(section => section.trim() !== '');
    sections.forEach(function(entry) {

      console.log("this is a new section: " + entry)
    });

    const titlesMap = new Map();
    for (const [i, title] of titles.entries()) {
      titlesMap.set(i, title);
    }

    return sections.map((section, sectionIndex) => (
    <div key={sectionIndex} className="section-box">
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

  const formatTextIntoSections = (text) => {
    const lines = text.split('\n');
    const sections = [];
    let currentSection = { header: null, content: [] };
    
    lines.forEach((line, index) => {
      // Check if it's a header
      if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
        // Save previous section if it has content
        if (currentSection.header || currentSection.content.length > 0) {
          sections.push(currentSection);
        }
        // Start new section
        currentSection = { 
          header: line, 
          content: [],
          level: line.startsWith('### ') ? 3 : line.startsWith('## ') ? 2 : 1
        };
      } else {
        // Add content to current section
        currentSection.content.push(line);
      }
    });
    
    // Don't forget the last section
    if (currentSection.header || currentSection.content.length > 0) {
      sections.push(currentSection);
    }

    console.log(sections)
    
    return sections.map((section, sectionIndex) => (
      <div key={sectionIndex} className="section-box">
        {/* Render header */}
        {section.header && (
          section.level === 1 ? <h1>{section.header.substring(2)}</h1> :
          section.level === 2 ? <h2>{section.header.substring(3)}</h2> :
          <h3>{section.header.substring(4)}</h3>
        )}
        
        {/* Render content in scrollable area */}
        <div className="section-content">
          {section.content.map((line, lineIndex) => {
            if (line.includes('**')) {
              const parts = line.split(/(\*\*.*?\*\*)/);
              return (
                <p key={lineIndex}>
                  {parts.map((part, i) => 
                    part.startsWith('**') && part.endsWith('**') 
                      ? <strong key={i}>{part.slice(2, -2)}</strong>
                      : part
                  )}
                </p>
              );
            }
            return line.trim() ? <p key={lineIndex}>{line}</p> : <br key={lineIndex} />;
          })}
        </div>
      </div>
    ));
  };

  return (
    <div>
      <FileUploader />
      <AddProposalForm addProposalTopic={addProposalTopic} />
      <h2>Proposal Response from CrewAI:</h2>
      <h4>Topic: {proposalTopic}</h4>
      {/* {proposalResponse ? formatTextIntoSections(proposalResponse) : ''} */}
      {proposalResponse ? splitTextIntoSections(proposalResponse) : ''}
    </div>
  );
};

export default Proposals;