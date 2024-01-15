/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const settingRouter = {
    path: '/setting',
    component: Layout,
    redirect: '/setting/venueInfo',
    name: 'venueInfo',
    meta: {
        title: '设置',
        icon: 'star'
    },
    children: [
        {
            path: 'venInfo',
            component: () => import('@/views/setting/venue_message'),
            name: 'venInfo',
            meta: { title: '场馆信息' },
        },
        {
            path: 'accoutInfo',
            component: () => import('@/views/setting/account_setting'),
            name: 'accountInfo',
            meta: { title: '账户设置' },
        },
        {
            path: 'period',
            component: () => import('@/views/setting/period'),
            name: 'period',
            meta: { title: '时段设置' },
        }
    ]
}
export default settingRouter
 