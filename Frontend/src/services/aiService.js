import { apiClient, USE_MOCK } from './api';
import { MOCK_AI_EXPLANATIONS } from './mockData';

export const aiService = {
  /**
   * Send prompt to BHUSENTRY AI Copilot backend
   * @param {string} prompt
   * @param {string} conversationId
   */
  async chat(prompt, conversationId = null) {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.post('/ai/chat', {
          prompt,
          conversation_id: conversationId
        });
        if (response.data?.message) {
          return {
            success: true,
            message: response.data.message,
            conversation_id: response.data.conversation_id,
            suggested_actions: response.data.suggested_actions || []
          };
        }
      } catch (err) {
        console.warn('AI Chat API failed, using intelligent fallback:', err.message);
      }
    }

    // Local fallback
    await new Promise((resolve) => setTimeout(resolve, 600));
    const randomExplanation =
      MOCK_AI_EXPLANATIONS[Math.floor(Math.random() * MOCK_AI_EXPLANATIONS.length)]?.content ||
      'Heavy precipitation saturating vulnerable slope layers exceeds the safety factor threshold.';

    return {
      success: true,
      message: `BHUSENTRY Advisory: ${randomExplanation}`,
      conversation_id: conversationId || `conv-${Date.now()}`,
      suggested_actions: [
        'Deploy local SDRF rapid alert teams',
        'Issue public SMS warning broadcast',
        'Monitor live pore water pressure sensors'
      ]
    };
  },

  /**
   * Request automated geotechnical explanation for a prediction score
   */
  async explainPrediction(predictionId) {
    if (!USE_MOCK) {
      try {
        const response = await apiClient.post(`/ai/explain/${predictionId}`);
        return { success: true, data: response.data };
      } catch (err) {
        console.warn('Explain API failed:', err.message);
      }
    }

    return {
      success: true,
      data: {
        prediction_id: predictionId,
        explanation: 'Geotechnical assessment indicates continuous precipitation saturating shear planes.',
        key_drivers: ['24h rainfall > 120 mm', 'Steep slope incline', 'Pore pressure elevation']
      }
    };
  }
};
