import { Button, Form, Input, Space, Typography, message } from "antd";
import React from "react";
import style from './Login.module.css'

const { Text } = Typography

const Login = (props) => {
    const loginFailed = () => {
        message.error('Please, enter your name!');
    }

    const loginSuccess = (values) => {
        props.setUsername(values.username)
        props.setAuthorized(true)
    }

    return (
        <div className={style.login}>
            <Form onFinishFailed={loginFailed} onFinish={loginSuccess}>
                <Form.Item name="username" rules={[{ required: true, message: '' }]}>
                    <Space direction='vertical' size='small' style={{width: '100%'}}>
                        <Text>Enter your name</Text>
                        <Input />
                    </Space>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' block>Enter</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
