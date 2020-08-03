import * as React from 'react';
import { useNativeEffect } from 'remax'
import { View, Text, hideLoading, showLoading } from 'remax/wechat';
import { Button } from 'anna-remax-ui';
import { connect } from '@/utils/store'
import { navigateTo } from 'remax/one';
import styles from './index.css';

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

  useNativeEffect(() => {
    if (model) {
      console.log(model)
    }
  }, [model])

  return (
    <View className={styles.app}>
      <View>
        <Button
          loading={loading[`${modelName}/updateUserInfo`]}
          onClick={handleClick}
          type="default"
        >
          Click
        </Button>
      </View>
      <Text>name: {userInfo.name}</Text>
      <Text>age: {userInfo.age}</Text>
      <View>
        <Button
          loading={loading[`${modelName}/getUserInfo`]}
          onClick={handleClick1}
          type="primary"
        >
          Click async
        </Button>
      </View>
      <View style={{ height: 100 }} />

      <Button
        onClick={() => navigateTo({
          url: '/pages/demo/index'
        })}
        type="primary"
      >
        NavigateTo
      </Button>
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
