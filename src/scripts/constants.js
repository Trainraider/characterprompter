
    const ATTRIBUTES_INFO = {
      'Gender': ['Man', 'Woman'],
      'Age': Array.from({ length: 18 }, (_, i) => i + 18),
      'Era': ['Medieval', 'Modern', 'Futuristic'],
      'World Type': ['Realistic', 'Fantasy'],
      'Race': ['Human', 'Elf', 'Goblin', 'Orc'] // Only if fantasy
    };

    const DEFAULT_TRAITS = [
      { name: "Openness", category: "Personality Traits" }, 
      { name: "Conscientiousness", category: "Personality Traits" }, 
      { name: "Extroversion", category: "Personality Traits" }, 
      { name: "Agreeableness", category: "Personality Traits" }, 
      { name: "Neuroticism", category: "Personality Traits" }, 
      { name: "Narcissism", category: "Personality Traits" }, 
      { name: "Machiavellianism", category: "Personality Traits" }, 
      { name: "Sadism", category: "Personality Traits" }, 
      { name: "Psychopathy", category: "Personality Traits" }, 
      { name: "Wealth", category: "Status Traits" }, 
      { name: "Societal status", category: "Status Traits" }, 
      { name: "Strength", category: "Status Traits" }, 
      { name: "Intelligence", category: "Status Traits" }, 
      { name: "Wisdom", category: "Status Traits" }, 
      { name: "Physical attractiveness", category: "Status Traits" }, 
      { name: "Horniness", category: "Status Traits" } ];

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
