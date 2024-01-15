/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const activityRouter = {
    path: '/activity',
    component: Layout,
    redirect: '/activity/list',
    name: 'Record',
    meta: {
        title: '活动列表',
        icon: 'star'
    },
    children: [
        {
            path: 'list',
            component: () => import('@/views/activity/list'),
            name: 'activityList',
            meta: { title: '活动列表' },
        },
        {
            path: 'evaluate',
            component: () => import('@/views/activity/evaluate'),
            name: 'evaluate',
            hidden: true,
            meta: { title: '活动评价' }
        },
        {
            path: 'add',
            component: () => import('@/views/activity/add'),
            name: 'add',
            meta: { title: '添加活动' }
        }
    ]
}
export default activityRouter
