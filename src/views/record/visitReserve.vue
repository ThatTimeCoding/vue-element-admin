<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.name" placeholder="姓名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter" />
            <el-select v-model="listQuery.reserveStatus" placeholder="状态" clearable class="filter-item"
                style="width: 130px">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item" :value="item" />
            </el-select>
            <el-date-picker v-model="listQuery.timeRange" class="filter-item" type="datetimerange" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download"
                @click="handleDownload">导出</el-button>
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
            <el-table-column label="预约时段" min-width="150px">
                <template slot-scope="{row}">
                    <span class="link-type">{{ row.timeRange }}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" class-name="status-col" width="100">
                <template slot-scope="{row}">
                    <el-tag :type="row.reserveStatus | statusFilter">{{ row.reserveStatus }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button v-if="row.status != 'deleted'" size="mini" type="danger" @click="handleDelete(row, $index)"
                        icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
            @pagination="getList" />
    </div>
</template>

<script>
import {fetchList} from "@/api/record/visit";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
    name: "visitReserve",
    components: { Pagination },
    directives: { waves },
    filters: {
        statusFilter(status) {
            const statusMap = {
                已完成: "success",
                未到馆: "danger",
                已取消: "info"
            };
            return statusMap[status];
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
                timeRange: undefined,
                sort: "+id"
            },
            statusOptions: ["已完成", "未开始", "已取消", "未到馆"],
            downloadLoading: false
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then(response => {
                this.list = response.data.items;
                this.total = response.data.total;

                // Just to simulate the time of the request
                setTimeout(() => {
                    this.listLoading = false;
                }, 1.5 * 1000);
            });
        },
        handleFilter() {
            this.listQuery.page = 1;
            this.getList();
        },
        sortChange(data) {
            const { prop, order } = data;
            if (prop === "id") {
                this.sortByID(order);
            }
        },
        sortByID(order) {
            if (order === "ascending") {
                this.listQuery.sort = "+id";
            } else {
                this.listQuery.sort = "-id";
            }
            this.handleFilter();
        },
        handleDelete(row, index) {
            this.$notify({
                title: "Success",
                message: "Delete Successfully",
                type: "success",
                duration: 2000
            });
            this.list.splice(index, 1);
        },
        handleDownload() {
            this.downloadLoading = true;
            import("@/vendor/Export2Excel").then(excel => {
                const tHeader = ["ID", "时间", "姓名", "身份证号", "预约时段", "状态"];
                const filterVal = [
                    "serialNumber",
                    "timestamp",
                    "name",
                    "id",
                    "timeRange",
                    "reserveStatus"
                ];
                const data = this.formatJson(filterVal);
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: "table-list"
                });
                this.downloadLoading = false;
            });
        },
        formatJson(filterVal) {
            return this.list.map(v =>
                filterVal.map(j => {
                    if (j === "timestamp") {
                        return parseTime(v[j]);
                    } else {
                        return v[j];
                    }
                })
            );
        },
        getSortClass: function (key) {
            const sort = this.listQuery.sort;
            return sort === `+${key}` ? "ascending" : "descending";
        }
    }
};
</script>
