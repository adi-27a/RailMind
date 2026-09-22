import { useState } from 'react';
import { Layout, type Page } from './components/Layout';
import { StatePanel } from './components/StatePanel';
import { Assistant } from './features/assistant/Assistant';
import { Analytics } from './features/dashboard/Analytics';
import { Dashboard } from './features/dashboard/Dashboard';
import { TrainIntelligence } from './features/intelligence/TrainIntelligence';
import { LiveMap } from './features/map/LiveMap';
import { Routes } from './features/network/Routes';
import { Stations } from './features/network/Stations';
import { Operations } from './features/operations/Operations';
import { DelayPredictor } from './features/predictor/DelayPredictor';
import { SettingsPage, SystemHealthPage, WeatherPage } from './features/system/SystemPages';
import { useLiveFeed } from './lib/use-live-feed';
export default function App() { const [page,setPage] = useState<Page>('Dashboard'); const feed = useLiveFeed(); const content = () => { if (feed.error && page === 'Dashboard') return <StatePanel title="Connection unavailable" message={feed.error} action={() => window.location.reload()}/>; if (page === 'Dashboard') return <Dashboard metrics={feed.metrics} trains={feed.trains} alerts={feed.alerts} loading={feed.loading}/>; if (page === 'Live Map') return <LiveMap trains={feed.trains} alerts={feed.alerts} weather={feed.weather}/>; if (page === 'Train Intelligence') return <TrainIntelligence liveTrains={feed.trains}/>; if (page === 'Stations') return <Stations/>; if (page === 'Routes') return <Routes/>; if (page === 'Delay Predictor') return <DelayPredictor/>; if (page === 'AI Assistant') return <Assistant/>; if (page === 'Operations') return <Operations alerts={feed.alerts} loading={feed.loading}/>; if (page === 'Analytics') return <Analytics/>; if (page === 'Weather') return <WeatherPage weather={feed.weather}/>; if (page === 'System Health') return <SystemHealthPage feedState={feed.state}/>; if (page === 'Settings') return <SettingsPage/>; return null; }; return <Layout page={page} onPage={setPage} state={feed.state}>{content()}</Layout>; }
