const ATTRIBUTES_INFO = {
  'Gender': ['Man', 'Woman'],
  'Age': Array.from({ length: 18 }, (_, i) => i + 18),
  'Era': ['Medieval', 'Modern', 'Futuristic'],
  'World Type': ['Realistic', 'Fantasy'],
  'Race': ['Human', 'Elf', 'Goblin', 'Orc'] // Only if fantasy
};

const DEFAULT_TRAITS = [
  { name: "Openness", antonym: "Closed-mindedness", category: "Personality Traits" },
  { name: "Conscientiousness", antonym: "Carelessness", category: "Personality Traits" },
  { name: "Extroversion", antonym: "Introversion", category: "Personality Traits" },
  { name: "Agreeableness", antonym: "Antagonism", category: "Personality Traits" },
  { name: "Neuroticism", antonym: "Emotional Stability", category: "Personality Traits" },
  { name: "Narcissism", antonym: "Selflessness", category: "Personality Traits" },
  { name: "Machiavellianism", antonym: "Sincerity", category: "Personality Traits" },
  { name: "Sadism", antonym: "Gentleness", category: "Personality Traits" },
  { name: "Psychopathy", antonym: "Altruism", category: "Personality Traits" },
  { name: "Wealth", antonym: "Poverty", category: "Status Traits" },
  { name: "Social Status", antonym: "Social Adversity", category: "Status Traits" },
  { name: "Strength", antonym: "Weakness", category: "Status Traits" },
  { name: "Intelligence", antonym: "Stupidity", category: "Status Traits" },
  { name: "Wisdom", antonym: "Ignorance", category: "Status Traits" },
  { name: "Attractiveness", antonym: "Unattractiveness", category: "Status Traits" },
  { name: "Horniness", antonym: "Sexual Indifference", category: "Status Traits" }
];

const PERSONALITY_TRAITS = [
  "Adventurous", "Ambitious", "Analytical", "Arrogant", "Assertive", "Bigotted", "Brave",
  "Careless", "Captivating", "Cautious", "Charismatic", "Cheerful", "Compassionate", "Competent", "Confident",
  "Conservative", "Creative", "Cynical", "Decisive", "Determined", "Diligent", "Dramatic",
  "Dishonest", "Disorganized", "Eccentric", "Empathetic", "Enthusiastic", "Extroverted", "Flirtatious", "Focused",
  "Forgiving", "Generous", "Greedy", "Honest", "Humble", "Idealistic", "Imaginative", "Impulsive",
  "Independent", "Intelligent", "Introverted", "Intuitive", "Irresponsible", "Jealous", "Lazy", "Lecherous", "Liberal",
  "Logical", "Loyal", "Lustful", "Manipulative", "Melancholic", "Meticulous", "Modest", "Naive",
  "Narcissistic", "Neurotic", "Observant", "Optimistic", "Passionate", "Patient", "Perfectionist",
  "Persistent", "Persuasive", "Pessimistic", "Philosophical", "Pragmatic", "Procrastinates", "Prideful", "Rational", "Rebellious",
  "Reckless", "Reserved", "Resourceful", "Romantic", "Sarcastic", "Scholarly", "Self-absorbed", "Selfish",
  "Sensitive", "Sensual", "Skeptical", "Slutty", "Socially awkward", "Stoic", "Stubborn",
  "Suspicious", "Sympathetic", "Tactful", "Temperamental", "Tenacious", "Thoughtful", "Timid",
  "Tolerant", "Treacherous", "Trustworthy", "Uncompromising", "Unpredictable", "Vengeful",
  "Visionary", "Witty", "Wrathful"
];
