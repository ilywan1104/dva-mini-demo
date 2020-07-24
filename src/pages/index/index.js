import * as React from 'react';
import { View, Text, Button, hideLoading, showLoading } from 'remax/wechat';
import styles from './index.css';
import { connect } from '@/utils/store'

const Index = ({
  dispatch,
  loading,
  model,
  modelName
}) => {
  const { userInfo = {} } = model

  const handleClick = () => {
    showLoading({
      title: 'loading...'
    })
    dispatch({
      type: `${modelName}/updateUserInfo`,
      payload: {},
      callback: hideLoading
    })
  }

  const handleClick1 = () => {
    showLoading({
      title: 'loading...'
    })
    dispatch({
      type: `${modelName}/getUserInfo`,
      payload: {
        userInfo: {
          name: '大象心理',
          age: 18
        }
      },
      callback: hideLoading
    })
  }

  React.useEffect(() => {
    if (model.data) {
      console.log('props', model)
    }
  }, [model.data])

  return (
    <View className={styles.app}>
      <Button loading={loading[`${modelName}/updateUserInfo`]} onClick={handleClick}>Click</Button>
      <Text style={{ color: '#fff' }}>name: {userInfo.name}</Text> <Text style={{ color: '#fff' }}>age: {userInfo.age}</Text>
      <Button loading={loading[`${modelName}/getUserInfo`]} onClick={handleClick1}>Click async</Button>
    </View>
  )
}

export default connect(({
  loading,
  user,
}) => ({
  loading,
  model: user,
  modelName: 'user'
}))(Index)
