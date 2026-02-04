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
  const [activeModal, setActiveModal] = useState<'modlar' | 'modeller' | null>(null); 
  
  const SERVER_IP = 'dragonsmp.shock.gg';

  useEffect(() => {
    // Arka plan rengini gri yapmak için gövdeye stil ekliyoruz
    document.body.style.backgroundColor = "#1a1a1a"; 

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
          background: radial-gradient(circle, rgba(255, 204, 0, 0.8) 0%, transparent 70%); /* SARI PARTİKÜLLER */
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
    });
  };

  const showToast = (title: string, desc: string) => {
    setToast({ show: true, title, desc });
    setTimeout(() => setToast({ show: false, title: '', desc: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans overflow-x-hidden">
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
              <span className="status-text text-yellow-400">
                {status?.online ? 'SUNUCU AKTİF' : 'BAĞLANIYOR...'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-container grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto relative z-10">
        <div className="left-column flex flex-col gap-6">
          <div className="card logo-card bg-zinc-900/80 border border-yellow-400/20 p-8 rounded-3xl flex items-center justify-center relative overflow-hidden group">
            <div className="logo-ring absolute w-48 h-48 border-2 border-yellow-400/30 rounded-full animate-spin-slow"></div>
            <img src="/images/logo.png" alt="DragonSMP" className="w-32 h-32 relative z-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
          
          <div className="ip-container bg-zinc-900/80 border border-yellow-400 p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-zinc-800 transition-all" onClick={() => copyToClipboard(SERVER_IP)}>
            <div className="ip-icon text-yellow-400 text-2xl"><i className="fa-solid fa-server"></i></div>
            <div className="ip-content flex-1">
              <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider">SERVER IP</span>
              <span className="block text-yellow-400 font-mono font-bold">{SERVER_IP}</span>
            </div>
            <div className="ip-copy-btn text-gray-500"><i className="fa-regular fa-copy"></i></div>
          </div>
        </div>

        {/* MODLAR VE MODELLER (Küçültülmüş tasarım) */}
        <div className="middle-column flex flex-col gap-6">
            <div className="card store-card h-48 bg-zinc-900/80 border border-yellow-400 overflow-hidden rounded-3xl relative cursor-pointer group" onClick={() => setActiveModal('modlar')}>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex flex-col items-center justify-center z-10">
                    <i className="fa-solid fa-box-open text-4xl text-yellow-400 mb-2"></i>
                    <h2 className="text-xl font-bold text-yellow-400">MODLAR</h2>
                    <p className="text-xs text-gray-300">1.12.2 Forge</p>
                </div>
                <img src="/images/store.png" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="card stats-card h-48 bg-zinc-900/80 border border-yellow-400 overflow-hidden rounded-3xl relative cursor-pointer group" onClick={() => setActiveModal('modeller')}>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex flex-col items-center justify-center z-10">
                    <i className="fa-solid fa-dragon text-4xl text-yellow-400 mb-2"></i>
                    <h2 className="text-xl font-bold text-yellow-400">MODELLER</h2>
                    <p className="text-xs text-gray-300">İndirmek için tıkla</p>
                </div>
                <img src="/images/stats.jpg" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-700" />
            </div>
        </div>

        <div className="right-column flex flex-col gap-6">
            <div className="card social-card bg-zinc-900/80 border border-yellow-400/20 p-6 rounded-3xl">
                <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2"><i className="fa-solid fa-users"></i> TOPLULUK</h3>
                <div className="flex flex-col gap-3">
                    <a href="https://youtube.com/@Sshady1545" target="_blank" className="flex items-center gap-4 p-3 bg-black/40 rounded-xl border border-white/5 hover:border-red-600 transition-colors">
                        <div className="text-red-600 text-2xl"><i className="fab fa-youtube"></i></div>
                        <div className="flex flex-col">
                            <strong className="text-yellow-400 text-lg">4,000+</strong>
                            <span className="text-[10px] text-gray-500 uppercase">YouTube Abonesi</span>
                        </div>
                    </a>
                    <a href="https://discord.gg/JUj7SHGdF6" target="_blank" className="flex items-center gap-4 p-3 bg-black/40 rounded-xl border border-white/5 hover:border-blue-500 transition-colors">
                        <div className="text-blue-500 text-2xl"><i className="fab fa-discord"></i></div>
                        <div className="flex flex-col">
                            <strong className="text-yellow-400 text-lg">1,000+</strong>
                            <span className="text-[10px] text-gray-500 uppercase">Discord Üyesi</span>
                        </div>
                    </a>
                </div>
            </div>

            <div className="card join-card bg-zinc-900/80 border border-yellow-400 p-6 rounded-3xl">
                <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2"><i className="fa-solid fa-gamepad"></i> NASIL KATILIRIM?</h3>
                <div className="flex flex-col gap-4">
                    {[
                      { n: 1, t: "Minecraft'ı Aç", d: "Forge 1.12.2" },
                      { n: 2, t: "Multiplayer'a Gir", d: "Ana Menü" },
                      { n: 3, t: "IP'yi Gir", d: SERVER_IP }
                    ].map((step) => (
                      <div className="flex gap-4 items-start" key={step.n}>
                        <div className="w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded flex items-center justify-center shrink-0">{step.n}</div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-yellow-400 font-bold text-sm">{step.t}</span>
                            <span className="text-[10px] text-gray-500">{step.d}</span>
                        </div>
                      </div>
                    ))}
                </div>
            </div>
        </div>
      </main>

      {/* POP-UP MODAL - MODELLERDE 2 LİNK VAR */}
      {activeModal && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border-2 border-yellow-400 p-8 rounded-3xl max-w-lg w-full relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-yellow-400 hover:scale-110 transition-transform">
              <i className="fa-solid fa-xmark text-3xl"></i>
            </button>
            
            {activeModal === 'modlar' ? (
              <div className="text-center">
                <i className="fa-solid fa-box-open text-6xl text-yellow-400 mb-4"></i>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">MOD PAKETİ</h2>
                <p className="text-gray-400 mb-6 text-sm">Gerekli tüm modları tek tıkla indirebilirsiniz.</p>
                <a href="#" className="block py-4 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-colors">MODLARI İNDİR (.ZIP)</a>
              </div>
            ) : (
              <div className="text-center">
                <i className="fa-solid fa-dragon text-6xl text-yellow-400 mb-4"></i>
                <h2 className="text-3xl font-bold text-yellow-400 mb-2">ÖZEL MODELLER</h2>
                <div className="flex flex-col gap-4 mt-6">
                    <a href="LINK_1" className="block py-4 bg-zinc-800 border border-yellow-400 text-yellow-400 font-bold rounded-xl hover:bg-yellow-400 hover:text-black transition-all">
                       🔗 CHAMELEON MODELİNİ İNDİR
                    </a>
                    <a href="LINK_2" className="block py-4 bg-zinc-800 border border-yellow-400 text-yellow-400 font-bold rounded-xl hover:bg-yellow-400 hover:text-black transition-all">
                       🔗 BLOCKBUSTER MODELİNİ İNDİR
                    </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="text-center py-10 text-yellow-400/40 text-[10px] tracking-[4px] uppercase">
        © 2026 DragonSMP | Official. All rights reserved.
      </footer>
    </div>
  );
}

export default App;