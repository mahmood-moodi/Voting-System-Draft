import React from "react";
import { Transfer } from "antd";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetKeys: []
    };
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.members !== prevProps.members) {
  //     const targetKeys = [];
  //     const mockData = [];
  //     let key = 0;

  //     for (let member of this.props.members) {
  //       const data = {
  //         key,
  //         title: member.name,
  //         chosen: false
  //       };
  //       key++;
  //       if (data.chosen) {
  //         targetKeys.push(data.key);
  //       }
  //       mockData.push(data);
  //     }

  //     this.setState({ mockData, targetKeys });
  //   }
  // }

  
  filterOption = (inputValue, option) => {
    return option.title.indexOf(inputValue) > -1;
  };

  handleChange = targetKeys => {
    this.setState({ targetKeys });
    
  };

  render() {
    return (
      <h1>taha</h1>
     

    );
  }
}
