import * as React from 'react'
import { View, Text } from 'remax/one'
import { Tabs, Card } from 'anna-remax-ui'

const { TabContent } = Tabs

import styles from './index.less'

const tabs4 = [
    {
        key: '0',
        title: 'All',
    },
    {
        key: '1',
        title: 'Read',
    },
    {
        key: '2',
        title: 'Missed',
    },
]

export default props => {

    const [stateKey4, setStateKey4] = React.useState('0')

    return (
        <Tabs
            fixed
            onTabClick={({ key }) => setStateKey4(key)}
            activeKey={stateKey4}
        >
            {tabs4.map(tab => (
                <TabContent key={tab.key} tab={tab.title}>
                    <Card>
                        <View className={styles.tabContent}>{`${tab.title} content`}</View>
                    </Card>
                </TabContent>
            ))}
        </Tabs>
    )
}