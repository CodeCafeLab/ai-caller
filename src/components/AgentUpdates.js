import { useEffect, useCallback } from 'react';
import { sseClient } from '../utils/sseClient';

export const useAgentUpdates = (onAgentUpdated, onAgentCreated) => {
  useEffect(() => {
    // Subscribe to agent updates
    const unsubscribeAgentUpdated = sseClient.onAgentUpdate((data) => {
      console.log('Agent updated:', data);
      if (onAgentUpdated) {
        onAgentUpdated(data.agent);
      }
    });

    // Subscribe to agent creation
    const unsubscribeAgentCreated = sseClient.onAgentCreated((data) => {
      console.log('Agent created:', data);
      if (onAgentCreated) {
        onAgentCreated(data.agent);
      }
    });

    // Cleanup subscriptions on component unmount
    return () => {
      unsubscribeAgentUpdated();
      unsubscribeAgentCreated();
    };
  }, [onAgentUpdated, onAgentCreated]);
};

export const AgentUpdates = ({ onAgentUpdated, onAgentCreated }) => {
  useAgentUpdates(onAgentUpdated, onAgentCreated);
  return null; // This is a utility component that doesn't render anything
};

export default AgentUpdates;
