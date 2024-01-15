/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const recordRouter = {
  path: '/record',
  component: Layout,
  redirect: '/record/visitReserve',
  name: 'Record',
  meta: {
    title: '预约记录',
    icon: 'table'
  },
  children: [
    {
      path: 'visitReserve',
      component: () => import('@/views/record/visitReserve'),
      name: 'VisitReserve',
      meta: { title: '参观预约记录' }
    },
    {
      path: 'actiReserve',
      component: () => import('@/views/record/actiReserve'),
      name: 'ActiReserve',
      meta: { title: '活动预约记录' }
    },
    {
      path: 'venueRate',
      component: () => import('@/views/record/venueRate'),
      name: 'venueRate',
      meta: { title: '场馆评分' }
    }
  ]
}
export default recordRouter
