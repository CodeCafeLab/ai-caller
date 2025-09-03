class SSEClient {
  constructor() {
    this.eventSource = null;
    this.subscribers = new Map();
    this.connected = false;
  }

  connect() {
    if (this.eventSource) {
      return; // Already connected
    }

    // Create a new EventSource connection to our SSE endpoint
    this.eventSource = new EventSource('/api/updates');
    
    this.eventSource.onopen = () => {
      console.log('SSE connection established');
      this.connected = true;
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('SSE Message received:', data);
        
        // Notify all subscribers for this event type
        if (data.type && this.subscribers.has(data.type)) {
          this.subscribers.get(data.type).forEach(callback => {
            callback(data);
          });
        }
        
        // Notify all subscribers for 'all' events
        if (this.subscribers.has('all')) {
          this.subscribers.get('all').forEach(callback => {
            callback(data);
          });
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      this.connected = false;
      
      // Attempt to reconnect after a delay
      this.eventSource.close();
      this.eventSource = null;
      
      setTimeout(() => {
        if (!this.connected) {
          this.connect();
        }
      }, 5000);
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      this.connected = false;
      this.subscribers.clear();
    }
  }

  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    const subscribers = this.subscribers.get(eventType);
    subscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(eventType);
      }
    };
  }

  // Helper method to subscribe to agent updates
  onAgentUpdate(callback) {
    return this.subscribe('agent_updated', callback);
  }

  // Helper method to subscribe to agent creation
  onAgentCreated(callback) {
    return this.subscribe('agent_created', callback);
  }
}

// Create a singleton instance
export const sseClient = new SSEClient();

// Start the connection when the module is imported
if (typeof window !== 'undefined') {
  sseClient.connect();
}

export default sseClient;
