import React from "react"
import { Redirect } from "react-router-dom";
import { db } from "../firebase-init";
import { Card, Col, Row, Button } from "antd";

class ListCampaigns extends React.Component {
  state = { 
    ids: [], 
    names: [],
    elementts: []
  };

  componentDidMount() {
    this.findDocuments();
    
  }   

  findDocuments = () => {
    db.collection("campaigns")
      .get()
      .then(querySnapshot => {
        var data_id = [];
        var name = [];
        var elements = [];
        querySnapshot.forEach(function(doc) {
          data_id.push(doc.id);
          var {campaignName} = doc.data();
          name.push(campaignName);
        });
        for(var i=0;i<name.length;i++){
          // push the component to elements!
         elements.push(<Card value={ name[i] } />);
        }
        this.setState({ ids: data_id, names: name, elementts: elements });
      });
  };

  render() {
    return (
      <div>
        <ol>
        {this.state.names.map(document => (
          <li key={document}>{document}</li>
        ))}
        </ol>
        {this.state.elementts}
      </div>
    );
  }
}
export default ListCampaigns;