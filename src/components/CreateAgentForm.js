import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CreateAgentForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    first_message: '',
    system_prompt: '',
    language_code: 'en',
    voice_id: '',
    model: 'eleven_turbo_v2',
    temperature: 0.7,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          local: formData,
          elevenlabs: {
            conversation_config: {
              agent: {
                name: formData.name,
                description: formData.description,
                language: formData.language_code,
                prompt: {
                  prompt: formData.system_prompt,
                  first_message: formData.first_message,
                },
              },
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create agent');
      }

      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess(data.agent_id);
      }

      // Redirect to the agent details page
      router.push(`/agents/${data.agent_id}`);
    } catch (err) {
      console.error('Error creating agent:', err);
      setError(err.message || 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Agent</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Agent Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Customer Support Bot"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="A brief description of what this agent does"
          />
        </div>

        <div>
          <label htmlFor="system_prompt" className="block text-sm font-medium text-gray-700 mb-1">
            System Prompt *
          </label>
          <textarea
            id="system_prompt"
            name="system_prompt"
            value={formData.system_prompt}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="You are a helpful assistant that..."
          />
        </div>

        <div>
          <label htmlFor="first_message" className="block text-sm font-medium text-gray-700 mb-1">
            First Message *
          </label>
          <input
            type="text"
            id="first_message"
            name="first_message"
            value={formData.first_message}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Hello! How can I help you today?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="language_code" className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              id="language_code"
              name="language_code"
              value={formData.language_code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="eleven_turbo_v2">Eleven Turbo v2</option>
              <option value="eleven_monolingual_v2">Eleven Monolingual v2</option>
              <option value="eleven_multilingual_v2">Eleven Multilingual v2</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Agent'}
          </button>
        </div>
      </form>
    </div>
  );
}
