// Main Orchestrator: Screen transitions, finale celebration, and audio bindings

let gameInstance = null;
let introInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Intro Animation
  introInstance = new IntroManager();

  // 2. Button: "JUGAR CARRERA" from the delivered letter
  const btnPlayRace = document.getElementById('btn-play-race');
  if (btnPlayRace) {
    btnPlayRace.addEventListener('click', () => {
      window.soundManager.init();
      window.soundManager.playClick();

      // Transition from Intro -> Car Select Garage
      const introScreen = document.getElementById('screen-intro');
      const garageScreen = document.getElementById('screen-garage');

      introScreen.classList.add('fade-out');
      setTimeout(() => {
        introScreen.style.display = 'none';
        garageScreen.style.display = 'flex';
        garageScreen.classList.add('fade-in');
        if (introInstance) {
          requestAnimationFrame(() => {
            introInstance.onGarageShown();
            setTimeout(() => introInstance.onGarageShown(), 60);
            setTimeout(() => introInstance.onGarageShown(), 200);
          });
        }
      }, 400);
    });
  }

  // 3. Button: "¡CORRER FASE 1!" from Car Select Garage
  const btnStartRace = document.getElementById('btn-start-race');
  if (btnStartRace) {
    btnStartRace.addEventListener('click', () => {
      window.soundManager.playClick();

      const garageScreen = document.getElementById('screen-garage');
      const raceScreen = document.getElementById('screen-race');

      garageScreen.classList.add('fade-out');
      setTimeout(() => {
        garageScreen.style.display = 'none';
        raceScreen.style.display = 'block';
        raceScreen.classList.add('fade-in');

        // Initialize or re-setup 3D Racing Game
        if (!gameInstance) {
          gameInstance = new RacingGame();
        }
        gameInstance.setupPhase(0, introInstance.selectedCarId);
      }, 500);
    });
  }

  // 4. Retry Phase button in Results Modal
  const btnRetry = document.getElementById('btn-retry-phase');
  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      window.soundManager.playClick();
      const modal = document.getElementById('results-modal');
      modal.style.display = 'none';
      if (gameInstance) {
        gameInstance.setupPhase(gameInstance.currentPhaseIndex, gameInstance.playerCarData.id);
      }
    });
  }

  // 5. Mute Audio Toggle
  const btnMute = document.getElementById('btn-sound-toggle');
  if (btnMute) {
    btnMute.addEventListener('click', () => {
      window.soundManager.init();
      const isMuted = window.soundManager.toggleMute();
      btnMute.innerText = isMuted ? 'AUDIO [ OFF ]' : 'AUDIO [ ON ]';
    });
  }
});

// Grand Champion Finale Screen (After completing Phase 3)
window.showGrandFinale = function(playerCarData) {
  const raceScreen = document.getElementById('screen-race');
  const finaleScreen = document.getElementById('screen-finale');

  if (raceScreen) raceScreen.style.display = 'none';
  if (finaleScreen) {
    finaleScreen.style.display = 'flex';
    finaleScreen.classList.add('fade-in');

    const carNameEl = document.getElementById('finale-car-name');
    if (carNameEl) {
      carNameEl.innerText = `${playerCarData.name} (${playerCarData.category})`;
      carNameEl.style.color = playerCarData.color;
    }

    // Launch Confetti Celebration
    launchConfetti();
    window.soundManager.playVictory();
  }

  const btnReplayAll = document.getElementById('btn-replay-all');
  if (btnReplayAll) {
    btnReplayAll.addEventListener('click', () => {
      window.soundManager.playClick();
      window.location.reload();
    });
  }
};

// Lightweight Procedural Confetti for the Grand Finale
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const colors = ['#f1c40f', '#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#e67e22', '#00f0ff', '#ff007f'];

  for (let i = 0; i < 160; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8,
      w: 8 + Math.random() * 8,
      h: 5 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vRot;

      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    requestAnimationFrame(renderConfetti);
  }

  renderConfetti();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
