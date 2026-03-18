"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CaptchaGame: React.FC = () => {
  const router = useRouter(); // Initialiser le routeur

  const handleGame = React.useCallback(() => {
    router.push('/CookieClicker'); // Rediriger vers /quiz
  }, [router]);

  useEffect(() => {
    const checkbox = document.getElementById('checkbox') as HTMLInputElement;
    const gameCanvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    const successMessage = document.getElementById('captchaSuccessMessage') as HTMLElement;
    const failureMessage = document.getElementById('captchaFailureMessage') as HTMLElement;
    const retryButton = document.getElementById('retryButton') as HTMLButtonElement;
    const captchaText = document.getElementById('captchaText') as HTMLElement;

    const ctx = gameCanvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get canvas context");
      return;
    }

    const fishImage = new Image();
    fishImage.src = '/images/OceanFish.png';

    // Initialisation des variables du jeu
    const fish = { x: 100, y: 300, width: 50, height: 30, speed: 0, gravity: 0.5, jump: -10 };
    const pipes: { x: number, topY: number, bottomY: number, width: number, gap: number, passed: boolean }[] = [];
    let isGameOver = false;
    let passedPipes = 0; // Nombre de tuyaux passés
    let gameTime = 0; // Temps écoulé en secondes
    const pipeInterval = 1500; // Intervalle en ms entre les tuyaux
    let timerInterval: NodeJS.Timeout;
    let isGameWon = false;

    const drawFish = () => {
      ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // Efface le canvas
      ctx.drawImage(fishImage, fish.x, fish.y, fish.width, fish.height); // Dessine le poisson
    };

    const drawPipes = () => {
      ctx.fillStyle = 'green';
      pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topY); // Tuyau supérieur
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, gameCanvas.height - pipe.bottomY); // Tuyau inférieur
      });
    };

    const moveFish = () => {
      fish.speed += fish.gravity; // Applique la gravité
      fish.y += fish.speed; // Déplace le poisson

      // Limite le mouvement du poisson au canevas
      if (fish.y + fish.height >= gameCanvas.height) {
        fish.y = gameCanvas.height - fish.height;
        fish.speed = 0;
      }

      if (fish.y <= 0) {
        fish.y = 0;
        fish.speed = 0;
      }
    };

    const movePipes = () => {
      pipes.forEach((pipe, index) => {
        pipe.x -= 4; // Déplace les tuyaux vers la gauche

        // Supprime les tuyaux qui sont sortis du canvas
        if (pipe.x + pipe.width < 0) {
          pipes.splice(index, 1);
        }

        // Vérifie si le poisson a franchi un tuyau
        if (!pipe.passed && pipe.x + pipe.width < fish.x) {
          passedPipes++;
          pipe.passed = true; // Marque le tuyau comme franchi
        }
      });

      // Ajoute un nouveau tuyau si nécessaire
      if (pipes.length === 0 || pipes[pipes.length - 1].x < gameCanvas.width - pipeInterval) {
        const topY = Math.random() * (gameCanvas.height / 2); // Position aléatoire du tuyau supérieur
        const bottomY = topY + Math.random() * 150 + 150; // Position aléatoire du tuyau inférieur
        pipes.push({ x: gameCanvas.width, topY, bottomY, width: 50, gap: 150, passed: false });
      }
    };

    const checkCollisions = () => {
      // Vérifie les collisions entre le poisson et les tuyaux
      for (const pipe of pipes) {
        if (fish.x + fish.width > pipe.x && fish.x < pipe.x + pipe.width) {
          if (fish.y < pipe.topY || fish.y + fish.height > pipe.bottomY) {
            isGameOver = true;
            failureMessage.style.display = 'flex';  // Affiche le message d'échec
            retryButton.style.display = 'inline-block';  // Affiche le bouton pour recommencer
            return;
          }
        }
      }

      // Vérifie si le poisson touche le sol ou le plafond
      if (fish.y + fish.height >= gameCanvas.height || fish.y <= 0) {
        isGameOver = true;
        failureMessage.style.display = 'flex';  // Affiche le message d'échec
        retryButton.style.display = 'inline-block';  // Affiche le bouton pour recommencer
      }
    };

    const gameLoop = () => {
      if (isGameOver || isGameWon) return;

      moveFish();
      movePipes();
      drawFish();
      drawPipes();
      checkCollisions();

      // Vérifie les conditions de victoire
      if (passedPipes >= 2 || gameTime >= 5) {
        isGameWon = true;
        captchaText.innerHTML = 'Vous n\'êtes pas un robot'; // Remplace le texte du captcha
        retryButton.style.display = 'inline-block';  // Affiche le bouton pour recommencer
        gameCanvas.style.display = 'none';  // Cache le canvas
        setTimeout(() => {
          handleGame();
        }, 2000);
        return;
      }

      requestAnimationFrame(gameLoop); // Continue la boucle de jeu
    };

    const startGame = () => {
      checkbox.disabled = true
      gameCanvas.style.display = 'block';  // Affiche le canvas
      successMessage.style.display = 'none';  // Cache le message de succès
      failureMessage.style.display = 'none';  // Cache le message d'échec
      retryButton.style.display = 'none';  // Cache le bouton de réessayer
      isGameOver = false;
      isGameWon = false;
      passedPipes = 0;
      gameTime = 0;  // Réinitialise le temps écoulé
      pipes.length = 0;  // Réinitialise les tuyaux
      fish.y = 300; // Réinitialise la position du poisson
      fish.speed = 0; // Réinitialise la vitesse du poisson

      // Démarre un chronomètre pour compter le temps de jeu
      timerInterval = setInterval(() => {
        gameTime++;
      }, 1000); // Incrémente le temps chaque seconde

      gameLoop(); // Démarre la boucle de jeu
    };

    const handleJump = () => {
      if (isGameOver || isGameWon) return;

      fish.speed = fish.jump;  // Le poisson saute
    };

    // Démarre le jeu lorsque la case est cochée
    checkbox.addEventListener('change', (e) => {
      if ((e.target as HTMLInputElement).checked) {
        startGame();
      }
    });

    // Gère le saut du poisson lorsque la barre d'espace est appuyée
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        handleJump();
      }
    });

    // Redémarre le jeu en cas d'échec
    retryButton?.addEventListener('click', () => {
      startGame();
      clearInterval(timerInterval); // Réinitialise le chronomètre
    });
  }, [handleGame]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div id="captcha-container" className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg w-[350px] h-[250px] relative">
        <label id="captchaText" className="text-center mb-4">
          <input type="checkbox" id="checkbox" className="mr-2" />
          Survivez 5 secondes ou passez 2 tuyaux pour <strong>prouver que vous n&apos;êtes pas un robot</strong>
        </label>
        <canvas id="gameCanvas" width="400" height="600" className="border bg-gradient-to-b from-blue-400 to-blue-600 hidden mb-4"></canvas>

        {/* Message de succès */}
        <div id="captchaSuccessMessage" className="hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex justify-center items-center z-50">
          <p className="text-white text-2xl">Captcha validé</p>
        </div>

        {/* Message d'échec */}
        <div id="captchaFailureMessage" className="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white shadow-lg rounded-lg">
          <div id="overlay"></div>
          <div id="failureMessageContent">
            <button id="retryButton" className="bg-red-500 text-white p-2 rounded hover:bg-red-400 hidden">Recommencer</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptchaGame;
