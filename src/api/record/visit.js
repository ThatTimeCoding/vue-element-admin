import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/vue-element-admin/record/visit/list',
        method: 'get',
        params: query
    })
}

export function fetchRecord(id) {
    return request({
        url: '/vue-element-admin/record/visit/detail',
        method: 'get',
        params: { id }
    })
}

export function fetchPv(pv) {
    return request({
        url: '/vue-element-admin/record/visit/pv',
        method: 'get',
        params: { pv }
    })
}

export function createRecord(data) {
    return request({
        url: '/vue-element-admin/record/visit/create',
        method: 'post',
        data
    })
}

export function updateRecord(data) {
    return request({
        url: '/vue-element-admin/record/visit/update',
        method: 'post',
        data
    })
}
