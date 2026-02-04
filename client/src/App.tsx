import { useEffect, useState } from 'react';
import './assets/css/style.css';
import './assets/css/all.min.css';

interface ServerStatus {
  online: boolean;
  players: { online: number; max: number; };
}

type ModalType = 'none' | 'models' | 'mods';

function App() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [toast, setToast] = useState({ show: false, title: '', desc: '' });
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [keyBuffer, setKeyBuffer] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretMessage, setSecretMessage] = useState('');

  const SERVER_IP = 'dragonsmp.shock.gg';

  // --- PARÇACIK EFEKTİ ---
  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles');
      if (!container) return;
      container.innerHTML = '';
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 20 + 15;
        particle.style.cssText = `
          position: absolute; width: ${size}px; height: ${size}px;
          background: radial-gradient(circle, rgba(255, 204, 0, 0.4) 0%, transparent 70%);
          border-radius: 50%; left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
          animation: float-particle-${i} ${duration}s ease-in-out infinite;
          pointer-events: none;
        `;
        const style = document.createElement('style');
        style.textContent = `@keyframes float-particle-${i} {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          50% { transform: translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px); opacity: 1; }
        }`;
        document.head.appendChild(style);
        container.appendChild(particle);
      }
    };
    createParticles();
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- GİZLİ ANAHTAR SİSTEMİ ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSecret) {
        if (e.key === 'Escape') { setShowSecret(false); setSecretInput(''); setSecretMessage(''); }
        return;
      }
      setKeyBuffer((prev) => {
        const updated = (prev + e.key).slice(-6).toLowerCase();
        if (updated === 'secret') { setShowSecret(true); setKeyBuffer(''); }
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
    } catch (error) { console.error(error); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast({ show: true, title: "BAŞARILI", desc: "IP adresi panoya kopyalandı" });
    setTimeout(() => setToast({ show: false, title: '', desc: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <div className="particles-bg" id="particles"></div>

      {/* --- NAVBAR --- */}
      <header className="top-nav">
        <div className="nav-content">
          <div className="nav-left">
            <img src="/images/logo.png" alt="Logo" className="nav-logo-img" />
            <div className="nav-title-group">
              <span className="nav-title tracking-tighter">DRAGONSMP</span>
              <span className="nav-subtitle text-yellow-500 uppercase text-[10px] tracking-[3px]">Modded Survival</span>
            </div>
          </div>
          <div className="nav-right">
            <div className="status-badge bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${status?.online ? 'bg-yellow-500 shadow-[0_0_10px_#f59e0b]' : 'bg-red-500'} animate-pulse`}></span>
              <span className="text-xs font-bold tracking-widest">{status?.online ? `${status.players.online} OYUNCU` : 'BAĞLANILIYOR...'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- ANA İÇERİK --- */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Logo & IP Card */}
        <div className="card p-10 flex flex-col items-center justify-center text-center group transition-all duration-500 border border-white/5 bg-gradient-to-b from-white/5 to-transparent rounded-[2.5rem]" onClick={() => copyToClipboard(SERVER_IP)}>
          <div className="relative mb-6">
              <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full group-hover:bg-yellow-500/40 transition-all"></div>
              <img src="/images/logo.png" className="w-44 h-44 relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform" />
          </div>
          <div className="bg-black/40 border border-white/10 px-6 py-3 rounded-2xl group-hover:border-yellow-500/50 transition-all cursor-pointer">
              <span className="block text-[10px] text-yellow-500 font-black tracking-[4px] mb-1">SUNUCU ADRESİ</span>
              <code className="text-lg font-mono tracking-wider">{SERVER_IP}</code>
          </div>
        </div>

        {/* MODLAR (Store Yerine) */}
        <div className="card group relative overflow-hidden rounded-[2.5rem] h-[400px] cursor-pointer" onClick={() => setActiveModal('mods')}>
          <img src="/images/store.png" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="relative h-full p-8 flex flex-col justify-end z-20">
              <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20 text-black">
                  <i className="fa-solid fa-box-open text-xl"></i>
              </div>
              <h2 className="text-5xl font-black italic tracking-tighter leading-none">MODLAR</h2>
              <p className="text-gray-300 mt-2 font-medium">Gerekli paketleri indirin</p>
          </div>
        </div>

        {/* MODELLER (Stats Yerine) */}
        <div className="card group relative overflow-hidden rounded-[2.5rem] h-[400px] cursor-pointer" onClick={() => setActiveModal('models')}>
          <img src="/images/stats.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          <div className="relative h-full p-8 flex flex-col justify-end z-20">
              <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/20 text-black">
                  <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
              </div>
              <h2 className="text-5xl font-black italic tracking-tighter leading-none">MODELLER</h2>
              <p className="text-gray-300 mt-2 font-medium">Özel karakter paketleri</p>
          </div>
        </div>
      </main>

      {/* --- MODERN MODALLAR --- */}
      {activeModal !== 'none' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/70 animate-in fade-in duration-300">
            <div className="absolute inset-0" onClick={() => setActiveModal('none')}></div>
            <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-10">
                    <div className="flex justify-between items-start mb-8">
                        <h2 className="text-4xl font-black italic tracking-tighter text-yellow-500 uppercase">
                            {activeModal === 'models' ? 'Modeller' : 'Modlar'}
                        </h2>
                        <button onClick={() => setActiveModal('none')} className="text-white/20 hover:text-white transition-colors">
                            <i className="fa-solid fa-circle-xmark text-3xl"></i>
                        </button>
                    </div>
                    
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        {activeModal === 'models' 
                          ? "Karakter modellerinin çalışması için Chameleon ve Blockbuster modları zorunludur." 
                          : "Sunucuya sorunsuz girmek için tüm modları indirip mods klasörüne atın."}
                    </p>

                    <div className="grid gap-3">
                        {activeModal === 'models' ? (
                            <>
                                <a href="/downloads/blockbuster.zip" download className="download-row">
                                    <span>Blockbuster.zip</span> <i className="fa-solid fa-download"></i>
                                </a>
                                <a href="/downloads/chameleon.zip" download className="download-row">
                                    <span>Chameleon.zip</span> <i className="fa-solid fa-download"></i>
                                </a>
                            </>
                        ) : (
                            <a href="/downloads/mods.zip" download className="download-row bg-yellow-500 !text-black border-none font-black py-5">
                                MOD PAKETİNİ İNDİR (.ZIP) <i className="fa-solid fa-cloud-arrow-down"></i>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- GÖRSELDEKİ GİBİ TOAST MESAJI --- */}
      {toast.show && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] bg-[#111] border border-white/5 pl-2 pr-8 py-3 rounded-2xl flex items-center gap-5 shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                <i className="fa-solid fa-check text-black text-xl"></i>
            </div>
            <div>
                <div className="text-lg font-black tracking-tight">{toast.title}</div>
                <div className="text-white/50 text-xs font-medium uppercase tracking-widest">{toast.desc}</div>
            </div>
        </div>
      )}

      {/* --- SECRET MODAL --- */}
      {showSecret && (
        <div className="fixed inset-0 z-[3000] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-zinc-900 border border-yellow-500/20 p-10 rounded-[2rem] max-w-md w-full text-center relative shadow-2xl">
                <button onClick={() => setShowSecret(false)} className="absolute top-6 right-6 text-white/20 hover:text-white"><i className="fa-solid fa-xmark text-2xl"></i></button>
                <h2 className="text-4xl font-bold text-yellow-500 mb-8 animate-pulse italic">:)</h2>
                {!secretMessage ? (
                    <input type="text" value={secretInput} autoFocus
                        onChange={(e) => {
                            const val = e.target.value.toLowerCase(); setSecretInput(val);
                            if (['bay4lly', 'gofret', 'forget1221'].includes(val)) setSecretMessage('Bu site Bay4lly tarafından kodlanmıştır');
                            else if (val === 'shady1545') { setSecretMessage('YouTube Kanalına Gidiliyor...'); setTimeout(() => window.open('https://youtube.com/@Sshady1545', '_blank'), 1000); }
                        }}
                        placeholder="..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white text-center font-mono focus:border-yellow-500 outline-none"
                    />
                ) : <p className="text-xl font-bold text-white font-mono animate-bounce">{secretMessage}</p>}
            </div>
        </div>
      )}

      <style>{`
        .download-row {
            display: flex; align-items: center; justify-content: space-between;
            padding: 1.25rem 2rem; background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08); border-radius: 1.5rem;
            text-decoration: none; color: white; font-weight: 700; transition: all 0.3s;
        }
        .download-row:hover { transform: translateX(5px); border-color: #f59e0b; background: rgba(255,255,255,0.05); }
        .card { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .card:hover { transform: translateY(-8px); }
      `}</style>
    </div>
  );
}

export default App;