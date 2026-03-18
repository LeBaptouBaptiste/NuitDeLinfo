'use client';
import { useState, useEffect } from "react";
import './style.css'; // Assurez-vous que le chemin est correct
import { increaseCookies, handleFishEvents } from './cookieFunction'; // Importez vos fonctions
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { checkAdPopup } from './adPopup';


export default function FishClicker() {
  const [fishCount, setFishCount] = useState(0);
  const [cookies, setCookies] = useState(0);
  const [fishPosition, setFishPosition] = useState({ left: 100, top: 100 });
  const [clickMultiplier, setClickMultiplier] = useState(1);
  const [clickUpgradeCost, setClickUpgradeCost] = useState(2);
  const [autoClickers, setAutoClickers] = useState(0);
  const [autoClickerCost, setAutoClickerCost] = useState(3);
  const [hooks, setHooks] = useState([]); // État pour les hooks
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState(null);
  const [fishSize, setFishSize] = useState(256); // Taille du poisson
  const [spin, setSpin] = useState(false); // État pour l'animation
  const [fishJump, setFishJump] = useState(false); // État pour le saut du poisson
  const [isFishDead, setIsFishDead] = useState(false);
  const [upgradeCount, setUpgradeCount] = useState(0); // Ajout de l'état upgradeCount
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const clickMultipliers = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
  ];
  const [buttonPositions, setButtonPositions] = useState([
    { id: 1, top: 0, left: 0 },
    { id: 2, top: 0, left: 100 },
  ]);
  const router = useRouter(); // Initialiser le routeur

  const handleHome = () => {
    router.push('/'); // Rediriger vers /
  };
 

  // Gestion des clics sur le poisson
// Gestion des clics sur le poisson
const handleClick = (event) => {
  // Utilise setFishCount pour incrémenter fishCount
  setFishCount((prevCount) => {
      const newFishCount = prevCount + 1;
      checkAdPopup(newFishCount); // Passe le nouveau count à checkAdPopup
      return newFishCount; // Retourne le nouveau count
  });

  if (isClickInsideFish(event.clientX, event.clientY)) {
      increaseCookies(cookies, setCookies, clickMultiplier);

      setClickCount((prevCount) => {
          const newClickCount = prevCount + 1;

          // Vérifiez si le compteur de clics a atteint 5
          if (newClickCount >= 5) {
              moveFishAwayFromMouse(event.clientX, event.clientY, true);
              setFishJump(true); // Indique que le poisson doit sauter
              setTimeout(() => setFishJump(false), 300); // Réinitialise après 0.3 secondes
              return 0; // Réinitialiser le compteur
          }

          if (clickTimeout) {
              clearTimeout(clickTimeout);
          }

          const timeoutId = setTimeout(() => {
              setClickCount(0);
          }, 1000);
          setClickTimeout(timeoutId);

          return newClickCount;
      });
  }
};

  


// Amélioration du clic
const handleClickUpgrade = () => {
  if (cookies >= clickUpgradeCost) {
    setCookies(cookies - clickUpgradeCost);
    setUpgradeCount(prevCount => {
      const newUpgradeCount = prevCount + 1;

      // Vérifiez si le poisson est mort
      if (newUpgradeCount === 22) {
        setIsFishDead(true);
        return newUpgradeCount;
      }

      return newUpgradeCount;
    });

    // Définit le multiplicateur de clics à partir du tableau
    if (upgradeCount < clickMultipliers.length) {
      setClickMultiplier(clickMultipliers[upgradeCount]);
    }

    if(clickUpgradeCost < 400) {
      setClickUpgradeCost(Math.floor(clickUpgradeCost * 1)); 
    }
    else {
      setClickUpgradeCost(Math.floor(clickUpgradeCost * 1.2)); 
    }
  }
};




const getBackgroundColor = () => {
  if (upgradeCount < 11) {
    return { background: 'linear-gradient(to bottom, #000080, #000080)' }; // Bleu marine foncé
  } else if (upgradeCount >= 11 && upgradeCount <= 21) {
    const ratio = (upgradeCount - 11) / 10;
    const blueValue = Math.round(128 * (1 - ratio)); // Réduit la valeur de bleu à 128 (teinte plus foncée)
    const greenValue = Math.round(0 + 128 * ratio); // Commence à 0 et augmente jusqu'à 128 (teinte plus foncée)

    return { background: `linear-gradient(to bottom, rgb(0, ${greenValue}, ${blueValue}), rgb(0, ${greenValue}, ${blueValue}))` }; // Transition dynamique avec des couleurs plus sombres
  } else {
    return { background: 'linear-gradient(to bottom, #006400, #006400)' }; // Vert foncé (#006400)
  }
};


  // Achat d'un autoclicker
  const handleAutoClickerPurchase = () => {
    if (cookies >= autoClickerCost && autoClickers < 10) {
      setCookies(cookies - autoClickerCost);
      setAutoClickers(autoClickers + 1);
  
      // Ajoute un hook avec un angle et un rayon aléatoires autour du poisson
      setHooks((prevHooks) => [
        ...prevHooks,
        {
          id: prevHooks.length,
          angle: Math.random() * 2 * Math.PI, // Angle aléatoire autour du cercle
          radius: (fishSize / 2) - 15  // Rayon légèrement inférieur au rayon du poisson
        }
      ]);
  
      setAutoClickerCost(Math.floor(autoClickerCost * 1.5)); // Augmente le coût
    }
  };
  
  
  
  
  
  
  

  // Clics automatiques
  useEffect(() => {
    if (autoClickers > 0) {
      const interval = setInterval(() => {
        setCookies((prevCookies) => prevCookies + autoClickers);
      }, 1000); // Un clic automatique par seconde
      return () => clearInterval(interval); // Nettoyage
    }
  }, [autoClickers, setCookies]);

  useEffect(() => {
    let lastMoveTime = 0; // Dernière fois que le poisson s'est déplacé
  
    const handleMouseMove = (event) => {
      const now = Date.now();
      if (now - lastMoveTime < 200) return; // Déplace le poisson toutes les 200 ms max
      lastMoveTime = now;
  
      const { clientX, clientY } = event;
      moveFishAwayFromMouse(clientX, clientY);
    };
  
    window.addEventListener("mousemove", handleMouseMove);
  
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (cookies > 0 && cookies % 25 === 0) {
      handleFishEvents(cookies, setFishSize, setSpin);
    }
  }, [cookies, setFishSize, setSpin]);

  useEffect(() => {
    const updateHooks = () => {
      setHooks((prevHooks) =>
        prevHooks.map((hook) => {
          // Calculer les nouvelles positions en utilisant les angles et les rayons
          const newLeft = fishPosition.left + (fishSize / 2) + hook.radius * Math.cos(hook.angle);
          const newTop = fishPosition.top + (fishSize / 2) + hook.radius * Math.sin(hook.angle);
          
          return {
            ...hook,
            left: newLeft,
            top: newTop,
            angle: hook.angle + (Math.random() * 0.2 - 0.1) // Ajouter un léger mouvement de l'angle
          };
        })
      );
    };


    const interval = setInterval(updateHooks, 1000); // Met à jour toutes les secondes
  
    // Mettre à jour immédiatement lorsque le poisson bouge
    updateHooks();
  
    return () => clearInterval(interval); // Nettoyage
  }, [fishPosition]); // Dépend de fishPosition
  
  useEffect(() => {
    const interval = setInterval(() => {
      moveButtons();
    }, 2000); // Déplace les boutons toutes les 2 secondes
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    setFishCount((prevCount) => prevCount + 1); // Incrémente fishCount chaque fois que le composant se monte
  }, []);




  const moveButtons = () => {
    const buttonWidth = 150; // Largeur estimée du bouton
    const screenRightStart = window.innerWidth / 2; // Début de la moitié droite
    const screenRightEnd = window.innerWidth - buttonWidth; // Fin de la moitié droite
  
    setButtonPositions((prevPositions) =>
      prevPositions.map((pos) => {
        const newTop = Math.random() * (window.innerHeight - 50); // Évite de dépasser en hauteur
        const newLeft = Math.random() * (screenRightEnd - screenRightStart) + screenRightStart; // Positionne dans la moitié droite
  
        return { ...pos, top: newTop, left: newLeft };
      })
    );
  };
  
  
  
  

  // Vérifie si un clic est dans le poisson
  const isClickInsideFish = (mouseX, mouseY) => {
    const fishWidth = fishSize;
    const fishHeight = fishSize;
    const fishLeft = fishPosition.left;
    const fishTop = fishPosition.top;

    return (
      mouseX >= fishLeft &&
      mouseX <= fishLeft + fishWidth &&
      mouseY >= fishTop &&
      mouseY <= fishTop + fishHeight
    );
  };


  const moveFishAwayFromMouse = (mouseX, mouseY, forceMove = false) => {
    setFishPosition((prevPosition) => {
      const fishWidth = fishSize;
      const fishHeight = fishSize;
      const fishCenterX = prevPosition.left + fishWidth / 2;
      const fishCenterY = prevPosition.top + fishHeight / 2;
  
      const distanceXFromMouse = fishCenterX - mouseX;
      const distanceYFromMouse = fishCenterY - mouseY;
  
      let newLeft = prevPosition.left;
      let newTop = prevPosition.top;
  
      // Ajustez `moveAmount` pour ralentir le déplacement
      const moveAmount = forceMove ? 100 : 40;
  
      if (Math.abs(distanceXFromMouse) < 150) {
        newLeft += distanceXFromMouse > 0 ? moveAmount : -moveAmount;
      }
  
      if (Math.abs(distanceYFromMouse) < 150) {
        newTop += distanceYFromMouse > 0 ? moveAmount : -moveAmount;
      }
  
      // Garde le poisson dans les limites de la moitié gauche de l'écran
      const maxWidth = window.innerWidth / 2 - fishWidth; // Milieu de l'écran
      const maxHeight = window.innerHeight - fishHeight; // Bas de l'écran
  
      newLeft = Math.min(Math.max(0, newLeft), maxWidth);
      newTop = Math.min(Math.max(0, newTop), maxHeight);
  
      return { left: newLeft, top: newTop };
    });
  };

  // Rendu principal
  return (
    <div className="flex flex-col min-h-screen text-white" style={getBackgroundColor()}>
      <div className="absolute top-4 right-4">
      <div className="flex justify-center items-center mt-10">
        <Link href="/">
          <div
          onClick={() => handleHome()}
            className="relative inline-block px-8 py-4 font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full shadow-lg hover:from-indigo-600 hover:to-sky-500 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 ease-in-out"
          >
            <span className="absolute inset-0 transition-transform duration-300 transform -translate-x-1 -translate-y-1 bg-indigo-700 rounded-full hover:translate-x-0 hover:translate-y-0"></span>
            <span className="relative">Page d&apos;accueil</span>
          </div>
        </Link>
      </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`bg-${isDarkMode ? 'white' : 'black'} text-${isDarkMode ? 'black' : 'white'} font-bold py-2 px-4 rounded`}
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="flex flex-col items-start justify-center h-20 p-4">
        <h1 className="text-4xl font-bold text-pink-500 drop-shadow-lg">Fish Clicker</h1>
        <p className="text-2xl">
          Nombre de poissons : <span className="font-extrabold text-yellow-400">{cookies}</span>
        </p>
      </div>
  
      <div className="flex w-full">
        <div className="flex flex-col items-center justify-center w-1/2 relative">
          {/* Affichage du poisson */}
          <div
            onClick={handleClick}
            className={`relative cursor-pointer fish ${spin ? 'spin' : ''} ${fishJump ? 'jump' : ''}`}
            style={{
              width: `${fishSize}px`,
              height: `${fishSize}px`,
              borderRadius: '128px',
              border: 'none',
              overflow: 'hidden',
              position: 'absolute',
              left: `${fishPosition.left}px`,
              top: `${fishPosition.top}px`,
              zIndex: 1000,
              transition: 'width 0.2s, height 0.2s', // Animation de taille
              transform: fishJump ? 'translateY(-20px)' : 'translateY(0)', 
            }}
          >
            <img src="/images/cookie.png" alt="Cookie" className="w-full h-full object-contain" />
          </div>
          {/* Affichage des hooks */}
          {hooks.map((hook) => (
            <img
              key={hook.id}
              src="/images/hook.png" // Assurez-vous que le chemin de l'image est correct
              alt="Hook"
              className="absolute"
              style={{
                left: `${hook.left}px`,
                top: `${hook.top}px`,
                width: '50px', // Ajustez la taille si nécessaire
                height: '50px', // Ajustez la taille si nécessaire
              }}
            />
          ))}
        </div>
  
        <div className="w-1 border-l border-gray-700" />

        <div id="ad-popup" className="hidden">
          <div className="popup-content">
            <span id="popup-close" className="close">&times;</span>
            <p id="popup-message"></p>
          </div>
        </div>

  
        <div className="flex flex-col items-center justify-center w-1/2">
          <h2 className="text-3xl font-bold">Améliorations</h2>
          <div className="flex flex-col space-y-2">
          <button
            onClick={handleClickUpgrade}
            className={`absolute ${
              isDarkMode ? 'bg-pink-500 text-white hover:bg-pink-600' : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            } font-bold py-2 px-4 rounded`}
            style={{
              top: `${buttonPositions[0].top}px`,
              left: `${buttonPositions[0].left}px`,
            }}
          >
            Nourrir les poissons (améliore les clics) [{clickUpgradeCost} poissons]
          </button>

          <button
            onClick={handleAutoClickerPurchase}
            className={`absolute ${
              isDarkMode ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-green-500 hover:bg-green-600 text-white'
            } font-bold py-2 px-4 rounded ${autoClickers >= 10 ? 'disabled-button' : ''}`}
            disabled={autoClickers >= 10}
            style={{
              top: `${buttonPositions[1].top}px`,
              left: `${buttonPositions[1].left}px`,
            }}
          >
            {autoClickers >= 10 ? 'Trop de pêcheurs' : `Acheter un pêcheur [${autoClickerCost} poissons]`}
          </button>

          </div>
        </div>
      </div>
  
      {isFishDead && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-red-600 text-white p-5 rounded">
            <h2 className="text-2xl font-bold">Le poisson est mort !</h2>
            <p>Vous l&apos;avez tellement nourrie que vous avez pollué son environnement. Le poisson ne peut plus vivre dans cette pollution.</p>
            <button 
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => setIsFishDead(false)} // Pour fermer le message
            >
              OK
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowRules(true)}
        className="fixed bottom-2 left-2 bg-blue-500 text-white hover:bg-blue-600 font-bold py-1 px-3 rounded-full"
      >
        ?
      </button>
      {showRules && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black max-w-sm">
            <h2 className="text-xl font-bold mb-4">Règles du jeu</h2>
            <ul className="list-disc pl-5">
              <li>Cliquez sur le poisson pour en gagner.</li>
              <li>Achetez des pêcheurs pour qu&apos;ils pêchent pour vous.</li>
              <li>Nourrissez le poisson pour en gagner plus à chaque fois</li>
              <li>Cette nourriture n&apos;est peut-être pas très bonne pour le poisson...</li>
            </ul>
            <button
              onClick={() => setShowRules(false)}
              className="mt-4 bg-red-500 text-white hover:bg-red-600 font-bold py-2 px-4 rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      

    </div>
  );
  
  
  
}
