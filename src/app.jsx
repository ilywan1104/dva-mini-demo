import * as React from 'react'
import { Provider, Store } from '@/utils/store'
import models from './models'
import './app.css';

const _store = new Store()

_store.useModel(models)

const App = props => {
    return (
        <Provider store={_store.store}>
            {props.children}
        </Provider>
    )
}

export default App;