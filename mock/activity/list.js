const Mock = require('mockjs')

const List = []
const count = 100

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
        activityName: '@first',
        id: '@string("number", 18)',
        timeRange: generateTimeRange,
        'reserveStatus|1': ['未开始', '已完成', '未参加', '已取消']
    }))
}

module.exports = [
    {
        url: '/vue-element-admin/activity/list/get',
        type: 'get',
        response: config => {
            const { reserveStatus, name, activityName, page = 1, limit = 20, sort } = config.query

            let mockList = List.filter(item => {
                if (reserveStatus && item.reserveStatus !== reserveStatus) return false
                if ((name && item.name.indexOf(name) < 0) || (activityName && item.activityName.indexOf(activityName))) return false
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
    }
        
]

