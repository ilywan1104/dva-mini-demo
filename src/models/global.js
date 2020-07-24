export default {
    namespace: 'global',
    state: {
        isInit: false,
    },
    effects: {
        * getAppInfo({
            payload
        }, {
            call,
            put
        }) {
            const res = yield call()
            return true
        }
    },
    reducers: {
        save(state, action){
            return {
                ...state,
                ...action.payload,
            }
        }
    }
}