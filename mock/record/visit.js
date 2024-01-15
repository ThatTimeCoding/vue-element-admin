const Mock = require('mockjs')

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
const generateTimeRange = () => {
    const startHour = Mock.Random.integer(0, 23);
    const endHour = Mock.Random.integer(startHour + 1, 24);
    const startTime = `${startHour.toString().padStart(2, '0')}:00`;
    const endTime = `${endHour.toString().padStart(2, '0')}:00`;

    const year = Mock.Random.integer(2021, 2022);
    const month = Mock.Random.integer(1, 12).toString().padStart(2, '0');
    const day = Mock.Random.integer(1, 28).toString().padStart(2, '0');
    return `${year}-${month}-${day}   ${startTime} ~ ${endTime}`;
};

for (let i = 0; i < count; i++) {
    List.push(Mock.mock({
        serialNumber: '@increment',
        timestamp: +Mock.Random.date('T'),
        name: '@first',
        id: '@string("number", 18)',
        timeRange: generateTimeRange,
        'reserveStatus|1': ['未开始', '已完成', '未到馆', '已取消'],
    }))
}

module.exports = [
    {
        url: '/vue-element-admin/record/visit/list',
        type: 'get',
        response: config => {
            const { reserveStatus, name, page = 1, limit = 20, sort } = config.query

            let mockList = List.filter(item => {
                if (reserveStatus && item.reserveStatus !== reserveStatus) return false
                if (name && item.name.indexOf(name) < 0) return false
                return true
            })

            if (sort === '-id') {
                mockList = mockList.reverse()
            }

            const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

            return {
                code: 20000,
                data: {
                    total: mockList.length,
                    items: pageList
                }
            }
        }
    },

    {
        url: '/vue-element-admin/record/visit/detail',
        type: 'get',
        response: config => {
            const { id } = config.query
            for (const record of List) {
                if (record.id === +id) {
                    return {
                        code: 20000,
                        data: record
                    }
                }
            }
        }
    },

    {
        url: '/vue-element-admin/record/visit/pv',
        type: 'get',
        response: _ => {
            return {
                code: 20000,
                data: {
                    pvData: [
                        { key: 'PC', pv: 1024 },
                        { key: 'mobile', pv: 1024 },
                        { key: 'ios', pv: 1024 },
                        { key: 'android', pv: 1024 }
                    ]
                }
            }
        }
    },

    {
        url: '/vue-element-admin/record/visit/create',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    },

    {
        url: '/vue-element-admin/record/visit/update',
        type: 'post',
        response: _ => {
            return {
                code: 20000,
                data: 'success'
            }
        }
    }
]

