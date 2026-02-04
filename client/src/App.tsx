import { useEffect, useState } from 'react';
import './assets/css/style.css';
import './assets/css/all.min.css';

interface ServerStatus {
  online: boolean;
  players: {
    online: number;
    max: number;
  };
}

function App() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [toast, setToast] = useState<{ show: boolean; title: string; desc: string }>({ show: false, title: '', desc: '' });
  
  const [keyBuffer, setKeyBuffer] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretMessage, setSecretMessage] = useState('');

  const SERVER_IP = 'dragonsmp.shock.gg';

  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;
      container.innerHTML = '';
      
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 20 + 15;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          /* KIRMIZI PARÇACIKLAR BEYAZ/GRI YAPILDI */
          background: radial-gradient(circle, rgba(200, 200, 200, 0.6) 0%, transparent 70%);
          border-radius: 50%;
          left: ${startX}%;
          top: ${startY}%;
          animation: float-particle-${i} ${duration}s ease-in-out ${delay}s infinite;
          pointer-events: none;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-particle-${i} {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0; }
                10% { opacity: 0.8; }
                50% { transform: translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px) scale(1.5); opacity: 1; }
                90% { opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
        container.appendChild(particle);
      }
    };

    createParticles();
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSecret) {
        if (e.key === 'Escape') {
          setShowSecret(false);
          setSecretInput('');
          setSecretMessage('');
        }
        return;
      }

      setKeyBuffer((prev) => {
        const updated = (prev + e.key).slice(-6).toLowerCase();
        if (updated === 'secret') {
          setShowSecret(true);
          setKeyBuffer('');
        }
        return updated;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSecret]);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`https://api.mcsrvstat.us/3/${SERVER_IP}`);
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Server status check failed', error);
    }
  };

  const copyToClipboard = (text: string, message: string = "IP ADRESİ KOPYALANDI!") => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message, "IP adresi panoya kopyalandı");
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(message, "IP adresi panoya kopyalandı");
    });
  };

  const showToast = (title: string, desc: string) => {
    setToast({ show: true, title, desc });
    setTimeout(() => setToast({ show: false, title: '', desc: '' }), 3000);
  };

  return (
    <div>
      <div className="particles-bg" id="particles"></div>

      <header className="top-nav">
        <div className="nav-content">
          <div className="nav-left">
            <div className="logo-glow">
              <img src="/images/logo.png" alt="Logo" className="nav-logo-img" />
            </div>
            <div className="nav-title-group">
              <span className="nav-title">DRAGONSMP</span>
              <span className="nav-subtitle">OFFICIAL SERVER</span>
            </div>
          </div>
          <div className="nav-right">
            <div className="online-status" id="server-status">
              {/* KIRMIZI DURUM IŞIĞI GRI YAPILDI */}
              <span className={`status-dot ${status?.online ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-500'} block pulse`}></span>
              <span className="status-text">
                {status?.online ? 'SUNUCU AKTİF' : 'BAĞLANIYOR...'}
              </span>
              {status?.online && (
                <span className="player-number">{status.players.online}</span>
              )}
            </div>
          </div>
        </div>
        <div className="nav-glow"></div>
      </header>

      <main className="main-container">
        <div className="left-column">
          <div className="card logo-card">
            <div className="logo-ring"></div>
            <div className="logo-ring ring-2"></div>
            <img src="/images/logo.png" alt="DragonSMP" className="main-dragon-logo" />
          </div>
          
          <div className="ip-container" onClick={() => copyToClipboard(SERVER_IP)} id="copy-ip">
            <div className="ip-icon"><i className="fa-solid fa-server"></i></div>
            <div className="ip-content">
              <span className="ip-label">SERVER IP</span>
              <span className="ip-text">{SERVER_IP}</span>
            </div>
            <div className="ip-copy-btn"><i className="fa-regular fa-copy"></i></div>
          </div>
        </div>

        <div className="card store-card" data-modal="store" onClick={() => showToast('STORE!', 'Yakında aktif olacak')}>
            <div className="card-shine"></div>
            <div className="overlay">
                <div className="card-icon"><i className="fa-solid fa-shopping-cart"></i></div>
                <h2>STORE</h2>
                <p>Marketten alışveriş yapın</p>
                {/* YAKINDA YAZISI SİLİNDİ */}
            </div>
            <img src="/images/store.png" className="card-bg-img" />
            <div className="hover-border"></div>
        </div>

        <div className="card social-card">
            <div className="card-shine"></div>
            <h3 className="card-title"><i className="fa-solid fa-users"></i> TOPLULUK</h3>
            <a href="https://youtube.com/@Sshady1545" target="_blank" className="social-box yt">
                <div className="social-icon"><i className="fab fa-youtube"></i></div>
                <div className="social-info">
                    <strong className="social-number">4,000+</strong>
                    <span className="social-label">YouTube Abonesi</span>
                </div>
                <div className="social-arrow"><i className="fa-solid fa-arrow-right"></i></div>
            </a>
            <a href="https://discord.gg/JUj7SHGdF6" target="_blank" className="social-box dc">
                <div className="social-icon"><i className="fab fa-discord"></i></div>
                <div className="social-info">
                    <strong className="social-number">1,000+</strong>
                    <span className="social-label">Discord Üyesi</span>
                </div>
                <div className="social-arrow"><i className="fa-solid fa-arrow-right"></i></div>
            </a>
            <div className="hover-border"></div>
        </div>

        <div className="card stats-card" data-modal="stats" onClick={() => showToast('STATS!', 'Yakında aktif olacak')}>
            <div className="card-shine"></div>
            <div className="overlay">
                <div className="card-icon"><i className="fa-solid fa-chart-line"></i></div>
                <h2>STATS</h2>
                <p>Oyuncu istatistikleri</p>
                {/* YAKINDA YAZISI SİLİNDİ */}
            </div>
            <img src="/images/stats.jpg" className="card-bg-img" />
            <div className="hover-border"></div>
        </div>

        <div className="card join-card">
            <div className="card-shine"></div>
            <div className="join-header">
                <i className="fa-solid fa-gamepad"></i>
                <h3>NASIL KATILIRIM?</h3>
            </div>
            <div className="join-steps">
                <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                        <span className="step-title">Minecraft'ı Aç</span>
                        <span className="step-desc">Bedrock/Java Edition 1.8-1.21.11</span>
                    </div>
                </div>
                <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                        <span className="step-title">Multiplayer'a Gir</span>
                        <span className="step-desc">Ana menüden seç</span>
                    </div>
                </div>
                <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content w-full">
                        <span className="step-title">IP'yi Gir</span>
                        <div className="inline-ip min-h-[40px] py-1 px-2 flex items-center justify-between gap-1 overflow-hidden" id="copy-ip-2" onClick={() => copyToClipboard(SERVER_IP)}>
                            <span className="mc-font text-[8px] sm:text-[10px] whitespace-nowrap">
                                {SERVER_IP}
                            </span>
                            <i className="fa-solid fa-copy text-[10px] flex-shrink-0"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hover-border"></div>
        </div>
      </main>

      <div id="toast" className={`toast ${toast.show ? '' : 'hidden'}`}>
        <div className="toast-icon"><i className="fa-solid fa-check-circle"></i></div>
        <div className="toast-content">
            <span className="toast-title">{toast.title}</span>
            <span className="toast-desc">{toast.desc}</span>
        </div>
        <div className="toast-progress"></div>
      </div>
      
      <footer className="text-center py-6 text-gray-600 text-xs relative z-10">
        © 2026 DragonSMP | Official. All rights reserved.
      </footer>

      {showSecret && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowSecret(false)}>
            <div className="bg-gray-900 border border-gray-500/50 p-8 rounded-2xl max-w-md w-full text-center relative shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <button onClick={() => setShowSecret(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
                <h2 className="text-4xl font-bold text-gray-500 mb-8 tracking-widest animate-pulse">:)</h2>
                {!secretMessage ? (
                    <input 
                        type="text" value={secretInput}
                        onChange={(e) => {
                            const val = e.target.value.toLowerCase();
                            setSecretInput(val);
                            if (['bay4lly', 'gofret', 'forget1221'].includes(val)) {
                                setSecretMessage('bu site Bay4lly tarafından kodlanmıştır');
                            } else if (val === 'shady1545') {
                                setSecretMessage('Shady1545 YouTube Kanalına Gidiliyor...');
                                setTimeout(() => window.open('https://youtube.com/@Sshady1545', '_blank'), 1000);
                            } else if (val === 'robotic1545') {
                                setSecretMessage('Robotic1545 YouTube Kanalına Gidiliyor...');
                                setTimeout(() => window.open('https://youtube.com/@ofc-exelux', '_blank'), 1000);
                            }
                        }}
                        placeholder="..."
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white text-center font-mono"
                        autoFocus
                    />
                ) : (
                    <div className="animate-pulse">
                        <p className="text-xl font-bold text-white font-mono">{secretMessage}</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}

export default App;