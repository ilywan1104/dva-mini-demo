import * as React from 'react'

const Context = React.createContext({})

const reducers = (state, action, reducers) => {
    if (action.type === 'loading') {
        const { name, status } = action.payload
        return {
            ...state,
            ...state.loading[name] = status,
        }
    }
    const types = action.type.split('/')
    return {
        ...state,
        [types[0]]: reducers[action.type](state[types[0]], action)
    }
}

const runEffects = ({ effect, action, fn }) => {
    const it = effect.apply(null, [action, fn])
    const handleNext = value => {
        const next = it.next(value)
        return (next => (next.done
            ? next.value
            : Promise
                .resolve(next.value)
                .then(handleNext, err => console.error(err))
        ))(next)
    }
    return Promise
        .resolve()
        .then(handleNext)
}

const wrappedDispatch = (dispatch, state, effects) => {
    return function (action) {
        if (effects[action.type]) {
            dispatch({
                type: 'loading',
                payload: {
                    name: action.type,
                    status: true
                }
            })
            const types = action.type.split('/')
            const call = (promise, params) => promise(params)
            const select = assign => assign(state)
            const put = _action => {
                const _types = _action.type.split('/')
                if (_types.length === 1) _action.type = [types[0], _action.type].join('/')
                dispatch(_action)
            }
            runEffects({
                effect: effects[action.type],
                action,
                fn: {
                    select,
                    put,
                    call,
                },
            })
                .then(() => {
                    dispatch({
                        type: 'loading',
                        payload: {
                            name: action.type,
                            status: false
                        }
                    })
                })
        } else {
            dispatch(action)
        }
    }
}

export const createStore = (models = []) => {
    const store = {
        _models: {
            loading: {},
        },
        _effects: {},
        _reducers: {}
    }
    if (models && models.length) {
        models.forEach((model = {}) => {
            store._models = {
                ...store._models,
                [model.namespace]: model.state
            }

            Object.entries(model.effects).forEach(([key, value]) => {
                store._effects = {
                    ...store._effects,
                    [`${model.namespace}/${key}`]: value
                }
            })

            Object.entries(model.reducers).forEach(([key, value]) => {
                store._reducers = {
                    ...store._reducers,
                    [`${model.namespace}/${key}`]: value
                }
            })
        })
    }
    return store
}

export const connect = assign => {
    const WrappedComponent = Component => {
        return props => {
            const store = React.useContext(Context)
            return <Component
                {...assign(store)}
                {...props}
                dispatch={store.dispatch}
            />
        }
    }
    return WrappedComponent
}

export const Provider = ({ children, store }) => {
    const [state, dispatch] = React.useReducer((s, a) => reducers(s, a, store._reducers), store._models)

    return (
        <Context.Provider
            value={{ ...state, dispatch: wrappedDispatch(dispatch, state, store._effects) }}
        >
            {children}
        </Context.Provider>
    )
}