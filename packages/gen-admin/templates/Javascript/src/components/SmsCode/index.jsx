import React from 'react'
import { Form, Button, Statistic, Input } from 'antd'
import classNames from 'classnames'
import createRequest from 'utils/createRequest'
import './styles.scss'
import { span } from 'fp-ts/lib/Array'

const { Countdown } = Statistic

export default class SmsCode extends React.PureComponent {
  state = {
    isSend: false,
    hasSend: false,
    countdownTimeout: 0,
  }

  getCode = async () => {
    const { account, mobileNumber } = this.props

    try {
      const { code } = await createRequest('common.smscode', {
        account,
        mobileNumber,
      })
      if (code === 200) {
        // 验证码发送成功
        this.setState({
          hasSend: true,
          isSend: true,
          countdownTimeout: Date.now(),
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  onFinish = () => {
    console.log('finish')
    this.setState({
      isSend: false,
    })
  }

  async validateCode(smsVerificationCode) {
    const { account, mobileNumber, setCodeError } = this.props

    try {
      const { code } = await createRequest('common.smscodeCheck', {
        account,
        mobileNumber,
        smsVerificationCode,
      })
      if (code === 200) {
        return true
      }
    } catch (err) {
      setCodeError(true)
      return false
    }
  }

  getData = () => {
    const {
      form: { validateFields },
      setCodeError,
      onSuccess,
    } = this.props
    validateFields(['smsVerificationCode'], async (err, values) => {
      if (!err) {
        // 发起请求
        console.log('Received values of form: ', values)
        const { smsVerificationCode } = values
        if (typeof smsVerificationCode === 'undefined') {
          setCodeError(true)
          return
        }
        const isCodeOk = await this.validateCode(smsVerificationCode)
        if (isCodeOk) {
          // 校验都通过，跳到下一步，并且保存当前值
          if (onSuccess) {
            onSuccess()
          }
        }
      }
    })
  }

  render() {
    const { isSend, hasSend, countdownTimeout } = this.state
    const { description, codeError, resetPage, nextBtn } = this.props
    const { getFieldDecorator } = this.props.form
    const codeErrorCls = classNames('code', 'ant-row-mb0')
    const btnCls = classNames('lz-next-button', { mt0: codeError })
    const getCodeCls = classNames('getCode', { getCodeleft: nextBtn })
    return (
      <>
        <Form.Item label="短信验证码" className={codeErrorCls}>
          {getFieldDecorator('smsVerificationCode')(
            <Input
              placeholder="请输入短信验证码"
              size={resetPage && 'large'}
              style={{ width: 180 }}
              onChange={this.props.hanldeChange}
              allowClear
            />
          )}
          <div className={getCodeCls}>
            {!isSend ? (
              <Button type="primary" ghost={resetPage} size={resetPage && 'large'} onClick={this.getCode}>
                {hasSend ? '重新发送' : '发送验证码'}
              </Button>
            ) : (
              <Button type="primary" ghost={resetPage} size={resetPage && 'large'} disabled>
                重新发送(
                <Countdown value={countdownTimeout + 1000 * 60} onFinish={this.onFinish} format="ss" />
                s)
              </Button>
            )}
          </div>
        </Form.Item>

        {nextBtn && (
          <Form.Item>
            <div className="text-danger text-center ml40">
              {codeError ? '输入验证码有误，请重新输入！' : <span>&nbsp;</span>}
            </div>
          </Form.Item>
        )}
        {resetPage && (
          <>
            {description}
            <div className={btnCls} onClick={this.getData}>
              下一步
            </div>
          </>
        )}
        {nextBtn && (
          <div className="mt30 text-right">
            <Button onClick={() => this.props.hidden()}>取消</Button>
            <Button className="ml5" type="primary" onClick={this.getData}>
              下一步
            </Button>
          </div>
        )}
      </>
    )
  }
}
