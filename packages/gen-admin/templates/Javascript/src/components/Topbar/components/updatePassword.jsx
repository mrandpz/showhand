import React from 'react'
import { Modal, Button, Form, Input, Card, message, Popconfirm, Icon } from 'antd'
import SmsCode from 'components/SmsCode'

import createRequest from 'utils/createRequest'
const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
  },
}
class UpdatePassword extends React.PureComponent {
  state = {
    current: 1,
    visible: false,
    codeError: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      current: 1,
    })
  }

  resetPassword = async params => {
    const res = await createRequest('common.passwordUpdate', params)
    const { mobileNumber } = this.props
    if (res.code === 200) {
      this.setState({
        visible: false,
        current: 1,
      })
      message.success(
        <div>
          操作成功
          <br />
          密码已发送到{mobileNumber}手机上
        </div>
      )
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    const { validateFields } = this.props.form
    validateFields((err, values) => {
      if (!err) {
        const { password } = values
        const { currentUser = {} } = this.props
        const { account } = currentUser
        this.resetPassword({ password, type: 2, account })
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { getFieldValue } = this.props.form
    if (value && value !== getFieldValue('password')) {
      callback('两次输入密码不同!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { validateFields } = this.props.form
    if (value) {
      validateFields(['confirm'], { force: true })
    }
    callback()
  }

  Step2() {
    const { getFieldDecorator } = this.props.form
    return (
      <>
        <p className="mb30">新密码不能与使用过的旧密码相同。</p>
        <header className="header" style={{ width: 380 }}>
          <Form.Item label="新密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '必填',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password placeholder="8-16位密码，区分大小写" />)}
          </Form.Item>
          <Form.Item label="确认新密码">
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认新密码',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password placeholder="请确认新密码" />)}
          </Form.Item>
        </header>
        <footer className="reset-footer mt30">
          <Popconfirm
            title="你确定要取消操作吗？"
            onConfirm={this.handleCancel}
            placement="topRight"
            okText="是"
            cancelText="否">
            <Button>取消</Button>
          </Popconfirm>

          <Button className="ml10" htmlType="submit" type="primary" onClick={this.handleSubmit}>
            确定
          </Button>
        </footer>
      </>
    )
  }

  onSuccess = () => {
    this.setState({
      current: 2,
    })
  }

  setCodeError = bool => {
    this.setState({
      codeError: bool,
    })
  }

  hanldeChange = key => {
    const { codeError } = this.state
    if (codeError) {
      this.setState({
        codeError: false,
      })
    }
  }

  hidden = () => {
    this.setState({
      visible: false,
    })
  }

  Step1() {
    const { form, currentUser = {} } = this.props
    const { account, mobileNumber } = currentUser
    const { codeError } = this.state
    return (
      <div className="lz-reset-form reset-modal-form">
        <Card className="mb30">
          温馨提示：
          <p>1、为了确保为您本人操作，请先进行安全验证；</p>
          <p>2、点击获取验证码，将发送短信验证码到{mobileNumber}手机上。</p>
        </Card>
        <SmsCode
          form={form}
          hanldeChange={this.hanldeChange}
          onSuccess={this.onSuccess}
          account={account}
          mobileNumber={mobileNumber}
          setCodeError={this.setCodeError}
          codeError={codeError}
          hidden={this.hidden}
          nextBtn></SmsCode>
      </div>
    )
  }

  renderModal = () => {
    const { visible, current } = this.state

    return (
      <Modal
        title="修改密码"
        className="lz-reset-password"
        visible={visible}
        footer={null}
        closable={false}
        width={500}>
        <Form {...formItemLayout}>{current === 1 ? this.Step1() : this.Step2()}</Form>
      </Modal>
    )
  }

  render() {
    return (
      <>
        <a onClick={this.showModal}>
          <Icon type="lock" className="mr10" />
          重置密码
        </a>
        {this.renderModal()}
      </>
    )
  }
}

export default Form.create()(UpdatePassword)
