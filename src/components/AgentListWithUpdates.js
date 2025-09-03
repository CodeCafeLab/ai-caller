import { useState, useEffect, useCallback } from 'react';
import { AgentUpdates } from './AgentUpdates';

const AgentListWithUpdates = ({ children, fetchAgents }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch agents from the API
  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/agents');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      const data = await response.json();
      setAgents(data.data || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  // Handle agent updates
  const handleAgentUpdated = useCallback((updatedAgent) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.agent_id === updatedAgent.agent_id ? updatedAgent : agent
      )
    );
  }, []);

  // Handle new agent creation
  const handleAgentCreated = useCallback((newAgent) => {
    setAgents(prevAgents => {
      // Check if agent already exists to avoid duplicates
      const exists = prevAgents.some(agent => agent.agent_id === newAgent.agent_id);
      return exists ? prevAgents : [...prevAgents, newAgent];
    });
  }, []);

  // Render loading state
  if (loading) {
    return <div>Loading agents...</div>;
  }

  // Render error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Render the agent list with real-time updates
  return (
    <>
      <AgentUpdates 
        onAgentUpdated={handleAgentUpdated} 
        onAgentCreated={handleAgentCreated} 
      />
      {children(agents, { refresh: loadAgents })}
    </>
  );
};

export default AgentListWithUpdates;
