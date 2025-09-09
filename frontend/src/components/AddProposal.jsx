import React, { useState } from 'react';

const AddProposalForm = ({ addProposalTopic }) => {
  const [topic, setTopic] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (topic) {
      addProposalTopic(topic);
      setTopic('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter proposal topic"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddProposalForm;