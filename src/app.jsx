import * as React from 'react'
import { Provider, connect, createStore } from '@/utils/store'
import models from './models'

import './app.css'
import 'anna-remax-ui/esm/button/style/css'
import 'anna-remax-ui/esm/card/style/css'
import 'anna-remax-ui/esm/tabs/style/css'

const App = ({
    children,
    global,
    loading
}) => {
    React.useEffect(() => {
        console.log('global props::', global, loading)
    }, [])

    return children
}

const WrappedApp = connect(({
    global,
    loading
}) => ({
    global,
    loading
}))(App)

export default props => {
    return (
        <Provider store={createStore(models)}>
            <WrappedApp {...props} />
        </Provider>
    )
};