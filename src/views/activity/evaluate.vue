<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter" />
            <el-date-picker v-model="listQuery.timeRange" class="filter-item" type="datetimerange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                搜索
            </el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                @click="handleDownload">
                导出
            </el-button>
        </div>

        <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;"
            @sort-change="sortChange">
            <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80"
                :class-name="getSortClass('id')">
                <template slot-scope="{row}">
                    <span>{{ row.serialNumber }}</span>
                </template>
            </el-table-column>
            <el-table-column label="时间" min-width="120px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="身份证号" min-width="100px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="活动名称" min-width="80px">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleUpdate(row)">{{ row.activityName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="订单编号" min-width="100px">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleUpdate(row)">{{ row.timeRange }}</span>
                </template>
            </el-table-column>
            <el-table-column label="评分" class-name="status-col" width="100">
                <template slot-scope="{row}">
                    <el-tag :type="row.reserveStatus | statusFilter">
                        {{ row.reserveStatus }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)"
                        icon="el-icon-delete">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getList" />
    </div>
</template>

<script>
import { fetchList, fetchPv, createRecord, updateRecord } from '@/api/record/activity'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
    { key: 'CN', display_name: 'China' },
    { key: 'US', display_name: 'USA' },
    { key: 'JP', display_name: 'Japan' },
    { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
}, {})

export default {
    name: 'ComplexTable',
    components: { Pagination },
    directives: { waves },
    filters: {
        statusFilter(status) {
            const statusMap = {
                已完成: 'success',
                未到馆: 'danger',
                已取消: 'info'
            }
            return statusMap[status]
        },
        typeFilter(type) {
            return calendarTypeKeyValue[type]
        }
    },
    data() {
        return {
            tableKey: 0,
            list: null,
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                limit: 20,
                reserveStatus: undefined,
                name: undefined,
                activityName: undefined,
                sort: '+id',
                timeRange: undefined
            },
            importanceOptions: [1, 2, 3],
            calendarTypeOptions,
            sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
            statusOptions: ['已完成', '未开始', '已取消', '未到馆'],
            showReviewer: false,
            temp: {
                id: undefined,
                importance: 1,
                remark: '',
                timestamp: new Date(),
                title: '',
                type: '',
                status: 'published'
            },
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: 'Edit',
                create: 'Create'
            },
            dialogPvVisible: false,
            pvData: [],
            rules: {
                type: [{ required: true, message: 'type is required', trigger: 'change' }],
                timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
                title: [{ required: true, message: 'title is required', trigger: 'blur' }]
            },
            downloadLoading: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            fetchList(this.listQuery).then(response => {
                this.list = response.data.items
                this.total = response.data.total

                // Just to simulate the time of the request
                setTimeout(() => {
                    this.listLoading = false
                }, 1.5 * 1000)
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        handleModifyStatus(row, status) {
            this.$message({
                message: '操作Success',
                type: 'success'
            })
            row.status = status
        },
        sortChange(data) {
            const { prop, order } = data
            if (prop === 'id') {
                this.sortByID(order)
            }
        },
        sortByID(order) {
            if (order === 'ascending') {
                this.listQuery.sort = '+id'
            } else {
                this.listQuery.sort = '-id'
            }
            this.handleFilter()
        },
        resetTemp() {
            this.temp = {
                id: undefined,
                importance: 1,
                remark: '',
                timestamp: new Date(),
                title: '',
                status: 'published',
                type: ''
            }
        },
        handleCreate() {
            this.resetTemp()
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        createData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
                    this.temp.author = 'vue-element-admin'
                    createRecord(this.temp).then(() => {
                        this.list.unshift(this.temp)
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Created Successfully',
                            type: 'success',
                            duration: 2000
                        })
                    })
                }
            })
        },
        handleUpdate(row) {
            this.temp = Object.assign({}, row) // copy obj
            this.temp.timestamp = new Date(this.temp.timestamp)
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        updateData() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const tempData = Object.assign({}, this.temp)
                    tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
                    updateRecord(tempData).then(() => {
                        const index = this.list.findIndex(v => v.id === this.temp.id)
                        this.list.splice(index, 1, this.temp)
                        this.dialogFormVisible = false
                        this.$notify({
                            title: 'Success',
                            message: 'Update Successfully',
                            type: 'success',
                            duration: 2000
                        })
                    })
                }
            })
        },
        handleDelete(row, index) {
            this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
            })
            this.list.splice(index, 1)
        },
        handleFetchPv(pv) {
            fetchPv(pv).then(response => {
                this.pvData = response.data.pvData
                this.dialogPvVisible = true
            })
        },
        handleDownload() {
            this.downloadLoading = true
            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = ['ID', '时间', '姓名', '身份证号', '活动名称', '预约时段', '状态']
                const filterVal = ['serialNumber', 'timestamp', 'name', 'id', 'activityName', 'timeRange', 'reserveStatus']
                const data = this.formatJson(filterVal)
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: 'table-list'
                })
                this.downloadLoading = false
            })
        },
        formatJson(filterVal) {
            return this.list.map(v => filterVal.map(j => {
                if (j === 'timestamp') {
                    return parseTime(v[j])
                } else {
                    return v[j]
                }
            }))
        },
        getSortClass: function (key) {
            const sort = this.listQuery.sort
            return sort === `+${key}` ? 'ascending' : 'descending'
        }
    }
}
</script>