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
import "./AddCampigns.css";

import icon from "../icon.png";


const FormItem = Form.Item;

let electoralKeys = null;

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
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
  // our main form submiter
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
        const { candidates, campaignName, startDate, endDate } = values;

        const { mockData } = this.state;

        let counter = 0;
      
        const finalVoters = mockData.map((voter, index, array) => {
          if (
            voter.key === candidates[counter] &&
            counter < candidates.length
          ) {
            counter++;
            return { ...voter, candidate: true };
          } else {
            return { ...voter, candidate: false };
          }
        });

        const finalStartDate = startDate._d;
        const finalEndDate = endDate._d;
        try {
          const docRef = await db.collection("campaigns").add({
            campaignName,
            startDate: finalStartDate,
            endDate: finalEndDate,
            members : finalVoters            
        })
        .then(function(docRef) {
          console.log('The auto-generated ID is', docRef.id)
          var documentName = docRef.id
          alert(documentName+"Campaign has been created!",);
          })
             
          }
            catch (e) {
          alert(`There was an error creating a campaign`);
        }       
      }
    });
  };
  // for uploading memebers to the campign, firebase.

  disabledStartDate = startValue => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onStartChange = value => {
    this.onChange("startValue", value);
  };

  onEndChange = value => {
    this.onChange("endValue", value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  // normFile(e) {
  //   console.log("this runs firsttttttttt");
  //   console.log("Upload event:", e);
  //   if (Array.isArray(e)) {
  //     console.log("came here and returned")
  //     return e;
  //   }
  //   return e && e.fileList;
  // }

  filterTargetOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1;
  };

  handleTargetChange = targetKeys => {
    this.setState(prevState => ({
      ...prevState,
      targetKeys
    }));
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { startValue, endValue, endOpen } = this.state;

    return (
      <div className="form-wrapper">
        <style>{"body { background-color: #ffeaa7; }"}</style>
        <div className="form-container">
          <div className="picture-container">
            <img src={icon} width={`auto`} height={`100%`} />
          </div>
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
              <div className="date-container">
                <FormItem>
                  <div>
                    {getFieldDecorator("startDate", {
                      rules: [
                        {
                          required: true,
                          message: "Start date is required"
                        }
                      ]
                    })(
                      <DatePicker
                        disabledDate={this.disabledStartDate}
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="Start"
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}
                      />
                    )}
                  </div>
                </FormItem>
                <FormItem>
                  <div>
                    {getFieldDecorator("endDate", {
                      rules: [
                        {
                          required: true,
                          message: "Start date is required"
                        }
                      ]
                    })(
                      <DatePicker
                        disabledDate={this.disabledEndDate}
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="End"
                        onChange={this.onEndChange}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                      />
                    )}
                  </div>
                </FormItem>
              </div>
              <div className="upload-container">
                <FormItem>
                  <Upload beforeUpload={this.beforeUpload}>
                    <Button>
                      <Icon type="upload" /> Upload Campaign Members
                    </Button>
                  </Upload>
                </FormItem>
              </div>

              <div className="tranfer-container">
                <FormItem>
                  {getFieldDecorator("candidates")(
                    <Transfer
                      dataSource={this.state.mockData}
                      showSearch
                      filterOption={this.filterTargetOption}
                      targetKeys={this.state.targetKeys}
                      onChange={this.handleTargetChange}
                      render={item => item.title}
                    />
                  )}
                </FormItem>
              </div>
              <div className="register-container">
                <FormItem>
                  <Button type="primary" htmlType="submit">
                    Register
                  </Button>
                </FormItem>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

export default WrappedRegistrationForm;
