import React from 'react'
import { Table } from 'antd'
// import { formatMessage } from 'helpers/i18n'

const AntdTableEmptyText = () => (
  <div className="lz-antd-table-empty-placeholder">
    {/* <span>{formatMessage('common.table.emptyText')}</span> */}
  </div>
)
Table.defaultProps = Table.defaultProps || {}
// 全局修改表格组件的默认属性
Table.defaultProps.locale = {
  emptyText: <AntdTableEmptyText />,
}
