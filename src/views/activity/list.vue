<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.activityName" placeholder="活动名称" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter" />
            <el-select v-model="listQuery.reserveStatus" placeholder="状态" clearable class="filter-item"
                style="width: 130px">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item" :value="item" />
            </el-select>
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
            <el-table-column label="图片" width="150px" align="center">
                <template slot-scope="{row}">
                    <el-image style="width: 100px; height: 100px"
                        src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
                        :fit="fill"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="活动名称" width="110px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="费用" min-width="50px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="活动时间" min-width="80px">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleUpdate(row)">{{ row.activityName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="报名时间" min-width="80px">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleUpdate(row)">{{ row.timeRange }}</span>
                </template>
            </el-table-column>
            <el-table-column label="地点" min-width="80px">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleUpdate(row)">{{ row.timeRange }}</span>
                </template>
            </el-table-column>
            <el-table-column label="年龄限制" class-name="status-col" width="100">
                <template slot-scope="{row}">
                    <el-tag :type="row.reserveStatus | statusFilter">
                        {{ row.reserveStatus }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="活动介绍" class-name="status-col" width="100">
                <template slot-scope="{row}">
                    <el-popover placement="bottom" title="介绍" width="200" trigger="click"
                        content="这是一段介绍">
                        <el-button slot="reference">详情</el-button>
                    </el-popover>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button type="success" size="mini" @click="lookEvaluate(row)" icon="el-icon-view">
                    </el-button>
                    <el-button type="primary" size="mini" @click="handleUpdate(row)" icon="el-icon-edit">
                    </el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(row, $index)" icon="el-icon-delete">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getList" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
                style="width: 400px; margin-left:50px;">

                <el-form-item label="活动名称" prop="activityName">
                    <el-input placeholder="请输入内容" v-model="activityForm.activityName" clearable>
                    </el-input>
                </el-form-item>

                <el-form-item label="活动时间" prop="activityTime">
                    <el-date-picker v-model="activityForm.activityTime" type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="活动地点" prop="activitySite">
                    <el-input placeholder="请输入内容" v-model="activityForm.activitySite" clearable>
                    </el-input>
                </el-form-item>

                <el-form-item label="报名时间" prop="registrationTime">
                    <el-date-picker v-model="activityForm.registrationTime" type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="年龄限制" prop="ageLimit">
                    <el-slider v-model="activityForm.ageLimit" range show-stops :max="100">
                    </el-slider>
                </el-form-item>

                <el-form-item label="费用" prop="activityCost">
                    <el-input-number v-model="activityForm.activityCost" @change="handleChange"
                        label="描述文字"></el-input-number>
                </el-form-item>


                <el-form-item label="图片" prop="picture">
                    <el-upload action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
                        :on-remove="handleRemove" :file-list="activityForm.picture" :limit='1' list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="活动介绍" prop="activityIntroduction">
                    <el-input type="textarea" autosize placeholder="请输入内容" v-model="activityForm.activityIntroduction">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">
                    取消
                </el-button>
                <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { fetchList, fetchPv, createRecord, updateRecord } from '@/api/record/activity'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
            statusOptions: ['已完成', '未开始', '已取消', '未到馆'],
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑',
            },
            rules: {
                type: [{ required: true, message: 'type is required', trigger: 'change' }],
                timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
                title: [{ required: true, message: 'title is required', trigger: 'blur' }]
            },
            downloadLoading: false,
            activityForm: {
                activityName: undefined,
                activityTime: undefined,
                activitySite: undefined,
                registrationTime: undefined,
                ageLimit: undefined,
                activityCost: undefined,
                activityIntroduction: undefined,
                picture: undefined
            }
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
        },
        lookEvaluate() {
            this.$router.push('/activity/evaluate')
        }
    }
}
</script>