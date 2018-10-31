import { Card, Col, Row, Button } from "antd";
import { Redirect } from "react-router-dom";
import { db } from "../firebase-init";
import "./VotingScreen.css";
import React from "react";
class votingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.renderMember = this.renderMember.bind(this);
    this.handleVote = this.handleVote.bind(this);
    this.state = {
      voters: null
    };
  }

  componentDidMount() {
    const { campaign } = window;
    if (campaign) {
      const voters = campaign.data.members.filter(member => {
        return member.candidate && member;
      });

      const voterComponents = voters.map((candidate, index) => {
        return this.renderMember(candidate, index);
      });

      console.log(voterComponents);
      this.setState(prevState => ({
        ...prevState,
        voters: voterComponents
      }));
    }
  }
  async handleVote(e) {
    // the user who voted

    const { user } = window.campaign;
    
    // the candidates email
    const candidateEmail = e.target.getAttribute("email");

    const campaignRef = await db.collection("campaigns").doc(window.campaign.cid);

    const campaign = await campaignRef.get();
    const campaignData = campaign.data();

    const newMembers = campaignData.members.map((thisUser, index) => {
      // the person who has voted will get it's 'voted' field set to true.
      if (user.email === thisUser.email) {
        if (candidateEmail === thisUser.email) {
          if (thisUser.votes) {
            return {
              ...thisUser,
              voted: true,
              votes: [...thisUser.votes, user.email]
            };
          } else {
            return {
              ...thisUser,
              voted: true,
              votes: [user.email]
            };
          }
        } else {
          return {
            ...thisUser,
            voted: true
          };
        }
      }
      if (candidateEmail === thisUser.email) {
        if (thisUser.votes) {
          return {
            ...thisUser,
            votes: [...thisUser.votes, user.email]
          };
        } else {
          return {
            ...thisUser,
            votes: [user.email]
          };
        }
      }
      return thisUser;
    });

    const newCampaingData = {
      ...campaignData,
      members : newMembers
    }
    
    const newRecord = await campaignRef.set(newCampaingData, {merge: true});


  }
  renderMember(candidate, key) {
    return (
      <Col key={key} span={40}>
        <Card title={candidate.title} bordered={true}>
          <Button onClick={this.handleVote} email={candidate.email}>
            Vote
          </Button>
        </Card>
      </Col>
    );
  }
  render() {
    if (!window.campaign) {
      return <Redirect to="/login" />;
    }
    return (
      <div className = "form-wrapper">
        <div style={{ background: "#ECECEC", padding: "20px" }}>
          <Row gutter={40}>{this.state.voters ? this.state.voters : null}</Row>
        </div>
      </div>
    );
  }
}
export default votingScreen;