export const agentService = {
  async getAllAgents() {
    try {
      const [localRes, elevenRes, clientsRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/elevenlabs/agents'),
        fetch('/api/clients')
      ]);
      
      const [localData, elevenData, clientsData] = await Promise.all([
        localRes.json(),
        elevenRes.json(),
        clientsRes.json()
      ]);
      
      return { localData, elevenData, clientsData };
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  },
  
  async getAgentsByClient(clientId: string) {
    // Filter agents by client ID
    const { localData, elevenData, clientsData } = await this.getAllAgents();
    
    const localAgents = localData.data?.filter((agent: any) => 
      String(agent.client_id) === String(clientId)
    ) || [];
    
    const elevenLabsAgents = elevenData.agents?.filter((agent: any) => 
      String(agent.client_id) === String(clientId)
    ) || [];
    
    return { localAgents, elevenLabsAgents, clientsData };
  }
};
