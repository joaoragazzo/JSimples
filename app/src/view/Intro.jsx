import { useState, useEffect } from 'react';
import JS from '@/assets/JS.svg';
import IMPLES from '@/assets/Imples.svg';

const JSimplesIntro = ({ onAnimationComplete }) => {

  const [showJS, setShowJS] = useState(false);
  const [showImples, setShowImples] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);


  useEffect(() => {
    const timeline = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setShowJS(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowImples(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setShowSubtitle(true);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setFadeOut(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    };

    timeline();
  }, [onAnimationComplete]);

  return (
    <div className={`intro-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="logo-container">
        <div className={`js ${showJS ? 'show' : ''}`}>
          <img src={JS} width={200} />
        </div>
        <div className={`imples ${showImples ? 'slide-in' : ''}`}>
          <img src={IMPLES} width={200} />
        </div>
      </div>
      
      <div className={`subtitle ${showSubtitle ? 'fade-in' : ''}`}>
        Descomplicando teoria de linguagens e compiladores
      </div>

      <style>{`
        .intro-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          transition: opacity 0.8s ease-out;
        }

        .intro-container.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .logo-container {
          display: flex;
          align-items: center;
          height: 120px;
          overflow: hidden;
        }

        .js {
          display: block;
          opacity: 0;
          transform: scale(0.5);
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          z-index: 2;
        }

        .js.show {
          opacity: 1;
          transform: scale(1);
        }

        .imples {
          transform: translateX(-70px);
          opacity: 0;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          margin-left: -0.2rem;
          z-index: 1;
        }

        .imples.slide-in {
          transform: translateX(0);
          opacity: 1;
        }

        .subtitle {
          font-size: 1.2rem;
          color: rgb(0, 0, 0);
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s ease-out;
          font-weight: 300;
          letter-spacing: 0.5px;
          max-width: 600px;
          padding: 0 2rem;
        }

        .subtitle.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .js, .imples {
            font-size: 3rem;
          }
          
          .subtitle {
            font-size: 1rem;
            padding: 0 1rem;
          }
          
          .logo-container {
            height: 80px;
          }
        }

        @media (max-width: 480px) {
          .js, .imples {
            font-size: 2.5rem;
          }
          
          .subtitle {
            font-size: 0.9rem;
          }
        }

        .js.show::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shine 1.5s ease-in-out 0.5s;
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

export const Intro = ({children}) => {
  const [showApp, setShowApp] = useState(false); 

  const handleAnimationComplete = () => {
    setShowApp(true);
  };

  return (
    <>
      {!showApp && (
        <JSimplesIntro onAnimationComplete={handleAnimationComplete} />
      )}
      
      {showApp && children}
    </>
  );
};
