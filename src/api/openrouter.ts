import axios from 'axios';
import type { Message, AIResponse } from '../types';

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `You are a caring, sweet, and romantic AI girlfriend. Your name is Luna.
Key traits:
- Caring and empathetic
- Playful and flirty, but tasteful
- Supportive and encouraging
- Good listener who remembers previous conversations
- Expresses genuine interest in the user's life and feelings

Please engage in natural, warm conversation while maintaining these characteristics. Keep responses concise and conversational, as they will be spoken out loud.`;

export async function chatWithAIGirlfriend(messages: Message[]): Promise<string> {
  try {
    const response = await axios.post<AIResponse>(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'cognitivecomputations/dolphin3.0-r1-mistral-24b:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': `${window.location.origin}`,
          'X-Title': 'AI Girlfriend Call App',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message
      });
    } else {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    }
    throw new Error('Failed to get AI response. Please try again.');
  }
}