document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const startContainer = document.getElementById('start-container');
  const quizContainer = document.getElementById('quiz-container');
  const questionElement = document.getElementById('question');
  const optionsContainer = document.getElementById('options-container');
  const scoreElement = document.getElementById('score');
  const nextButton = document.getElementById('nextButton');
  const resultContainer = document.getElementById('result-container');
  const questionNumberElement = document.getElementById('question-number');
  const totalQuestionsElement = document.getElementById('total-questions');
  const timerElement = document.getElementById('timer');
  const timeLeftElement = document.getElementById('time-left');

  const MAX_QUESTIONS = 15;
  const MAX_TIME = 10 * 60; // 10 minutos en segundos
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = MAX_TIME;

  // Cargar las preguntas desde un archivo JSON
  const loadQuestions = async () => {
    try {
      const response = await fetch('preguntas.json');
      const data = await response.json();
      questions = shuffleArray(data).slice(0, MAX_QUESTIONS);
    } catch (error) {
      alert('Error al cargar las preguntas. Intenta de nuevo.');
    }
  };

  // Mezclar las preguntas
  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
    }
    return array;
  };

  // Mostrar la pregunta actual
  const loadQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';
    questionNumberElement.textContent = `Pregunta ${currentQuestionIndex + 1} / ${MAX_QUESTIONS}`;

    currentQuestion.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.classList.add('option');
      optionElement.textContent = option;
      optionElement.addEventListener('click', () => selectAnswer(index, optionElement));
      optionsContainer.appendChild(optionElement);
    });
  };

  // Manejar la selección de una respuesta
  const selectAnswer = (selectedIndex, optionElement) => {
    const correctIndex = questions[currentQuestionIndex].correct;

    // Desactivar opciones después de seleccionar una
    Array.from(optionsContainer.children).forEach(option => {
      option.style.pointerEvents = 'none';
    });

    if (selectedIndex === correctIndex) {
      score++;
      optionElement.classList.add('correct'); // Animación para respuesta correcta
    } else {
      optionElement.classList.add('incorrect'); // Animación para respuesta incorrecta
      // Resaltar la respuesta correcta
      optionsContainer.children[correctIndex].classList.add('correct');
    }

    nextButton.classList.remove('hidden'); // Mostrar el botón siguiente
  };

  // Cargar la siguiente pregunta
  const nextQuestion = () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      loadQuestion();
      nextButton.classList.add('hidden'); // Ocultar el botón siguiente hasta la siguiente pregunta
    } else {
      showResult();
    }
  };

  // Mostrar los resultados al finalizar el cuestionario
  const showResult = () => {
    clearInterval(timer); // Detener el temporizador
    quizContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreElement.textContent = `Puntaje: ${score} de ${MAX_QUESTIONS}`;
  };

  // Iniciar el temporizador
  const startTimer = () => {
    timerElement.classList.remove('hidden');
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeLeftElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      } else {
        clearInterval(timer); // Detener el temporizador cuando se acabe el tiempo
        showResult(); // Mostrar los resultados
      }
    }, 1000);
  };

  // Iniciar el cuestionario
  startButton.addEventListener('click', () => {
    if (questions.length === 0) {
      alert('Las preguntas no se han cargado correctamente. Intenta de nuevo.');
      return;
    }
    startContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    startTimer(); // Iniciar el temporizador al comenzar el juego
    loadQuestion();
  });

  // Acción de siguiente pregunta
  nextButton.addEventListener('click', nextQuestion);

  // Cargar las preguntas al inicio
  loadQuestions();
});
