<template>
  <div class="app-container">
    <el-calendar v-model="value" style="width:50%;">
      <template slot="dateCell" slot-scope="{date, data}">
        <p :class="data.isSelected ? 'is-selected' : ''">
          {{ data.day.split('-').slice(2)[0] }} {{ data.isSelected ? '✔️' : '' }}
        </p>
      </template>
    </el-calendar>
    <el-table :data="tableData" style="width: 50%" v-show="timeTable" :default-sort="{ prop: 'time1' }">
      <el-table-column prop="time1" label="开始时间" width="220">
      </el-table-column>
      <el-table-column prop="time2" label="结束时间" width="220">
      </el-table-column>
      <el-table-column prop="ticketAmount" label="门票数量" width="220">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="text" v-show="timeTable" @click="dialogFormVisible = true"
      style="padding-left: 10px;">添加时间段</el-button>


    <el-dialog title="时段和门票设置" :visible.sync="dialogFormVisible" width="30%" center>
      <el-form :model="form">
        <el-form-item label="开放时段" :label-width="formLabelWidth">
          <el-time-picker is-range v-model="form.timeRange" range-separator="至" start-placeholder="开始时间"
            end-placeholder="结束时间" placeholder="选择时间范围" format="HH:mm" style="width: 60%;">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="门票数量" :label-width="formLabelWidth">
          <el-input v-model="form.ticketAmount" autocomplete="off" style="width: 30%;margin-right: 10px;"></el-input>张
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>



<script>
export default {
  data() {
    return {
      value: new Date(),
      tableData: [],
      timeTable: false,
      dialogFormVisible: false,
      form: {
        timeRange: [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 9, 0)],
        time1: '',
        time2: '',
        ticketAmount: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    submit() {
      this.form.time1 = this.form.timeRange[0].toLocaleTimeString()
      this.form.time2 = this.form.timeRange[1].toLocaleTimeString()
      let data = {
        time1: this.form.time1,
        time2: this.form.time2,
        ticketAmount: this.form.ticketAmount
      }
      if (data.ticketAmount != '') {
        this.dialogFormVisible = false
        this.tableData.push(data)
      } else {
        this.$message({
          showClose: true,
          message: '请填写门票数量',
          type: 'error'
        });
      }
    },

    handleDelete(index, row) {
      this.tableData.splice(row, 1)
    }

  },
  watch: {
    value: {
      handler() {
        let date1 = this.value.getTime()
        let date2 = new Date().getTime()

        if (date1 > date2)
          this.timeTable = true
        else
          this.timeTable = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  position: relative;
  left: 24%
}
</style>
