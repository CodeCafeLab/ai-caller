// src/lib/agentService.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const agentService = {
  async getAllAgents() {
    try {
      const [localRes, elevenRes, clientsRes] = await Promise.all([
        fetch(`${API_BASE}/api/agents`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          }
        }),
        fetch(`${API_BASE}/api/elevenlabs/agents`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
              }
        }),
        fetch(`${API_BASE}/api/clients`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${tokenStorage.getToken();}`
          }
        })
      ]);

      // Handle non-OK responses
      if (!localRes.ok || !elevenRes.ok || !clientsRes.ok) {
        throw new Error('Failed to fetch data from one or more endpoints');
      }
      
      const [localData, elevenData, clientsData] = await Promise.all([
        localRes.json(),
        elevenRes.json(),
        clientsRes.json()
      ]);
      
      return { localData, elevenData, clientsData };
    } catch (error) {
      console.error('Error in agentService.getAllAgents:', error);
      throw error;
    }
  },

  async getAgentsByClient(clientId: string) {
    try {
      const { localData, elevenData, clientsData } = await this.getAllAgents();
      
      const localAgents = localData.data?.filter((agent: any) => 
        String(agent.client_id) === String(clientId)
      ) || [];
      
      const elevenLabsAgents = elevenData.agents?.filter((agent: any) => 
        String(agent.client_id) === String(clientId)
      ) || [];
      
      return { localAgents, elevenLabsAgents, clientsData };
    } catch (error) {
      console.error('Error in agentService.getAgentsByClient:', error);
      throw error;
    }
  }
};