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

const runEffects = function (gen) {
    const args = [].slice.call(arguments, 1)
    const it = gen.apply(this, args)
    return Promise.resolve()
        .then(function handleNext(value) {
            const next = it.next(value)
            return (next => (next.done
                ? next.value
                : Promise.resolve(next.value).then(handleNext, err => console.error(err))
            ))(next)
        })
}

const WrappedDispatch = (dispatch, state, effects) => {
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
            runEffects(effects[action.type], action, { select, put, call })
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

export class Store {
    store = {
        _models: {
            loading: {},
        },
        _effects: {},
        _reducers: {}
    }
    mapActions(key, obj) {
        if (obj[key] && !!Object.keys(obj[key]).length) {
            Object.entries(obj[key]).forEach(([k, v]) => {
                this.store[`_${key}`] = {
                    ...this.store[`_${key}`],
                    [`${obj.namespace}/${k}`]: v
                }
            })
        }
    }
    useModel(models) {
        models.forEach((model = {}) => {
            this.store._models = {
                ...this.store._models,
                [model.namespace]: model.state
            }
            this.mapActions('effects', model)
            this.mapActions('reducers', model)
        })
    }
}

export const connect = assign => {
    const Wrapped = Component => {
        return props => {
            const store = React.useContext(Context)
            return <Component
                {...assign(store)}
                {...props}
                dispatch={store.dispatch}
            />
        }
    }
    return Wrapped
}

export const Provider = ({ children, store }) => {
    const [state, dispatch] = React.useReducer((s, a) => reducers(s, a, store._reducers), store._models)

    return (
        <Context.Provider
            value={{ ...state, dispatch: WrappedDispatch(dispatch, state, store._effects) }}
        >
            {children}
        </Context.Provider>
    )
}