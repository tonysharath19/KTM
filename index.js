function openMenu() {
    document.getElementById("sideMenu").style.width = "250px";
    playClickSound();
  }

  function closeMenu() {
    document.getElementById("sideMenu").style.width = "0";
    playClickSound();
  }

  // Preload audio for instant playback - OPTIMIZED
  let audioBuffer = null;
  let audioContext = null;
  let preloadedAudios = []; // Array of preloaded HTML5 audio elements
  const MAX_PRELOADED = 5; // Keep 5 audio elements ready
  let isAudioPlaying = false; // Flag to prevent overlapping audio
  let currentAudio = null; // Track current playing audio
  let lastPlayTime = 0; // Track last play time to prevent rapid clicks
  const MIN_AUDIO_INTERVAL = 150; // Minimum 150ms between audio plays

  // Initialize audio context and preload sound
  function initializeAudio() {
    try {
      // Create audio context immediately
      audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Try to load audio file - handle CORS issues for local files
      const audioSrc = 'Media/audio/S.mp3';

      // Method 1: Try using XMLHttpRequest for local files
      const xhr = new XMLHttpRequest();
      xhr.open('GET', audioSrc, true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = function() {
        if (this.status === 200) {
          audioContext.decodeAudioData(this.response)
            .then(audioBufferData => {
              audioBuffer = audioBufferData;
              console.log('Audio preloaded successfully via XMLHttpRequest');
            })
            .catch(error => {
              console.log('XMLHttpRequest decode failed:', error);
            });
        } else {
          console.log('XMLHttpRequest failed with status:', this.status);
        }
      };

      xhr.onerror = function() {
        console.log('XMLHttpRequest failed - trying fetch fallback');
        // Fallback to fetch method
        fetch(audioSrc)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
          .then(audioBufferData => {
            audioBuffer = audioBufferData;
            console.log('Audio preloaded successfully via fetch fallback');
          })
          .catch(error => {
            console.log('Fetch fallback failed:', error);
          });
      };

      xhr.send();

      // Preload HTML5 audio elements for fallback
      preloadHTML5Audios();

    } catch (error) {
      console.log('Web Audio API not supported, using HTML5 fallback only');
      preloadHTML5Audios();
    }
  }

  // Preload multiple HTML5 audio elements for instant playback
  function preloadHTML5Audios() {
    for (let i = 0; i < MAX_PRELOADED; i++) {
      const audio = new Audio('Media/audio/S.mp3');
      audio.volume = 0.8;
      audio.preload = 'auto';
      audio.load(); // Force load immediately
      preloadedAudios.push(audio);
    }
    console.log('HTML5 audio elements preloaded:', MAX_PRELOADED);
  }

  // Get next available preloaded audio
  function getNextPreloadedAudio() {
    const audio = preloadedAudios.shift(); // Get first available
    preloadedAudios.push(audio); // Put it back at the end for reuse
    return audio;
  }

  // Play sound instantly using preloaded buffer or fallback
  function playClickSound() {
    const now = Date.now();

    // Debouncing: Don't play if too recent (prevents rapid clicking interruption)
    if (now - lastPlayTime < MIN_AUDIO_INTERVAL) {
      console.log('Click too rapid, skipping to prevent audio interruption');
      return;
    }

    lastPlayTime = now;

    // Stop any currently playing audio first
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      } catch (e) {
        console.log('Error stopping current audio:', e);
      }
    }

    // Prevent overlapping audio - if audio is already playing, skip this click
    if (isAudioPlaying) {
      console.log('Audio already playing, skipping this click');
      return;
    }

    console.log('Playing click sound instantly...');
    isAudioPlaying = true;

    // Method 1: Use preloaded HTML5 audio (fastest)
    if (preloadedAudios.length > 0) {
      try {
        const audio = getNextPreloadedAudio();
        audio.currentTime = 0; // Reset to beginning
        currentAudio = audio; // Track current audio

        // Add event listener to reset flag when audio ends
        audio.onended = function() {
          isAudioPlaying = false;
          currentAudio = null;
          console.log('Audio finished playing');
        };

        // Add error handler
        audio.onerror = function() {
          isAudioPlaying = false;
          currentAudio = null;
          console.log('Audio error occurred');
        };

        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Audio played instantly via preloaded HTML5');
          }).catch(error => {
            console.log('Preloaded HTML5 failed:', error);
            isAudioPlaying = false;
            currentAudio = null;
            // Fallback to Web Audio API
            playWebAudio();
          });
        } else {
          console.log('Audio played instantly via preloaded HTML5 (no promise)');
          // Set a timeout to reset the flag after audio duration
          setTimeout(() => {
            isAudioPlaying = false;
            currentAudio = null;
          }, 200); // Assume 200ms audio duration
        }
        return;
      } catch (error) {
        console.log('Preloaded HTML5 failed:', error);
        isAudioPlaying = false;
        currentAudio = null;
      }
    }

    // Method 2: Web Audio API (instant playback)
    if (audioBuffer && audioContext) {
      try {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();

        source.buffer = audioBuffer;
        gainNode.gain.value = 0.8;

        gainNode.connect(audioContext.destination);
        source.connect(gainNode);

        // Reset flag when audio ends
        source.onended = function() {
          isAudioPlaying = false;
          currentAudio = null;
          console.log('Web Audio finished playing');
        };

        source.start(0);
        console.log('Audio played instantly via Web Audio API');
        return;
      } catch (error) {
        console.log('Web Audio API failed:', error);
        isAudioPlaying = false;
        currentAudio = null;
      }
    }

    // Method 3: Direct HTML5 Audio (fallback)
    const audio = new Audio('Media/audio/S.mp3');
    audio.volume = 0.8;
    audio.preload = 'auto';
    currentAudio = audio;

    // Reset flag when audio ends
    audio.onended = function() {
      isAudioPlaying = false;
      currentAudio = null;
      console.log('Direct HTML5 audio finished playing');
    };

    // Add error handler
    audio.onerror = function() {
      isAudioPlaying = false;
      currentAudio = null;
      console.log('Direct HTML5 audio error');
    };

    audio.play().then(() => {
      console.log('Audio played via direct HTML5 Audio');
    }).catch(error => {
      console.log('Direct HTML5 Audio failed:', error);
      isAudioPlaying = false;
      currentAudio = null;

      // Method 4: Create element method (last resort)
      const audioElement = document.createElement('audio');
      audioElement.src = 'Media/audio/S.mp3';
      audioElement.volume = 0.8;
      currentAudio = audioElement;

      audioElement.onended = function() {
        isAudioPlaying = false;
        currentAudio = null;
        console.log('CreateElement audio finished playing');
      };

      audioElement.onerror = function() {
        isAudioPlaying = false;
        currentAudio = null;
        console.log('CreateElement audio error');
      };

      audioElement.play().then(() => {
        console.log('Audio played via createElement method');
      }).catch(e => {
        console.log('All audio methods failed:', e);
        isAudioPlaying = false;
        currentAudio = null;
      });
    });
  }

  // Fallback method using Web Audio API
  function playWebAudio() {
    if (audioBuffer && audioContext) {
      try {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();

        source.buffer = audioBuffer;
        gainNode.gain.value = 0.8;

        gainNode.connect(audioContext.destination);
        source.connect(gainNode);

        // Reset flag when audio ends
        source.onended = function() {
          isAudioPlaying = false;
          currentAudio = null;
          console.log('Web Audio fallback finished playing');
        };

        source.start(0);
        console.log('Audio played via Web Audio API fallback');
      } catch (error) {
        console.log('Web Audio API fallback failed:', error);
        isAudioPlaying = false;
        currentAudio = null;
      }
    } else {
      isAudioPlaying = false;
      currentAudio = null;
    }
  }

  // Function to add click sound to ALL buttons including hamburger
  function initializeButtonSounds() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
      console.log('Initializing button sounds...');

      // Get all buttons - including hamburger
      const buttons = document.querySelectorAll('button');
      console.log('Found buttons:', buttons.length);

      buttons.forEach((button, index) => {
        console.log('Adding audio to button:', index, button.className, button.textContent);

        // Add click event listener to play sound
        button.addEventListener('click', function(e) {
          console.log('Button clicked:', this.className, this.textContent);
          playClickSound();
        });
      });

      // Also add to navigation links
      const navLinks = document.querySelectorAll('.side-nav a, .home-btn');
      console.log('Found navigation links:', navLinks.length);

      navLinks.forEach((link, index) => {
        console.log('Adding audio to nav link:', index, link.textContent);

        link.addEventListener('click', function(e) {
          console.log('Nav link clicked:', this.textContent);
          playClickSound();
        });
      });

      // Add to contact buttons
      const contactBtns = document.querySelectorAll('.contact-btn');
      console.log('Found contact buttons:', contactBtns.length);

      contactBtns.forEach((btn, index) => {
        console.log('Adding audio to contact button:', index);

        btn.addEventListener('click', function(e) {
          console.log('Contact button clicked');
          playClickSound();
        });
      });

      // Add to form submit buttons
      const submitBtns = document.querySelectorAll('button[type="submit"]');
      console.log('Found submit buttons:', submitBtns.length);

      submitBtns.forEach((btn, index) => {
        console.log('Adding audio to submit button:', index);

        btn.addEventListener('click', function(e) {
          console.log('Submit button clicked');
          playClickSound();
        });
      });

      // Add to ALL links (in case some are missed)
      const allLinks = document.querySelectorAll('a');
      console.log('Found all links:', allLinks.length);

      allLinks.forEach((link, index) => {
        // Skip if already handled above
        if (link.classList.contains('home-btn') || link.closest('.side-nav') || link.classList.contains('contact-btn')) {
          return;
        }

        console.log('Adding audio to additional link:', index, link.textContent);

        link.addEventListener('click', function(e) {
          console.log('Additional link clicked:', this.textContent);
          playClickSound();
        });
      });
    });
  }

  // Initialize audio preload and button sounds when script loads
  initializeAudio();
  initializeButtonSounds();
  