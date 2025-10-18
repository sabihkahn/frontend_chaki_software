import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Dashbord from './pages/Dashbord'
import Sales from './pages/Sales'
import PendingOrders from './components/PendingOrders'
const App = () => {
  return (
    <>


<main >
  <Header />

</main>

<Routes>

<Route path='/' element={ <Dashbord /> } />
<Route path='/pendingorders' element={ <PendingOrders /> } />
<Route path='/sales' element={ <Sales /> } />
</Routes>


    </>
  )
}

export default App