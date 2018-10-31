import React from "react";
import Papa from "papaparse";
import { db } from "../firebase-init";
import {
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Transfer,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
    Upload,
    message,
    DatePicker
  } from "antd";
const FormItem = Form.Item;
class EETesting extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        members: null,
        targetKeys: [],
        mockData: []
      };
      this.moodiFileReader = this.moodiFileReader.bind(this);
      this.beforeUpload = this.beforeUpload.bind(this);
    }
    moodiFileReader(file, callback) {
        const reader = new FileReader();
    
        reader.onloadend = function(event) {
          if (reader.readyState === 2) {
            const csvString = event.target.result;
            callback(Papa.parse(csvString, { header: true }));
          }
        };
    
        reader.readAsText(file);
      }
      // main form submiter
      beforeUpload(file) {
        this.moodiFileReader(file, async result => {
          const { data } = result;
    
          // this.props.form.setFieldsValue({ voters: data });
          const targetKeys = [];
          const mockData = [];
          let key = 0;
    
          for (let member of data) {
            const memberData = {
              key,
              title: member.name,
              email: member.email,
              password: member.password
            };
            key++;
            mockData.push(memberData);
          }
          console.log(mockData)
          const docRef = await db.collection("campaigns").add({
            mockData            
            })
          this.setState({ mockData });
        });
    
        return false;
      }
      handleSubmit = e => {
        //uploads campaign names
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
          if (!err) {
            //map the voters and candidates
            const { candidates, campaignName} = values;
    
            const { mockData } = this.state;
    
            
    
            console.log(values)
            try {
              const docRef = await db.collection("campaigns").add({
                campaignName,
                members : candidates            
            })
              alert(`Campaign has been created!`);   
            }catch (e) {
              alert(`There was an error creating a campaign`);
            }       
          }
        });
      };
      render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div>
             <Form onSubmit={this.handleSubmit}>
             <FormItem>
                {getFieldDecorator("campaignName", {
                  rules: [
                    {
                      type: "string",
                      message: "The input is not valid string"
                    },
                    {
                      required: true,
                      message: "Please input campign name"
                    }
                  ]
                })(<Input placeholder="Campaign name" />)}
              </FormItem>
             <FormItem>
             <div className="upload-container">
                <FormItem>
                  <Upload beforeUpload={this.beforeUpload}>
                    <Button>
                      <Icon type="upload" /> Upload Campaign Members
                    </Button>
                  </Upload>
                </FormItem>
              </div>
              <div className="register-container">
                <FormItem>
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                </FormItem>
              </div>
             </FormItem>
             </Form>   
            </div>
        
        )};

}  
const WrappedEETesting = Form.create()(EETesting);

export default WrappedEETesting;
