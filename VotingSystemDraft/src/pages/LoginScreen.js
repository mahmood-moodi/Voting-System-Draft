import React from "react";
import { db } from "../firebase-init";
import { Redirect } from "react-router-dom";

import { Form, Icon, Input, Button, Checkbox } from "antd";
import "./LoginScreen.css";

import icon from "../icon.png";
const FormItem = Form.Item;

class LoginScreen extends React.Component {
  state = {
    loggedIn: false
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { email, password } = values;
        const { search } = this.props.location;

        const campaignId = search.substring(search.indexOf("=") + 1);
        if (campaignId) {
          const campaignReference = await db
            .collection("campaigns")
            .doc(campaignId);
          const campaign = await campaignReference.get();
          const { members } = campaign.data();

          const loggedInMember = members.filter(member => {
            if (member.email === email && member.password === password) {
              return member;
            }
          });

          if (loggedInMember.length === 1) {
            window.campaign = {
              cid: campaignId,
              user: loggedInMember[0],
              data: campaign.data()
            };

            this.setState(prevState => {
              return {
                ...prevState,
                loggedIn: true
              };
            });
          } else {
            alert("invalid username and password");
          }
        } else {
          alert("give CID as URL query param");
        }
      }
    });
  };

  render() {
    if (this.state.loggedIn) {
      return <Redirect to={`/voting-screen`} />;
    }
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="form-wrapper">
        <style>{"body { background-color: #ffeaa7; }"}</style>
        <div className="form-container">
          <div className="picture-container">
            <img src={icon} width={`auto`} height={`100%`} />
          </div>
          <div>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator("email", {
                  rules: [
                    { required: true, message: "Please input your ID Number!" }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Enter Your Email"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "Please input your Password!" }
                  ]
                })(
                  <Input
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="Enter Your Password"
                  />
                )}
              </FormItem>

              <FormItem>
                <Button
                  className="login-screen-button"
                  type="primary"
                  htmlType="submit"
                >
                  Log in
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(LoginScreen);

export default WrappedNormalLoginForm;