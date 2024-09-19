
    const ATTRIBUTES_INFO = {
      'Gender': ['Man', 'Woman'],
      'Age': Array.from({ length: 18 }, (_, i) => i + 18),
      'Era': ['Medieval', 'Modern', 'Futuristic'],
      'World Type': ['Realistic', 'Fantasy'],
      'Race': ['Human', 'Elf', 'Goblin', 'Orc'] // Only if fantasy
    };

    const DEFAULT_TRAITS = [
      'Openness', 'Conscientiousness', 'Extroversion', 'Agreeableness', 'Neuroticism',
      'Narcissism', 'Machiavellianism', 'Sadism', 'Psychopathy',
      'Wealth', 'Societal status', 'Strength', 'Intelligence', 'Wisdom',
      'Physical attractiveness', 'Horniness'
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

    class LockButton {
      constructor(name) {
        this.name = name;
        this.locked = false;
        this.element = null;
      }

      createLockButton() {
        const lockButton = document.createElement('button');
        lockButton.className = 'lock';
        lockButton.textContent = this.locked ? '🔒' : '🔓';
        lockButton.onclick = () => this.toggleLock();
        return lockButton;
      }

      setElement(element) {
        this.element = element;
        this.updateElementState();
      }

      toggleLock() {
        this.locked = !this.locked;
        this.updateElementState();
      }

      updateElementState() {
        if (this.element) {
          const lockButton = this.element.querySelector('.lock');
          const inputs = this.element.querySelectorAll('input');

          lockButton.textContent = this.locked ? '🔒' : '🔓';
          lockButton.classList.toggle('locked', this.locked);
          inputs.forEach(input => {
            input.disabled = this.locked;
          });
        }
      }

      isLocked() {
        return this.locked;
      }
    }

    class Attribute {
      constructor(name, options) {
        this.name = name;
        this.options = options;
        this.element = null;
        this.lock = new LockButton(name);
        this.value = this.reroll();
      }

      reroll() {
        if (!this.lock.isLocked()) {
          let value = null;
          if (Array.isArray(this.options)) {
            value = this.options[Math.floor(Math.random() * this.options.length)];
          } else {
            value = Math.floor(Math.random() * (this.options[1] - this.options[0] + 1)) + this.options[0];
          }
          this.updateValue(value);
        }
      }

      generateElement() {
        const div = document.createElement('div');
        div.className = 'attribute';

        const lockButton = this.lock.createLockButton();

        div.innerHTML = `
            ${this.name}: <br><br>
            <input type="text" value="${this.value}">
          `;
        div.insertBefore(lockButton, div.firstChild);

        this.element = div;
        this.lock.setElement(div);

        const input = div.querySelector('input');
        input.addEventListener('input', (e) => {
          if (!this.lock.isLocked()) {
            this.value = e.target.value;
          }
        });

        return div;
      }

      generateText() {
        return `${this.name}: ${this.value}`;
      }

      updateValue(newValue) {
        if (!this.lock.isLocked()) {
          this.value = newValue;
          if (this.element) {
            const input = this.element.querySelector('input');
            input.value = newValue;
          }
        }
      }
    }

    class AttributeContainer {
      constructor() {
        this.attributes = {};
      }

      _forEach(callback) {
        Object.values(this.attributes).forEach(callback);
      }

      addAttribute(name, options) {
        this.attributes[name] = new Attribute(name, options);
      }

      generateElements() {
        const attributesElement = document.getElementById('attributes');
        attributesElement.innerHTML = '';
        this._forEach(attribute => attributesElement.appendChild(attribute.generateElement()));
      }

      generateText() {
        let attributesText = '';
        this._forEach(attribute => {
          attributesText += attribute.generateText() + '\n';
        });
        // Remove any leading/trailing whitespace and ensure no empty lines
        attributesText = attributesText.trim().replace(/^\s+/gm, '');
        // Add a single newline at the end
        return attributesText + '\n';
      }

      reroll() {
        this._forEach(attribute => attribute.reroll())
        const worldTypeAttribute = this.attributes['World Type'];
        const raceAttribute = this.attributes['Race'];
        if (worldTypeAttribute && raceAttribute && !raceAttribute.lock.isLocked()) {
          if (worldTypeAttribute.value !== 'Fantasy') {
            raceAttribute.updateValue('Human');
          }
        }
      }

      reset() {
        this.attributes = {};
        Object.entries(ATTRIBUTES_INFO).forEach(([key, options]) => {
          this.addAttribute(key, options);
        })
        this.generateElements();
      }
    }

    class Trait {
      constructor(name) {
        this.name = name;
        this.value = Math.floor(Math.random() * 101);
        this.element = null;
        this.lock = new LockButton();
      }

      generateElement() {
        const div = document.createElement('div');
        div.className = 'trait';

        const lockButton = this.lock.createLockButton();

        div.innerHTML = `
                <div class="trait-top-row">
                    <button class="delete-trait" onclick="traitContainer.deleteTrait('${this.name}')">❌</button>
                    <span class="trait-label">${this.name}:</span>
                    <input type="range" class="trait-slider" min="0" max="100" value="${this.value}">
                </div>
                <input type="text" class="trait-input" placeholder="${this.getStrengthModifier()}">
            `;

        const traitTopRow = div.querySelector('.trait-top-row');
        traitTopRow.insertBefore(lockButton, traitTopRow.firstChild);

        this.element = div;
        this.lock.setElement(div);

        const slider = div.querySelector('.trait-slider');
        const input = div.querySelector('.trait-input');

        slider.addEventListener('input', () => {
          this.updateValue(slider.value);
          input.placeholder = this.getStrengthModifier();
          if (!input.value) {
            input.value = '';
          }
        });

        return div;
      }

      reroll() {
        if (!this.lock.isLocked()) {
          let value = Math.floor(Math.random() * 101);
          this.updateValue(value);
        }
      }

      updateValue(newValue) {
        if (!this.lock.isLocked()) {
          this.value = newValue;
          if (this.element) {
            const slider = this.element.querySelector('.trait-slider');
            const input = this.element.querySelector('.trait-input');
            slider.value = newValue;
            input.placeholder = this.getStrengthModifier();
            if (!input.value) {
              input.value = '';
            }
          }
        }
      }

      generateText() {
        const textInput = this.element ? this.element.querySelector('.trait-input').value : '';
        if (textInput) {
          // Check if the input contains the trait name (case-insensitive)
          if (textInput.toLowerCase().includes(this.name.toLowerCase())) {
            return `${textInput}\n`;
          }
          return `${this.name}: ${textInput}\n`;
        } else {
          const strengthModifier = this.getStrengthModifier();
          return `${strengthModifier}\n`;
        }
      }

      getStrengthModifier() {
        const levels = [
          { threshold: 0, modifier: "no {{trait}} at all" },
          { threshold: 10, modifier: "practically nonexistent {{trait}}" },
          { threshold: 20, modifier: "almost no {{trait}}" },
          { threshold: 25, modifier: "very low {{trait}}" },
          { threshold: 35, modifier: "considerably below average {{trait}}" },
          { threshold: 40, modifier: "less than average {{trait}}" },
          { threshold: 45, modifier: "average {{trait}}" },
          { threshold: 50, modifier: "moderate {{trait}}" },
          { threshold: 60, modifier: "above average {{trait}}" },
          { threshold: 70, modifier: "substantial {{trait}}" },
          { threshold: 80, modifier: "remarkable {{trait}}" },
          { threshold: 87, modifier: "extraordinary {{trait}}" },
          { threshold: 94, modifier: "unparalleled {{trait}}" }
        ];

        for (let i = levels.length - 1; i >= 0; i--) {
          if (this.value >= levels[i].threshold) {
            return levels[i].modifier.replace("{{trait}}", this.name.toLowerCase());
          }
        }
        return "invalid {{trait}}".replace("{{trait}}", this.name.toLowerCase());
      }
    }

    class TraitContainer {
      constructor() {
        this.traits = {};
      }

      _forEach(callback) {
        Object.values(this.traits).forEach(callback);
      }

      addTrait(newTraitName) {
        if (newTraitName && !this.traits[newTraitName]) {
          this.traits[newTraitName] = new Trait(newTraitName);
          const traitsElement = document.getElementById('traits');
          traitsElement.appendChild(this.traits[newTraitName].generateElement());
        }
      }

      generateElements() {
        const traitsElement = document.getElementById('traits');
        traitsElement.innerHTML = '';
        this._forEach(trait => traitsElement.appendChild(trait.generateElement()));
      }

      generateText() {
        let allTraitText = '';
        this._forEach(trait => allTraitText += trait.generateText());
        return allTraitText;
      }

      reroll() {
        this._forEach(trait => trait.reroll());
      }

      reset() {
        this.traits = {};
        DEFAULT_TRAITS.forEach(traitName => this.addTrait(traitName));
        this.generateElements();
      }

      deleteTrait(traitName) {
        delete this.traits[traitName];
        this.generateElements();
      }      
    }

    function rerollAll() {
      attributeContainer.reroll();
      traitContainer.reroll();
    }

    function generateStep1Prompt() {
      let allText = generateTraitAttributeText();
      const customPromptText = document.getElementById('customPrompt').value.trim();

      const step1Prompt = `Based on the following information about a character:
        ${allText}
        ${customPromptText}

        And considering this list of personality traits: ${PERSONALITY_TRAITS.join(', ')}
        Please list the personality traits from the provided list that most apply to this character based on the information given. Your list should only be space separated. You can also use traits that weren't listed in your list. Put your answer in a code block.`;

      copyToClipboard(step1Prompt);
    }

    function copyWithStep2Prompt(promptTemplate) {
      const digestedTraits = document.getElementById('digestedTraits').value.trim();
      if (!digestedTraits) {
        return;
      }

      // Generate text for attributes
      let attributesText = attributeContainer.generateText() + 'Personality:\n';
      let allText = attributesText + digestedTraits;

      const customPromptText = document.getElementById('customPrompt').value.trim();
      const finalText = promptTemplate
        .replace('{{traits}}', allText)
        .replace('{{custom_prompt}}', customPromptText);

      copyToClipboard(finalText);
    }

    function generateTraitAttributeText() {
      return attributeContainer.generateText() + traitContainer.generateText();
    }

    function copyToClipboard(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      //show copy notification
      const notification = document.getElementById('copyNotification');
      notification.style.opacity = '1';
      notification.style.visibility = 'visible';
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.visibility = 'hidden';
      }, 1000);
    }

    function copyAll() {
      let allText = generateTraitAttributeText();
      copyToClipboard(allText);
    }

    function copyWithPrompt(prompt) {
      let allText = generateTraitAttributeText();
      const customPromptText = document.getElementById('customPrompt').value.trim();
      const finalText = prompt
        .replace('{{traits}}', allText)
        .replace('{{custom_prompt}}', customPromptText);

      copyToClipboard(finalText);
    }

    document.getElementById('digestedTraits').addEventListener('input', function () {
      const step2Prompts = document.getElementById('step2Prompts');
      if (this.value.trim()) {
        step2Prompts.classList.add('active');
      } else {
        step2Prompts.classList.remove('active');
      }
    });

    document.addEventListener('DOMContentLoaded', (event) => {
      const toggleButton = document.getElementById('toggleDescription');
      const description = document.getElementById('description');

      toggleButton.addEventListener('click', () => {
        if (description.style.display === 'none') {
          description.style.display = 'block';
          toggleButton.textContent = 'Hide';
        } else {
          description.style.display = 'none';
          toggleButton.textContent = 'How does this work?';
        }
      });

      const scrollToTopButton = document.getElementById('scrollToTop');

      scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0 });
      });

      const backgroundImageWrapper = document.querySelector('.background-image-wrapper');
      const backgroundImage = document.querySelector('.background-image');

      function checkHover(event) {
        const rect = backgroundImageWrapper.getBoundingClientRect();
        let clientX, clientY;

        if (event.type.includes('touch')) {
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        } else {
          clientX = event.clientX;
          clientY = event.clientY;
        }

        const isHovering = (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        );

        if (isHovering) {
          backgroundImage.src = 'image2.webp';
        } else {
          backgroundImage.src = 'image.webp';
        }
      }

      document.addEventListener('mousemove', checkHover);
      document.addEventListener('touchmove', checkHover);
      document.addEventListener('touchstart', checkHover);

      const foldableBoxes = document.querySelectorAll('.prompt-box.foldable');

      foldableBoxes.forEach(box => {
        const title = box.querySelector('.prompt-title');
        title.addEventListener('click', () => {
          box.classList.toggle('active');
        });
      });

      const newTraitInput = document.getElementById('newTraitInput');
      const addButton = document.querySelector('.trait-input button');

      newTraitInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent form submission if it's in a form
          const newTraitName = newTraitInput.value.trim();
          traitContainer.addTrait(newTraitName)
          newTraitInput.value = "";
        }
      });

      addButton.onclick = function () {
        const newTraitName = newTraitInput.value.trim();
        traitContainer.addTrait(newTraitName)
        newTraitInput.value = "";
      };

      attributeContainer.reset();
      traitContainer.reset();
      rerollAll();
    });

    // Initialize containers
    const attributeContainer = new AttributeContainer();
    const traitContainer = new TraitContainer();
    const prompt_template = `
    {{PROMPT}}
`;
    const nsfw_prompt_template = `
    {{NSFW_PROMPT}}
`;