import { Button, Typography, Avatar, Row, Col, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import style from "./Chat.module.css";

const { Text, Title } = Typography;

const Chat = (props) => {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState([]);
    const socket = React.useRef();
    let messagesRef = React.createRef();

    useEffect(() => {
        message.loading({ content: "Connection...", key: "conn" });
        connectSocket();
    }, []);

    const sendNewConnection = () => {
        const message = {
            action: "new_connection",
            username: props.username,
        };
        socket.current.send(JSON.stringify(message));
    }

    const getPrevMessages = () => {
        socket.current.send(JSON.stringify({action: 'get_prev_messages'}));
    }

    function connectSocket() {
        socket.current = new WebSocket("ws://localhost:5000");

        socket.current.onopen = () => {
            message.success({ content: "Connected!", key: "conn" });
            sendNewConnection()
            getPrevMessages()
        };

        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            
            switch (message.action) {
                case 'new_connection':
                case 'new_message':
                    setMessages((prev) => [...prev, message]);
                    break;
                case 'get_prev_messages':
                    setMessages(message.last_msg);
                default:
                    break;
            }
        };
        socket.current.onerror = () => {
            message.error({ content: "Server error", key: "conn" });
        };
    }

    const sendMessage = () => {
        const message = {
            username: props.username,
            message: value,
            action: "new_message",
        };
        socket.current.send(JSON.stringify(message));
        setValue("");
    };

    useEffect(() => {
        messagesRef.current.scrollTo({
            top: messagesRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div className={style.chat}>
            <div className={style.messages} ref={messagesRef}>
                {messages.length <= 0 ? (
                    <Text type="secondary">Messages empty</Text>
                ) : (
                    messages.map((message, index) => {
                        if (message.action === 'new_message') {
                            return <div className={message.username === props.username ? style["my-message"] : style.message} key={index}>
                                <div className="avatar">
                                    <Avatar size={48} icon={<UserOutlined />} />
                                </div>
                                <div className={style["text-message"]}>
                                    <Title level={5}>{message.username}</Title>
                                    <Text>{message.message}</Text>
                                </div>
                            </div>
                        } else if (message.action === 'new_connection') {
                            return <div key={index} style={{marginBottom: 8}}><Text type="secondary">{message.username} entered the chat!</Text></div>
                        }
                    })
                )}
            </div>
            <div className="send">
                <Row gutter={5}>
                    <Col span={20}>
                        <Input value={value} onChange={(e) => setValue(e.target.value)} size="large"/>
                    </Col>
                    <Col span={4}>
                        <Button block size="large" type="primary" disabled={!value} onClick={sendMessage}>Send</Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Chat;
