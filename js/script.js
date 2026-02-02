document.addEventListener('DOMContentLoaded', function() {
    // Optimasi: Matikan animasi kompleks jika performa rendah
    const isLowPerformance = checkPerformance();
    
    if (isLowPerformance) {
        document.body.classList.add('low-performance');
        console.log('Performance mode: Reduced animations enabled');
    }
    
    // Elements
    const screens = document.querySelectorAll('.screen');
    const btnYes = document.querySelector('.btn-yes');
    const btnNo = document.querySelector('.btn-no');
    const homeIcon = document.querySelector('.home-icon');
    const giftItems = document.querySelectorAll('.gift-item');
    const backButtons = document.querySelectorAll('.back-btn');
    const toggleMusicBtn = document.getElementById('toggleMusic');
    
    // YouTube variables
    let youtubePlayer = null;
    let isYouTubeAPILoaded = false;
    let isVideoPlaying = false;
    
    // Load YouTube API
    function loadYouTubeAPI() {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }
    
    // Initialize YouTube Player
    function initYouTubePlayer() {
        if (!window.YT || !window.YT.Player) return;
        
        youtubePlayer = new YT.Player('youtube-player', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
    
    // YouTube API Callback
    window.onYouTubeIframeAPIReady = function() {
        isYouTubeAPILoaded = true;
        initYouTubePlayer();
    };
    
    function onPlayerReady(event) {
        console.log('YouTube Player is ready');
    }
    
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            isVideoPlaying = true;
            updateMusicButton(true);
        } else if (event.data === YT.PlayerState.PAUSED) {
            isVideoPlaying = false;
            updateMusicButton(false);
        } else if (event.data === YT.PlayerState.ENDED) {
            isVideoPlaying = false;
            updateMusicButton(false);
        }
    }
    
    function updateMusicButton(isPlaying) {
        if (!toggleMusicBtn) return;
        
        const icon = toggleMusicBtn.querySelector('i');
        const text = toggleMusicBtn.querySelector('span');
        
        if (isPlaying) {
            toggleMusicBtn.classList.add('playing');
            icon.className = 'fas fa-volume-up';
            text.textContent = 'ON';
            toggleMusicBtn.style.background = 'linear-gradient(135deg, #c41e3a, #ff4500)';
        } else {
            toggleMusicBtn.classList.remove('playing');
            icon.className = 'fas fa-volume-mute';
            text.textContent = 'OFF';
            toggleMusicBtn.style.background = 'linear-gradient(135deg, #8b5a2b, #a67c52)';
        }
    }
    
    // Load YouTube API
    loadYouTubeAPI();
    
    // Fungsi untuk menampilkan screen tertentu
    function showScreen(screenClass) {
        // Optimasi: Hapus semua kelas active dulu
        screens.forEach(screen => {
            screen.style.display = 'none';
            screen.classList.remove('active');
        });
        
        // Tampilkan screen yang dipilih
        const targetScreen = document.querySelector(`.${screenClass}`);
        if (targetScreen) {
            targetScreen.style.display = 'block';
            setTimeout(() => {
                targetScreen.classList.add('active');
            }, 10);
            
            // Jika masuk ke music screen, load YouTube
            if (screenClass === 'music-screen') {
                setTimeout(() => {
                    if (!isYouTubeAPILoaded) {
                        loadYouTubeAPI();
                    }
                }, 100);
            }
        }
    }
    
    // Event Listeners untuk tombol Yes/No
    btnYes.addEventListener('click', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
        showScreen('main-menu');
    });
    
    btnNo.addEventListener('click', function() {
        this.textContent = "TOO BAD, YOU'RE SEEING IT ANYWAY!";
        this.style.background = 'linear-gradient(135deg, #c41e3a, #ff4500)';
        this.style.color = '#fff8f0';
        this.style.borderColor = '#8b0000';
        
        setTimeout(() => {
            showScreen('main-menu');
        }, 800);
    });
    
    // Event Listener untuk Home Icon
    homeIcon.addEventListener('click', function() {
        showScreen('main-menu');
    });
    
    // Event Listeners untuk Gift Items dengan throttle
    let lastClickTime = 0;
    const clickDelay = 300;
    
    giftItems.forEach(item => {
        item.addEventListener('click', function() {
            const now = Date.now();
            if (now - lastClickTime < clickDelay) return;
            lastClickTime = now;
            
            const itemId = this.id;
            
            switch(itemId) {
                case 'photo-wall':
                    showScreen('photo-wall-screen');
                    break;
                case 'music-player':
                    showScreen('music-screen');
                    break;
                case 'message-card':
                    showScreen('message-screen');
                    break;
                case 'birthday-cake':
                    window.open('birthday-cake.html', '_blank');
                    break;
            }
        });
    });
    
    // Event Listeners untuk Back Buttons
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            showScreen('main-menu');
        });
    });
    
    // Event Listener untuk Toggle Music
    if (toggleMusicBtn) {
        toggleMusicBtn.addEventListener('click', function() {
            if (!youtubePlayer) {
                alert('YouTube player is not ready yet. Please wait a moment and try again.');
                return;
            }
            
            if (isVideoPlaying) {
                youtubePlayer.pauseVideo();
                updateMusicButton(false);
            } else {
                youtubePlayer.playVideo();
                updateMusicButton(true);
            }
        });
    }
    
    // Event Listener untuk YouTube Thumbnail Click
    document.addEventListener('click', function(e) {
        if (e.target.closest('#youtube-thumbnail')) {
            const thumbnail = document.getElementById('youtube-thumbnail');
            const playerContainer = document.getElementById('youtube-player-container');
            
            if (thumbnail && playerContainer) {
                thumbnail.style.display = 'none';
                playerContainer.style.display = 'block';
                
                // Initialize player if not already initialized
                if (!youtubePlayer && isYouTubeAPILoaded) {
                    initYouTubePlayer();
                }
            }
        }
    });
    
    // Optimasi: Debounce untuk efek hover
    let hoverTimeout;
    
    giftItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            clearTimeout(hoverTimeout);
            if (!isLowPerformance) {
                this.style.transform = 'translateY(-15px) scale(1.05)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
                this.style.transform = 'translateY(0) scale(1)';
            }, 100);
        });
    });
    
    // Inisialisasi - tampilkan welcome screen
    setTimeout(() => {
        showScreen('welcome-screen');
    }, 100);
    
    // Optimasi: Konfeti hanya jika performa baik
    if (!isLowPerformance) {
        createConfetti();
    }
    
    function createConfetti() {
        const confettiCount = 25;
        const colors = ['#8b5a2b', '#d4a76a', '#8b4513', '#c41e3a', '#5a3921'];
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    position: fixed;
                    width: ${Math.random() * 8 + 4}px;
                    height: ${Math.random() * 8 + 4}px;
                    background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    opacity: 0;
                    z-index: 9999;
                    pointer-events: none;
                `;
                
                document.body.appendChild(confetti);
                
                const duration = Math.random() * 2000 + 2000;
                
                const animation = confetti.animate([
                    { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
                    { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 180}deg)`, opacity: 0 }
                ], {
                    duration: duration,
                    easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
                });
                
                animation.onfinish = () => {
                    confetti.remove();
                };
            }, i * 100);
        }
    }
    
    function checkPerformance() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return isMobile;
    }
    
    // Style untuk konfeti
    const style = document.createElement('style');
    style.textContent = `
        .confetti {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
        }
        
        .low-performance .gift-item:hover {
            transform: translateY(-5px) !important;
        }
        
        .low-performance .photo-frame:hover {
            transform: translateY(-5px) !important;
        }
        
        .low-performance .btn:hover,
        .low-performance .back-btn:hover,
        .low-performance .music-btn:hover {
            transform: translateY(-2px) !important;
        }
        
        .low-performance .gift-icon {
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
});