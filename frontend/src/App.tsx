import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import LandingPage from './pages/ProfessionalLandingPage'
import UploadPage from './pages/UploadPage'
import ResultPage from './pages/ResultPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HistoryPage from './pages/HistoryPage'

function App() {
  const location = useLocation()
  const isAuth = ['/login', '/signup'].includes(location.pathname)
  return (
    <div className="page-shell">
      {!isAuth && <header className="sticky top-0 z-50 border-b border-[#dfdfd5] bg-[#f8f7f2]/90 backdrop-blur-xl"><div className="app-container flex items-center justify-between py-4"><Link to="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#173f2d] text-white"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 8.5 12 5l4 3.5M9 8a3 3 0 1 1 6 0v1l5 3.5V16H4v-3.5L9 9V8Z"/><path d="M4 16h16"/></svg></span><span className="display-font text-lg font-extrabold tracking-tight">Drape<span className="text-[#678f70]">AI</span></span></Link><nav className="hidden items-center gap-8 text-sm font-semibold text-[#5f695f] md:flex"><NavLink to="/">Home</NavLink><NavLink to="/upload">Studio</NavLink><NavLink to="/history">My looks</NavLink></nav><div className="flex items-center gap-2"><Link to="/login" className="hidden px-4 py-2 text-sm font-bold sm:block">Sign in</Link><Link to="/upload" className="btn-primary !px-5 !py-2.5 text-sm">Try it now →</Link></div></div></header>}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </div>
  )
}

export default App
