import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home }       from './pages/Home'
import { Arrays }     from './pages/Arrays'
import { LinkedList } from './pages/LinkedList'
import { Trees }      from './pages/Trees'
import { Graphs }     from './pages/Graphs'
import { Sorting }    from './pages/Sorting'
import { DP }         from './pages/DP'
import { Playground } from './pages/Playground'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"           element={<Home />}       />
          <Route path="/arrays"     element={<Arrays />}     />
          <Route path="/linkedlist" element={<LinkedList />} />
          <Route path="/trees"      element={<Trees />}      />
          <Route path="/graphs"     element={<Graphs />}     />
          <Route path="/sorting"    element={<Sorting />}    />
          <Route path="/dp"         element={<DP />}         />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
