import {
    getData,
    getUserData
} from '@/services/global'

export default {
    namespace: 'user',
    state: {
        userInfo: {},
    },
    effects: {
        * getUserInfo({
            payload,
            callback
        }, {
            call,
            put,
            select
        }) {
            const res1 = yield call(getData, payload)
            yield put({
                type: 'save',
                payload: {
                    ...payload,
                    data: res1
                }
            })
            const res3 = yield select(states => states['user'])
            if (typeof callback === 'function') callback()
            return true
        },
        * updateUserInfo({
            payload,
            callback
        }, {
            call,
            put,
            select
        }) {
            const res = yield call(getUserData)
            yield put({
                type: 'save',
                payload: {
                    userInfo: res
                }
            })
            if (typeof callback === 'function') callback()
            return true
        }
    },
    reducers: {
        save(state, action) {
            return {
                ...state,
                ...action.payload,
            }
        },
        reset(state, action) {
            return {
                ...state,
                ...action.payload,
            }
        }
    }
}