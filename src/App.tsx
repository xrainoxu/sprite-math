import { HashRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { TimedMode } from './pages/TimedMode';
import { TimedPlay } from './pages/TimedPlay';
import { ChallengeMode } from './pages/ChallengeMode';
import { ChallengePlay } from './pages/ChallengePlay';
import { PracticeMode } from './pages/PracticeMode';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/timed" element={<TimedMode />} />
        <Route path="/timed/play" element={<TimedPlay />} />
        <Route path="/challenge" element={<ChallengeMode />} />
        <Route path="/challenge/play" element={<ChallengePlay />} />
        <Route path="/practice" element={<PracticeMode />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
