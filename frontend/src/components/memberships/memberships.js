import {render} from "react-dom";
import React, {useEffect, useState} from "react";
import BackArrow from "../common/back_arrow";
import MembershipTypes from "./membership_types";
import MembershipEdit from "./memberships_edit";


const Memberships = () => {


  return (
    <section className="section">
      <div className={"container"}>
        <BackArrow path={'/'}/>
      </div>
      <MembershipTypes />
      <MembershipEdit />
    </section>
  );
};



export default Memberships;

const container = document.getElementById("memberships");
if (container) {
  render(<Memberships />, container);
}
