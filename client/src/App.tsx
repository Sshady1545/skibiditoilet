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
  const [activeModal, setActiveModal] = useState<'modlar' | 'modeller' | null>(null); // Yeni Modal State
  
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
          background: radial-gradient(circle, rgba(255, 255, 0, 0.8) 0%, transparent 70%); /* KIRMIZIDAN SARIYA ÇEVRİLDİ */
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
              <span className={`status-dot ${status?.online ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'} block pulse`}></span>
              <span className="status-text">
                {status?.online ? 'SUNUCU AKTİF' : 'BAĞLANIYOR...'}
              </span>
              {status?.online && (
                <span className="player-number">{status.players.online}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-container">
        <div className="left-column">
          <div className="card logo-card">
            <div className="logo-ring"></div>
            <div className="logo-ring ring-2 border-yellow-400"></div> {/* SARI YAPILDI */}
            <img src="/images/logo.png" alt="DragonSMP" className="main-dragon-logo" />
          </div>
          
          <div className="ip-container border-yellow-400" onClick={() => copyToClipboard(SERVER_IP)} id="copy-ip">
            <div className="ip-icon text-yellow-400"><i className="fa-solid fa-server"></i></div>
            <div className="ip-content">
              <span className="ip-label">SERVER IP</span>
              <span className="ip-text text-yellow-400">{SERVER_IP}</span>
            </div>
            <div className="ip-copy-btn"><i className="fa-regular fa-copy"></i></div>
          </div>
        </div>

        {/* MODLAR KARTI */}
        <div className="card store-card border-yellow-400" onClick={() => setActiveModal('modlar')}>
            <div className="card-shine"></div>
            <div className="overlay">
                <div className="card-icon text-yellow-400"><i className="fa-solid fa-box-open"></i></div>
                <h2 className="text-yellow-400">MODLAR</h2>
                <p>1.12.2 Forge içindir</p>
            </div>
            <img src="/images/store.png" className="card-bg-img" />
            <div className="hover-border border-yellow-400"></div>
        </div>

        <div className="card social-card">
            <h3 className="card-title text-yellow-400"><i className="fa-solid fa-users"></i> TOPLULUK</h3>
            <a href="https://youtube.com/@Sshady1545" target="_blank" className="social-box yt border-yellow-400/30">
                <div className="social-icon text-red-600"><i className="fab fa-youtube"></i></div>
                <div className="social-info">
                    <strong className="social-number text-yellow-400">4,000+</strong>
                    <span className="social-label">YouTube Abonesi</span>
                </div>
            </a>
            <a href="https://discord.gg/JUj7SHGdF6" target="_blank" className="social-box dc border-yellow-400/30">
                <div className="social-icon text-blue-500"><i className="fab fa-discord"></i></div>
                <div className="social-info">
                    <strong className="social-number text-yellow-400">1,000+</strong>
                    <span className="social-label">Discord Üyesi</span>
                </div>
            </a>
        </div>

        {/* MODELLER KARTI */}
        <div className="card stats-card border-yellow-400" onClick={() => setActiveModal('modeller')}>
            <div className="card-shine"></div>
            <div className="overlay">
                <div className="card-icon text-yellow-400"><i className="fa-solid fa-dragon"></i></div>
                <h2 className="text-yellow-400">MODELLER</h2>
                <p>Chameleon ve Blockbuster</p>
            </div>
            <img src="/images/stats.jpg" className="card-bg-img" />
            <div className="hover-border border-yellow-400"></div>
        </div>

        <div className="card join-card border-yellow-400">
            <div className="join-header text-yellow-400">
                <i className="fa-solid fa-gamepad"></i>
                <h3>NASIL KATILIRIM?</h3>
            </div>
            <div className="join-steps">
                {[
                  { n: 1, t: "Minecraft'ı Aç", d: "Forge 1.12.2 Sürümü" },
                  { n: 2, t: "Multiplayer'a Gir", d: "Ana menüden seç" },
                  { n: 3, t: "IP'yi Gir", d: SERVER_IP }
                ].map((step) => (
                  <div className="step" key={step.n}>
                    <div className="step-number bg-yellow-400 text-black">{step.n}</div>
                    <div className="step-content">
                        <span className="step-title text-yellow-400">{step.t}</span>
                        <span className="step-desc">{step.d}</span>
                    </div>
                  </div>
                ))}
            </div>
        </div>
      </main>

      {/* POP-UP MODAL EKRANI */}
      {activeModal && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-yellow-400 p-8 rounded-3xl max-w-lg w-full relative shadow-[0_0_50px_rgba(255,255,0,0.2)]">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-yellow-400 hover:rotate-90 transition-transform">
              <i className="fa-solid fa-xmark text-3xl"></i>
            </button>
            
            {activeModal === 'modlar' ? (
              <div className="text-center">
                <i className="fa-solid fa-box-open text-6xl text-yellow-400 mb-4"></i>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">MOD PAKETİ</h2>
                <p className="text-gray-300 mb-6">Bu sunucu 1.12.2 Forge sürümü ile çalışmaktadır. Aşağıdaki butondan tüm gerekli modları indirebilirsiniz.</p>
                <a href="BURAYA_MOD_LINKINI_YAZ" target="_blank" className="inline-block w-full py-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors">
                  MODLARI İNDİR (.ZIP)
                </a>
              </div>
            ) : (
              <div className="text-center">
                <i className="fa-solid fa-dragon text-6xl text-yellow-400 mb-4"></i>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">ÖZEL MODELLER</h2>
                <p className="text-gray-300 mb-6">Chameleon ve Blockbuster modları ile uyumlu özel modellerimizi buradan indirebilirsiniz.</p>
                <a href="BURAYA_MODEL_LINKINI_YAZ" target="_blank" className="inline-block w-full py-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors">
                  MODELLERİ İNDİR (.ZIP)
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOAST & FOOTER AYNI KALDI */}
      <div id="toast" className={`toast ${toast.show ? '' : 'hidden'}`}>
        <div className="toast-icon text-yellow-400"><i className="fa-solid fa-check-circle"></i></div>
        <div className="toast-content">
            <span className="toast-title text-yellow-400">{toast.title}</span>
            <span className="toast-desc">{toast.desc}</span>
        </div>
      </div>
      
      <footer className="text-center py-6 text-yellow-400/50 text-xs relative z-10">
        © 2026 DragonSMP | Official. All rights reserved.
      </footer>
    </div>
  );
}

export default App;