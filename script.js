/* ============================================
   FUTURE ME – Career Discovery Quiz
   JavaScript (all logic, sounds, animations)
   ============================================ */

/* ============================================
   🔊 SOUND EFFECTS (Web Audio API)
   No external files needed! We create sounds
   using the browser's built-in audio system.
   ============================================ */

// Create a shared audio context (the "sound engine")
let audioCtx = null;

// We only create the audio context after user interaction
// (browsers block auto-play audio)
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Plays a soft "pop" sound when an option is clicked.
 * Uses a short sine wave that quickly fades out.
 */
function playPopSound() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();   // Creates a sound wave
    const gainNode = ctx.createGain();            // Controls volume

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';                     // Smooth, soft tone
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);       // Starting pitch
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1); // Quick rise

    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);             // Soft volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15); // Quick fade

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);      // Very short sound
  } catch (e) {
    // Silently fail if audio isn't available
  }
}

/**
 * Plays a "whoosh" sound when moving to next question.
 * Uses white noise filtered to sound like a swoosh.
 */
function playWhooshSound() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 0.15;     // 150ms of sound
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill with random noise (white noise)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize); // Fade out naturally
    }

    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gainNode = ctx.createGain();

    source.buffer = buffer;
    filter.type = 'bandpass';                     // Only let certain frequencies through
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(ctx.currentTime);
  } catch (e) {
    // Silently fail
  }
}

/**
 * Plays a cheerful "celebration" chime for the results screen.
 * Three ascending notes played quickly.
 */
function playCelebrationSound() {
  try {
    const ctx = getAudioContext();
    const notes = [523, 659, 784];  // C5, E5, G5 — a happy chord

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);

      const startTime = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  } catch (e) {
    // Silently fail
  }
}


/* ============================================
   📝 QUIZ QUESTIONS
   6 questions, each with 5 options mapping to:
   analytical, creative, social, technical, sports
   ============================================ */

const questions = [
  {
    question: "It's a holiday! What do you do first?",
    options: [
      { emoji: "🧩", text: "Solve a riddle book",                  category: "analytical" },
      { emoji: "🎨", text: "Draw or paint something",              category: "creative" },
      { emoji: "👫", text: "Call a friend to hang out",            category: "social" },
      { emoji: "📱", text: "Watch a tech video or play a game",   category: "technical" },
      { emoji: "⚽", text: "Go outside and play a sport",         category: "sports" }
    ]
  },
  {
    question: "Group project! What's your role?",
    options: [
      { emoji: "🔍", text: "Find all the facts and data",         category: "analytical" },
      { emoji: "✏️", text: "Make the poster look amazing",        category: "creative" },
      { emoji: "🗣️", text: "Keep the team working together",      category: "social" },
      { emoji: "🔧", text: "Build the model or demo",             category: "technical" },
      { emoji: "🏆", text: "Take charge and lead like a captain", category: "sports" }
    ]
  },
  {
    question: "Which school subject is your favourite?",
    options: [
      { emoji: "🧪", text: "Math or Science",                     category: "analytical" },
      { emoji: "🎵", text: "Art or Music",                        category: "creative" },
      { emoji: "📖", text: "Languages or Social Studies",         category: "social" },
      { emoji: "💻", text: "Computer class",                      category: "technical" },
      { emoji: "🏃", text: "Physical Education / Sports",         category: "sports" }
    ]
  },
  {
    question: "A friend is stuck on homework. You...",
    options: [
      { emoji: "📊", text: "Explain it step by step",              category: "analytical" },
      { emoji: "🖍️", text: "Draw a picture to help them",         category: "creative" },
      { emoji: "🤗", text: "Sit with them and encourage",         category: "social" },
      { emoji: "📲", text: "Find a helpful app or video",         category: "technical" },
      { emoji: "😄", text: "Say \"Let's take a break and play!\"",category: "sports" }
    ]
  },
  {
    question: "Pick your dream birthday gift!",
    options: [
      { emoji: "🔭", text: "A telescope or microscope",            category: "analytical" },
      { emoji: "📸", text: "A sketch kit or camera",               category: "creative" },
      { emoji: "🎉", text: "A party with all your friends",        category: "social" },
      { emoji: "🤖", text: "A robot kit or new tablet",            category: "technical" },
      { emoji: "🏏", text: "A new football or cricket bat",        category: "sports" }
    ]
  },
  {
    question: "School fair! What do you make?",
    options: [
      { emoji: "⚗️", text: "A cool science experiment",           category: "analytical" },
      { emoji: "🖼️", text: "A painting or craft project",         category: "creative" },
      { emoji: "🎪", text: "A fun booth where everyone plays",    category: "social" },
      { emoji: "🖥️", text: "A mini robot or website",             category: "technical" },
      { emoji: "🥇", text: "A sports challenge or mini tournament",category: "sports" }
    ]
  }
];


/* ============================================
   🎯 CATEGORY DATA
   Career suggestions, skills, and messages
   for each of the 5 personality types
   ============================================ */

const categoryData = {
  analytical: {
    emoji: "🔬",
    label: "Analytical",
    colorClass: "analytical",
    subtitle: "You love solving problems, finding patterns, and figuring out how things work. Your brain is your superpower!",
    careers: [
      { icon: "🧪", name: "Scientist" },
      { icon: "⚙️", name: "Engineer" },
      { icon: "🕵️", name: "Detective" }
    ],
    skills: [
      "🧠 Critical Thinking",
      "🧩 Problem Solving",
      "📐 Math Skills",
      "🔍 Research",
      "📝 Attention to Detail"
    ],
    motivation: "Every big discovery started with someone asking \"Why?\" — keep being curious, keep asking questions, and you'll do amazing things!"
  },
  creative: {
    emoji: "🎨",
    label: "Creative",
    colorClass: "creative",
    subtitle: "You see the world full of colour and ideas! Your imagination makes you special.",
    careers: [
      { icon: "🎨", name: "Designer" },
      { icon: "✍️", name: "Writer" },
      { icon: "🎬", name: "Animator" }
    ],
    skills: [
      "🖌️ Visual Design",
      "💡 Creative Thinking",
      "📖 Storytelling",
      "🎭 Self-Expression",
      "✨ Imagination"
    ],
    motivation: "Every movie, song, and painting you love was made by someone with an imagination just like yours. Keep creating — the world needs your ideas!"
  },
  social: {
    emoji: "🤝",
    label: "Social",
    colorClass: "social",
    subtitle: "You're a people person — kind, caring, and a natural leader. You make everyone around you better!",
    careers: [
      { icon: "🩺", name: "Doctor" },
      { icon: "📚", name: "Teacher" },
      { icon: "🧠", name: "Psychologist" }
    ],
    skills: [
      "🗣️ Communication",
      "👂 Listening",
      "🤝 Teamwork",
      "💛 Empathy",
      "👑 Leadership"
    ],
    motivation: "The world changes when people care about each other — and you're already great at that. Keep leading with your heart!"
  },
  technical: {
    emoji: "💻",
    label: "Technical",
    colorClass: "technical",
    subtitle: "You love gadgets, building things, and making stuff work. You're wired to build the future!",
    careers: [
      { icon: "💻", name: "Programmer" },
      { icon: "🎮", name: "Game Developer" },
      { icon: "🤖", name: "Robotics Engineer" }
    ],
    skills: [
      "⌨️ Coding",
      "🔧 Problem Solving",
      "🧱 Building Systems",
      "📚 Learning New Tech",
      "🔬 Logical Thinking"
    ],
    motivation: "Every app, game, and robot was built by someone who loves technology — just like you. Keep building, keep learning, and shape the future!"
  },
  sports: {
    emoji: "⚽",
    label: "Sporty",
    colorClass: "sports",
    subtitle: "You're active, energetic, and love being on the move! Your energy and teamwork make you a champion.",
    careers: [
      { icon: "⚽", name: "Footballer" },
      { icon: "🏏", name: "Cricketer" },
      { icon: "📋", name: "Sports Coach" }
    ],
    skills: [
      "💪 Physical Fitness",
      "🎯 Focus & Discipline",
      "🤝 Teamwork",
      "🔥 Determination",
      "🏅 Sportsmanship"
    ],
    motivation: "Every champion started as a kid who loved to play. Your energy, discipline, and team spirit will take you far — keep pushing and never give up!"
  }
};


/* ============================================
   📦 STATE VARIABLES
   These track everything during the quiz
   ============================================ */

let currentQuestion = 0;                                          // Which question we're on (0-5)
let selectedAnswers = new Array(questions.length).fill(null);      // User's chosen option per question
let scores = { analytical: 0, creative: 0, social: 0, technical: 0, sports: 0 };  // Category scores


/* ============================================
   🧭 NAVIGATION — show/hide sections
   ============================================ */

function showSection(name) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  // Show the requested one
  document.getElementById(name).classList.add('active');
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ============================================
   ▶️ START QUIZ
   Called when user clicks "Let's Go!"
   ============================================ */

function startQuiz() {
  // Reset everything
  currentQuestion = 0;
  selectedAnswers = new Array(questions.length).fill(null);
  scores = { analytical: 0, creative: 0, social: 0, technical: 0, sports: 0 };

  showSection('quiz');
  renderQuestion();
}


/* ============================================
   ❓ RENDER QUESTION
   Displays current question + options on screen
   ============================================ */

function renderQuestion() {
  const q = questions[currentQuestion];
  const card = document.getElementById('questionCard');
  const letters = ['A', 'B', 'C', 'D', 'E'];

  // Slide-out animation
  card.classList.add('fade-out');

  setTimeout(() => {
    // Update progress bar
    updateProgress();

    // Set question number + text
    document.getElementById('questionNumber').textContent = `Q${currentQuestion + 1}`;
    document.getElementById('questionText').textContent = q.question;

    // Build option buttons
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    q.options.forEach((opt, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';

      // If user already answered this question (going back), mark it
      if (selectedAnswers[currentQuestion] === index) {
        btn.classList.add('selected');
      }

      btn.innerHTML = `
        <span class="option-letter">${letters[index]}</span>
        <span class="option-emoji">${opt.emoji}</span>
        <span class="option-text">${opt.text}</span>
      `;

      // When clicked: select this option
      btn.addEventListener('click', () => selectOption(index));
      container.appendChild(btn);
    });

    // Update Back/Next buttons
    updateNavButtons();

    // Slide-in animation
    card.classList.remove('fade-out');
    card.classList.add('fade-in');
    setTimeout(() => card.classList.remove('fade-in'), 350);
  }, 200);
}


/* ============================================
   ✅ SELECT OPTION
   Called when user clicks one of the answers
   ============================================ */

function selectOption(index) {
  // Save the answer
  selectedAnswers[currentQuestion] = index;

  // Play pop sound
  playPopSound();

  // Highlight the selected button, unhighlight others
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index);
  });

  // Enable the Next button
  document.getElementById('nextBtn').disabled = false;
}


/* ============================================
   ➡️ NEXT QUESTION
   Moves forward or shows results on last question
   ============================================ */

function nextQuestion() {
  if (selectedAnswers[currentQuestion] === null) return;

  playWhooshSound();

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    // Last question → calculate and show results
    calculateScores();
    showResults();
  }
}


/* ============================================
   ⬅️ PREVIOUS QUESTION
   Goes back one question
   ============================================ */

function prevQuestion() {
  if (currentQuestion > 0) {
    playWhooshSound();
    currentQuestion--;
    renderQuestion();
  }
}


/* ============================================
   📊 UPDATE PROGRESS BAR
   Shows "Question X of 6" and fills the bar
   ============================================ */

function updateProgress() {
  const total = questions.length;
  const current = currentQuestion + 1;
  const percent = Math.round((current / total) * 100);

  document.getElementById('progressLabel').textContent = `Question ${current} of ${total}`;
  document.getElementById('progressPercent').textContent = `${percent}%`;
  document.getElementById('progressFill').style.width = `${percent}%`;
}


/* ============================================
   🔘 UPDATE NAV BUTTONS
   Enable/disable Back and Next based on state
   ============================================ */

function updateNavButtons() {
  document.getElementById('prevBtn').disabled = (currentQuestion === 0);
  document.getElementById('nextBtn').disabled = (selectedAnswers[currentQuestion] === null);

  // Change button text on last question
  document.getElementById('nextBtn').innerHTML =
    currentQuestion === questions.length - 1 ? 'See Results ✨' : 'Next →';
}


/* ============================================
   🧮 CALCULATE SCORES
   Adds up points for each category
   ============================================ */

function calculateScores() {
  // Reset scores to zero
  scores = { analytical: 0, creative: 0, social: 0, technical: 0, sports: 0 };

  // Each answered question gives +1 to its category
  selectedAnswers.forEach((answerIndex, questionIndex) => {
    if (answerIndex !== null) {
      const category = questions[questionIndex].options[answerIndex].category;
      scores[category]++;
    }
  });
}


/* ============================================
   🏆 SHOW RESULTS
   Displays the full results screen
   ============================================ */

function showResults() {
  showSection('result');
  playCelebrationSound();

  // Find the category with the highest score
  const topCategory = Object.keys(scores).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  );

  const data = categoryData[topCategory];
  const totalPoints = Object.values(scores).reduce((sum, val) => sum + val, 0);

  // --- Result Header ---
  document.getElementById('resultEmoji').textContent = data.emoji;

  const resultTypeEl = document.getElementById('resultType');
  resultTypeEl.textContent = data.label;

  document.getElementById('resultSubtitle').textContent = data.subtitle;

  // --- Percentage Bars ---
  const barsContainer = document.getElementById('barsContainer');
  barsContainer.innerHTML = '';

  const categoryOrder = ['analytical', 'creative', 'social', 'technical', 'sports'];

  categoryOrder.forEach(cat => {
    const percent = totalPoints > 0 ? Math.round((scores[cat] / totalPoints) * 100) : 0;

    const row = document.createElement('div');
    row.className = 'flex flex-col gap-1.5';
    row.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-display font-bold text-sm text-gray-700">
          ${categoryData[cat].emoji} ${categoryData[cat].label}
        </span>
        <span class="font-display font-bold text-sm text-gray-400">${percent}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill ${cat}" data-width="${percent}"></div>
      </div>
    `;
    barsContainer.appendChild(row);
  });

  // Animate bars filling up (after a short delay so the transition is visible)
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 350);

  // --- Career Chips ---
  const careerGrid = document.getElementById('careerGrid');
  careerGrid.innerHTML = '';

  // Show top category careers (highlighted)
  data.careers.forEach(career => {
    const chip = document.createElement('div');
    chip.className = 'career-chip highlighted';
    chip.innerHTML = `<span class="career-icon">${career.icon}</span><span>${career.name}</span>`;
    careerGrid.appendChild(chip);
  });

  // Show 2 careers from the runner-up category
  const runnerUp = categoryOrder
    .filter(c => c !== topCategory)
    .sort((a, b) => scores[b] - scores[a])[0];

  if (runnerUp) {
    categoryData[runnerUp].careers.slice(0, 2).forEach(career => {
      const chip = document.createElement('div');
      chip.className = 'career-chip';
      chip.innerHTML = `<span class="career-icon">${career.icon}</span><span>${career.name}</span>`;
      careerGrid.appendChild(chip);
    });
  }

  // --- Skills ---
  const skillsList = document.getElementById('skillsList');
  skillsList.innerHTML = '';

  data.skills.forEach(skill => {
    const tag = document.createElement('span');
    tag.className = 'skill-tag';
    tag.textContent = skill;
    skillsList.appendChild(tag);
  });

  // --- Motivational Message ---
  document.getElementById('motivationText').textContent = data.motivation;

  // --- Confetti! 🎉 ---
  launchConfetti();
}


/* ============================================
   🎊 CONFETTI ANIMATION
   Creates colorful falling confetti pieces
   ============================================ */

function launchConfetti() {
  const wrapper = document.getElementById('confettiWrapper');
  wrapper.innerHTML = '';

  const colors = ['#3b82f6', '#7c3aed', '#ec4899', '#10b981', '#f97316', '#06b6d4', '#f43f5e', '#eab308'];

  // Create 50 confetti pieces with random properties
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;             // Random horizontal position (%)
    const delay = Math.random() * 1.5;            // Random start delay
    const duration = 2 + Math.random() * 2;       // 2-4 seconds to fall
    const size = 6 + Math.random() * 10;          // 6-16px size

    piece.style.cssText = `
      background: ${color};
      left: ${left}%;
      width: ${size}px;
      height: ${size * 0.55}px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;

    wrapper.appendChild(piece);
  }

  // Clean up confetti after it finishes falling
  setTimeout(() => { wrapper.innerHTML = ''; }, 5000);
}


/* ============================================
   🔄 RESTART QUIZ
   Goes back to the home screen
   ============================================ */

function restartQuiz() {
  currentQuestion = 0;
  selectedAnswers = new Array(questions.length).fill(null);
  scores = { analytical: 0, creative: 0, social: 0, technical: 0, sports: 0 };
  showSection('home');
}