'use client';

import React, { useEffect, useState } from 'react';

// Declare ElevenLabs global object
declare global {
  interface Window {
    ElevenLabs?: {
      initWidget?: (element: HTMLElement) => void;
    };
  }
}

interface ConvAIPopupProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
}

export function ConvAIPopup({ isOpen, onClose, agentId }: ConvAIPopupProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [widgetElement, setWidgetElement] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !scriptLoaded) {
      setLoading(true);
      setError(null);
      
      console.log('Loading ElevenLabs widget for agent:', agentId);
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="convai-widget-embed"]');
      if (existingScript) {
        console.log('Script already exists, creating widget directly');
        createWidget();
        return;
      }
      
      // Load the ElevenLabs ConvAI widget script
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      
      script.onload = () => {
        console.log('ElevenLabs script loaded successfully');
        setScriptLoaded(true);
        
        // Wait a bit more for the script to fully initialize
        setTimeout(() => {
          createWidget();
        }, 500);
      };
      
      script.onerror = () => {
        console.error('Failed to load ElevenLabs script');
        setError('Failed to load ElevenLabs widget script');
        setLoading(false);
      };
      
      document.head.appendChild(script);

      return () => {
        // Cleanup script when component unmounts
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [isOpen, scriptLoaded, agentId]);

  const createWidget = () => {
    try {
      console.log('Creating widget element for agent:', agentId);
      
      // First, try to clean up any existing widgets
      const existingWidgets = document.querySelectorAll('elevenlabs-convai');
      existingWidgets.forEach(widget => {
        if (widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      });
      
      // Create the widget element with proper initialization
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', agentId);
      
      // Add additional attributes to ensure full functionality including voice chat
      widget.setAttribute('data-elevenlabs-widget', 'true');
      widget.setAttribute('data-voice-enabled', 'true');
      widget.setAttribute('data-multimodal', 'true');
      
      // Let the ElevenLabs widget render in its natural format
      // Don't override the default styling - let it appear as a chat bubble
      
      // Alternative approach: Try using innerHTML to create the widget
      setTimeout(() => {
        if (!widget.innerHTML || widget.innerHTML.trim().length === 0) {
          console.log('Trying alternative widget creation method...');
          // Try creating the widget using innerHTML
          const widgetHTML = `
            <elevenlabs-convai agent-id="${agentId}" data-elevenlabs-widget="true" data-voice-enabled="true" data-multimodal="true"></elevenlabs-convai>
          `;
          widget.innerHTML = widgetHTML;
        }
      }, 2000);
      
      // Add the widget to the body
      document.body.appendChild(widget);
      setWidgetElement(widget);
      setLoading(false);
      
      console.log('Widget element created and added to body with styles');
      
      // Force widget initialization
      setTimeout(() => {
        console.log('Attempting to initialize widget...');
        
        // Try to trigger widget initialization
        if (window.ElevenLabs && window.ElevenLabs.initWidget) {
          window.ElevenLabs.initWidget(widget);
        }
        
        // Check if widget has content
        const hasContent = widget.innerHTML && widget.innerHTML.trim().length > 0;
        console.log('Widget has content:', hasContent);
        console.log('Widget innerHTML:', widget.innerHTML);
        
        if (!hasContent) {
          console.log('Widget has no content, trying alternative initialization...');
          // Try alternative initialization
          widget.dispatchEvent(new Event('load'));
          widget.dispatchEvent(new Event('DOMContentLoaded'));
          
          // Let the ElevenLabs widget load naturally
          console.log('Widget has no content yet, waiting for ElevenLabs to initialize...');
        }
        
        addCloseButtonToWidget();
      }, 1000);
      
      setTimeout(() => {
        addCloseButtonToWidget();
      }, 3000);
      
      setTimeout(() => {
        addCloseButtonToWidget();
      }, 5000);
      
      // Fallback: if widget doesn't appear after 6 seconds, show error
      setTimeout(() => {
        const widgetExists = document.querySelector('elevenlabs-convai');
        const hasContent = widgetExists && widgetExists.innerHTML && widgetExists.innerHTML.trim().length > 0;
        
        console.log('Final check - Widget exists:', !!widgetExists);
        console.log('Final check - Widget has content:', hasContent);
        
        if (!widgetExists || !hasContent) {
          console.log('Widget not found or has no content, creating fallback iframe');
          createFallbackIframe();
        }
      }, 6000);
      
    } catch (err) {
      console.error('Error creating widget:', err);
      setError('Failed to create widget');
      setLoading(false);
    }
  };

  const createFallbackIframe = () => {
    try {
      console.log('Creating fallback iframe for agent:', agentId);
      
      // Remove any existing widgets
      const existingWidgets = document.querySelectorAll('elevenlabs-convai');
      existingWidgets.forEach(widget => {
        if (widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      });
      
      // Create iframe that points to the ElevenLabs agent page
      const iframe = document.createElement('iframe');
      iframe.src = `https://elevenlabs.io/app/conversational-ai/agents/${agentId}`;
      iframe.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        height: 600px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        background: white;
      `;
      
      // Add close button to iframe
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.className = 'custom-close-btn';
      closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: #ff4444;
        color: white;
        border: none;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: background-color 0.2s;
      `;
      
      closeButton.addEventListener('click', () => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
        if (closeButton.parentNode) {
          closeButton.parentNode.removeChild(closeButton);
        }
        onClose();
      });
      
      // Create container for iframe and close button
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
      `;
      
      container.appendChild(iframe);
      container.appendChild(closeButton);
      document.body.appendChild(container);
      
      setWidgetElement(container);
      setLoading(false);
      
      console.log('Fallback iframe created');
      
    } catch (err) {
      console.error('Error creating fallback iframe:', err);
      setError('Failed to create widget. Please try again.');
      setLoading(false);
    }
  };

  const addCloseButtonToWidget = () => {
    // Try multiple selectors to find the ElevenLabs widget container
    const selectors = [
      '[data-elevenlabs-widget]',
      '.elevenlabs-convai-widget',
      'elevenlabs-convai',
      '[class*="elevenlabs"]',
      '[class*="convai"]',
      'iframe[src*="elevenlabs"]',
      // Look for the actual chat bubble container
      '[class*="chat"]',
      '[class*="widget"]',
      '[class*="bubble"]'
    ];
    
    let widgetContainer = null;
    for (const selector of selectors) {
      widgetContainer = document.querySelector(selector);
      if (widgetContainer) {
        // Make sure it's actually visible and positioned
        const rect = widgetContainer.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          console.log('Found widget container:', selector, rect);
          break;
        }
      }
    }
    
    if (widgetContainer) {
      // Check if close button already exists
      if (widgetContainer.querySelector('.custom-close-btn')) {
        return;
      }
      
      console.log('Adding close button to widget container');
      
      // Create close button that matches ElevenLabs style
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.className = 'custom-close-btn';
      closeButton.style.cssText = `
        position: absolute;
        top: -5px;
        right: -5px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ff4444;
        color: white;
        border: 2px solid white;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s;
        line-height: 1;
      `;
      
      closeButton.addEventListener('mouseenter', () => {
        closeButton.style.backgroundColor = '#ff6666';
        closeButton.style.transform = 'scale(1.1)';
      });
      
      closeButton.addEventListener('mouseleave', () => {
        closeButton.style.backgroundColor = '#ff4444';
        closeButton.style.transform = 'scale(1)';
      });
      
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      });
      
      // Make the widget container relative positioned if it isn't already
      if (widgetContainer instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(widgetContainer);
        if (computedStyle.position === 'static') {
          widgetContainer.style.position = 'relative';
        }
        widgetContainer.appendChild(closeButton);
      }
    } else {
      console.log('Widget container not found, retrying...');
      // If we can't find the widget container, try again after a short delay
      setTimeout(() => {
        addCloseButtonToWidget();
      }, 500);
    }
  };

  useEffect(() => {
    // Clean up when popup closes
    if (!isOpen) {
      // Remove the widget element
      if (widgetElement && widgetElement.parentNode) {
        widgetElement.parentNode.removeChild(widgetElement);
        setWidgetElement(null);
      }
      
      // Also remove any existing widgets
      const existingWidgets = document.querySelectorAll('elevenlabs-convai');
      existingWidgets.forEach(widget => {
        if (widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      });
      
      // Remove any custom close buttons
      const closeButtons = document.querySelectorAll('.custom-close-btn');
      closeButtons.forEach(btn => {
        if (btn.parentNode) {
          btn.parentNode.removeChild(btn);
        }
      });
    }
  }, [isOpen, widgetElement]);

  // Show loading state or error if needed
  if (isOpen && (loading || error)) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Loading/Error Container */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Test Agent</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
          
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading agent widget...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  // Retry loading
                  const script = document.createElement('script');
                  script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
                  script.async = true;
                  script.type = 'text/javascript';
                  script.onload = () => {
                    setScriptLoaded(true);
                    createWidget();
                  };
                  script.onerror = () => {
                    setError('Failed to load ElevenLabs widget script');
                    setLoading(false);
                  };
                  document.head.appendChild(script);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // This component doesn't render anything visible when working properly
  // It just manages the ElevenLabs widget lifecycle
  return null;
}
