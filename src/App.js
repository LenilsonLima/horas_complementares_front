import './App.css';
import GlobalContext from './context/GlobalContext';
import Rotas from './rotas/Rotas';

function App() {

  return (
    <GlobalContext>
      <Rotas />
    </GlobalContext>
  );
}

export default App;
