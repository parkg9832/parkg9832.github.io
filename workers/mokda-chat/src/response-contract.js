// One contract drives constrained generation and server-side validation.
// Structured output is still untrusted: every response is checked before use.
export const INTENTS = ['choose', 'pairings', 'spice', 'ingredients', 'storage', 'buy', 'pricing', 'export', 'horeca', 'brand', 'history', 'news', 'creators', 'collaboration', 'contact', 'unknown'];
export const COMPANY_TOPICS = ['', 'moq', 'samples', 'pricing', 'leadTime', 'packing', 'bulk', 'documents', 'certifications', 'namedCertifications', 'support', 'oem', 'exclusive', 'brand', 'specifications'];
export const ENTITY_VALUES = {
  intent: INTENTS,
  audience: ['', 'b2c', 'b2b', 'collaboration'],
  product: ['', 'kpeno', 'para_carnes', 'both'],
  country: ['', 'South Korea', 'Mexico', 'Peru', 'Colombia', 'Chile', 'Argentina', 'Brazil', 'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay', 'Venezuela', 'Costa Rica', 'Panama', 'Guatemala', 'Dominican Republic', 'United States', 'Spain', 'Other'],
  businessType: ['', 'importer', 'distributor', 'retailer', 'restaurant', 'horeca', 'online', 'other'],
  food: ['', 'tacos', 'chicken', 'meat', 'vegetables', 'snacks', 'other'],
  heatPreference: ['', 'less_spicy', 'spicy'],
  companyTopic: COMPANY_TOPICS,
};
export const QUANTITY_PATTERN = /^\d{1,7}(?:[.,]\d{1,2})?(?:\s?(?:bottles|cases|boxes|kg|units|병|박스))?$/;
const properties = Object.fromEntries(Object.entries(ENTITY_VALUES).map(([key, values]) => [key, { type: 'string', enum: values }]));
properties.quantity = { type: 'string', maxLength: 30, pattern: `^(?:${QUANTITY_PATTERN.source.slice(1, -1)})?$` };
export const RESPONSE_FORMAT = {
  type: 'json_schema',
  json_schema: {
    type: 'object', additionalProperties: false,
    properties: {
      text: { type: 'string', minLength: 1, maxLength: 600 },
      interpretation: { type: 'object', additionalProperties: false, properties, required: Object.keys(properties) },
    },
    required: ['text', 'interpretation'],
  },
};
