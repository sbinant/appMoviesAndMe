import React from 'react'
import Navigations from './Navigation/Navigations'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={Store}>
        <Navigations/>
      </Provider >
    )
  }
}






/* ****************************************************************************************** 

*component Provider
component redux n'a qu'une seule et unique fonction, il distribue le store à toute l'app. C'est grâce à ce component que vous allez pouvoir accéder à votre store et à ses reducers. Le provider a une prop  store 


******************************************************************************************  */